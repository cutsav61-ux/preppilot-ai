import { z } from "zod";

export const interviewSetupSchema = z.object({
  type: z.enum(["technical", "hr"], { required_error: "Choose an interview type" }),
  difficulty: z.enum(["easy", "medium", "hard"], { required_error: "Choose a difficulty" }),
  topic: z.string().trim().min(2, "Tell us the role or topic").max(80),
  numQuestions: z.number().int().min(3).max(10),
});
export type InterviewSetupFormValues = z.infer<typeof interviewSetupSchema>;

export const ROLE_OPTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist / ML",
  "DevOps Engineer",
  "Mobile Developer",
  "QA / SDET",
  "DSA / General CS",
] as const;
