import PDFDocument from "pdfkit";
import type { InterviewDocument } from "../models/Interview.model";

const PAGE_MARGIN = 50;
const BAR_MAX_WIDTH = 300;

function drawScoreBar(doc: PDFKit.PDFDocument, label: string, value: number, y: number) {
  const barX = PAGE_MARGIN + 140;
  const barWidth = (Math.max(0, Math.min(100, value)) / 100) * BAR_MAX_WIDTH;

  doc.fontSize(10).fillColor("#334155").text(label, PAGE_MARGIN, y, { width: 130 });
  doc.rect(barX, y, BAR_MAX_WIDTH, 10).fillColor("#e2e8f0").fill();
  doc.rect(barX, y, barWidth, 10).fillColor("#2f5dff").fill();
  doc.fontSize(10).fillColor("#0f172a").text(String(value), barX + BAR_MAX_WIDTH + 10, y - 1);
}

function drawSectionHeading(doc: PDFKit.PDFDocument, text: string) {
  doc.moveDown(1);
  doc.fontSize(14).fillColor("#0f172a").font("Helvetica-Bold").text(text);
  doc.moveDown(0.3);
  doc.font("Helvetica");
}

function drawBulletList(doc: PDFKit.PDFDocument, items: string[], emptyLabel: string) {
  if (items.length === 0) {
    doc.fontSize(10).fillColor("#64748b").text(emptyLabel);
    return;
  }
  items.forEach((item) => {
    doc.fontSize(10).fillColor("#334155").text(`•  ${item}`, { indent: 10 });
  });
}

/**
 * Renders an interview's AI feedback as a downloadable PDF. Uses pdfkit's
 * vector drawing primitives for the skill-score bars instead of a charting
 * library, so this has no native/canvas build dependency.
 */
export function generateInterviewReportPdf(
  interview: InterviewDocument,
  candidateName: string,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: PAGE_MARGIN, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const feedback = interview.overallFeedback;

    // Header
    doc.fontSize(20).font("Helvetica-Bold").fillColor("#0f172a").text("Interview Report");
    doc.moveDown(0.2);
    doc.fontSize(11).font("Helvetica").fillColor("#64748b").text(candidateName);
    doc.moveDown(1);

    // Interview details
    const detailsLines = [
      `Role / Topic: ${interview.topic}`,
      interview.company ? `Company: ${interview.company}` : null,
      `Type: ${interview.type === "technical" ? "Technical" : "HR / Behavioral"}`,
      `Difficulty: ${interview.difficulty}`,
      `Date: ${interview.completedAt ? interview.completedAt.toDateString() : "—"}`,
      `Time taken: ${interview.durationSeconds ? `${Math.round(interview.durationSeconds / 60)} min` : "—"}`,
    ].filter(Boolean) as string[];

    detailsLines.forEach((line) => {
      doc.fontSize(10).fillColor("#334155").text(line);
    });

    if (!feedback) {
      doc.moveDown(1);
      doc.fontSize(11).fillColor("#b91c1c").text("This interview has no AI feedback available.");
      doc.end();
      return;
    }

    // Overall score
    drawSectionHeading(doc, "Overall Score");
    doc
      .fontSize(28)
      .font("Helvetica-Bold")
      .fillColor("#2f5dff")
      .text(`${feedback.overallScore} / 100`);
    doc.font("Helvetica").fontSize(10).fillColor("#334155").text(feedback.hiringRecommendation);
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor("#475569").text(feedback.summary, { width: 480 });

    // Skill scores
    drawSectionHeading(doc, "Skill Scores");
    let y = doc.y + 5;
    drawScoreBar(doc, "Communication", feedback.communicationScore, y);
    y += 22;
    drawScoreBar(doc, "Technical", feedback.technicalScore, y);
    y += 22;
    drawScoreBar(doc, "Problem Solving", feedback.problemSolvingScore, y);
    y += 22;
    drawScoreBar(doc, "Confidence", feedback.confidenceScore, y);
    doc.y = y + 25;

    // Strengths / Weaknesses / Suggestions
    drawSectionHeading(doc, "Strengths");
    drawBulletList(doc, feedback.topStrengths, "No standout strengths flagged.");

    drawSectionHeading(doc, "Weaknesses");
    drawBulletList(doc, feedback.topImprovements, "No major gaps flagged.");

    drawSectionHeading(doc, "AI Suggestions — Study Next");
    drawBulletList(doc, feedback.recommendedTopics, "No specific topics recommended.");

    drawSectionHeading(doc, "Study Plan");
    drawBulletList(doc, feedback.studyPlan, "No specific action plan generated.");

    drawSectionHeading(doc, "Hiring Recommendation & Company Readiness");
    doc.fontSize(10).fillColor("#334155").text(feedback.hiringRecommendation);
    doc.fontSize(10).fillColor("#334155").text(feedback.companyReadiness);

    // Per-question breakdown
    drawSectionHeading(doc, "Questions Asked");
    interview.questions.forEach((question) => {
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#0f172a")
        .text(`Q${question.order}. ${question.questionText}`, { width: 480 });
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#64748b")
        .text(`Score: ${question.evaluation?.score ?? "—"}/100`);
      if (question.evaluation?.mistakes.length) {
        doc.fontSize(9).fillColor("#b91c1c").text(`Mistakes: ${question.evaluation.mistakes.join("; ")}`, {
          width: 480,
        });
      }
      doc.moveDown(0.4);
    });

    doc.end();
  });
}
