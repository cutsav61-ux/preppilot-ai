interface FallbackQuestion {
  questionText: string;
  category: string;
}

const TECHNICAL_FALLBACK: Record<"easy" | "medium" | "hard", FallbackQuestion[]> = {
  easy: [
    { questionText: "What is the difference between an array and a linked list?", category: "Data Structures" },
    { questionText: "Explain how a hash map works under the hood.", category: "Data Structures" },
    { questionText: "What's the time complexity of binary search, and why?", category: "Algorithms" },
    { questionText: "What is the difference between `==` and `===` (or their equivalent) in your preferred language?", category: "Language Fundamentals" },
    { questionText: "What does it mean for a function to be pure?", category: "Fundamentals" },
    { questionText: "What's the difference between a process and a thread?", category: "Operating Systems" },
  ],
  medium: [
    { questionText: "How would you detect a cycle in a linked list?", category: "Algorithms" },
    { questionText: "Walk me through how you'd design a URL shortener.", category: "System Design" },
    { questionText: "What are the trade-offs between SQL and NoSQL databases?", category: "Databases" },
    { questionText: "How does garbage collection work, broadly speaking?", category: "Runtime Internals" },
    { questionText: "Explain how you'd implement rate limiting for a public API.", category: "System Design" },
    { questionText: "What's the difference between horizontal and vertical scaling?", category: "System Design" },
  ],
  hard: [
    { questionText: "Design a distributed cache — what are the key failure modes and how do you handle them?", category: "System Design" },
    { questionText: "How would you design a system that processes a billion events per day with at-least-once delivery guarantees?", category: "System Design" },
    { questionText: "Walk me through the trade-offs between strong and eventual consistency, with a concrete example.", category: "Distributed Systems" },
    { questionText: "How would you shard a database that's outgrowing a single instance?", category: "Databases" },
    { questionText: "Design a real-time collaborative editor (like Google Docs) — what's your conflict resolution strategy?", category: "System Design" },
  ],
};

const HR_FALLBACK: Record<"easy" | "medium" | "hard", FallbackQuestion[]> = {
  easy: [
    { questionText: "Tell me about yourself.", category: "Introduction" },
    { questionText: "Why do you want to work at this company?", category: "Motivation" },
    { questionText: "What are your greatest strengths?", category: "Self-awareness" },
    { questionText: "Describe a project you're proud of.", category: "Experience" },
    { questionText: "Where do you see yourself in five years?", category: "Motivation" },
  ],
  medium: [
    { questionText: "Tell me about a time you disagreed with a teammate. How did you handle it?", category: "Conflict" },
    { questionText: "Describe a time you had to learn something new quickly.", category: "Adaptability" },
    { questionText: "Tell me about a time you missed a deadline. What happened?", category: "Accountability" },
    { questionText: "How do you prioritize when everything feels urgent?", category: "Time Management" },
    { questionText: "Describe a situation where you had to give difficult feedback to someone.", category: "Communication" },
  ],
  hard: [
    { questionText: "Tell me about the most difficult decision you've had to make under pressure with incomplete information.", category: "Judgment" },
    { questionText: "Describe a time you failed at something important. What did you change afterward?", category: "Growth" },
    { questionText: "Tell me about a time you had to influence someone without formal authority over them.", category: "Leadership" },
    { questionText: "Describe a conflict between doing what's right and doing what you were asked to do.", category: "Ethics" },
  ],
};

export function getFallbackQuestions(
  type: "technical" | "hr",
  difficulty: "easy" | "medium" | "hard",
  count: number,
): FallbackQuestion[] {
  const bank = type === "technical" ? TECHNICAL_FALLBACK[difficulty] : HR_FALLBACK[difficulty];
  // Cycle through the bank if more questions are requested than it holds.
  const result: FallbackQuestion[] = [];
  for (let i = 0; i < count; i += 1) {
    const source = bank[i % bank.length];
    if (source) result.push(source);
  }
  return result;
}
