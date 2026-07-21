# AI service

`ai.service.ts` defines the provider-agnostic interface (`generateQuestions`,
`evaluateAnswer`, `generateOverallFeedback`). Implemented in Phase 4.
`providers/` holds the Anthropic/OpenAI adapters; `prompts/` holds versioned
prompt templates. See `docs/architecture.md` §1.4.
