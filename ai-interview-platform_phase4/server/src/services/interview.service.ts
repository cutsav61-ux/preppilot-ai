import { Interview, type InterviewDocument } from "../models/Interview.model";
import { User } from "../models/User.model";
import { aiService } from "./ai/ai.service";
import { AppError } from "../middlewares/error.middleware";
import { calendarDaysBetween } from "../utils/date";
import type { CreateInterviewInput, SubmitAnswerInput, ListInterviewsQuery } from "../validators/interview.validator";

function assertOwnership(interview: InterviewDocument, userId: string) {
  if (interview.userId.toString() !== userId) {
    throw new AppError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
  }
}

export const interviewService = {
  async createInterview(userId: string, input: CreateInterviewInput) {
    const generatedQuestions = await aiService.generateQuestions({
      type: input.type,
      difficulty: input.difficulty,
      topic: input.topic,
      count: input.numQuestions,
    });

    const interview = await Interview.create({
      userId,
      type: input.type,
      topic: input.topic,
      difficulty: input.difficulty,
      status: "in_progress",
      questions: generatedQuestions,
      startedAt: new Date(),
    });

    return interview;
  },

  async listInterviews(userId: string, query: ListInterviewsQuery) {
    const skip = (query.page - 1) * query.limit;

    const filter: Record<string, unknown> = { userId };
    if (query.type) filter.type = query.type;
    if (query.difficulty) filter.difficulty = query.difficulty;
    if (query.status) filter.status = query.status;

    const [interviews, total] = await Promise.all([
      Interview.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
      Interview.countDocuments(filter),
    ]);

    return {
      interviews,
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit)),
      },
    };
  },

  async getInterviewById(userId: string, interviewId: string) {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new AppError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
    }
    assertOwnership(interview, userId);
    return interview;
  },

  async submitAnswer(userId: string, interviewId: string, input: SubmitAnswerInput) {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new AppError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
    }
    assertOwnership(interview, userId);

    if (interview.status !== "in_progress") {
      throw new AppError("This interview has already ended.", 409, "INTERVIEW_NOT_ACTIVE");
    }

    const question = interview.questions.find((q) => q.order === input.questionOrder);
    if (!question) {
      throw new AppError("That question doesn't exist on this interview.", 404, "QUESTION_NOT_FOUND");
    }

    question.userAnswer = input.answerText;
    question.answeredAt = new Date();
    question.timeTakenSeconds = input.timeTakenSeconds;

    await interview.save();
    return interview;
  },

  async completeInterview(userId: string, interviewId: string) {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new AppError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
    }
    assertOwnership(interview, userId);

    if (interview.status !== "in_progress") {
      throw new AppError("This interview has already ended.", 409, "INTERVIEW_NOT_ACTIVE");
    }

    const { questionEvaluations, overallFeedback } = await aiService.evaluateInterview({
      type: interview.type,
      difficulty: interview.difficulty,
      topic: interview.topic,
      questions: interview.questions.map((q) => ({
        order: q.order,
        questionText: q.questionText,
        category: q.category,
        userAnswer: q.userAnswer,
      })),
    });

    const evaluationByOrder = new Map(questionEvaluations.map((e) => [e.order, e]));
    interview.questions.forEach((question) => {
      const evaluation = evaluationByOrder.get(question.order);
      if (evaluation) {
        question.evaluation = evaluation;
      }
    });
    interview.overallFeedback = overallFeedback;

    const completedAt = new Date();
    interview.status = "completed";
    interview.completedAt = completedAt;
    interview.durationSeconds = Math.round(
      (completedAt.getTime() - interview.startedAt.getTime()) / 1000,
    );
    await interview.save();

    const user = await User.findById(userId);
    if (user) {
      const prevTotal = user.stats.totalInterviews;
      const newTotal = prevTotal + 1;
      const newAvgScore = Math.round(
        (user.stats.avgScore * prevTotal + overallFeedback.overallScore) / newTotal,
      );

      let newStreak = 1;
      if (user.stats.lastInterviewAt) {
        const daysSinceLast = calendarDaysBetween(user.stats.lastInterviewAt, completedAt);
        if (daysSinceLast === 0) newStreak = user.stats.currentStreak || 1;
        else if (daysSinceLast === 1) newStreak = (user.stats.currentStreak || 0) + 1;
        else newStreak = 1;
      }

      user.stats.totalInterviews = newTotal;
      user.stats.avgScore = newAvgScore;
      user.stats.currentStreak = newStreak;
      user.stats.lastInterviewAt = completedAt;
      await user.save();
    }

    return interview;
  },

  async abandonInterview(userId: string, interviewId: string) {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new AppError("Interview not found.", 404, "INTERVIEW_NOT_FOUND");
    }
    assertOwnership(interview, userId);

    if (interview.status !== "in_progress") {
      throw new AppError("This interview has already ended.", 409, "INTERVIEW_NOT_ACTIVE");
    }

    interview.status = "abandoned";
    await interview.save();
    return interview;
  },
};
