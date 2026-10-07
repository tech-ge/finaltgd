export const CALL_HANDLING_POLICY = {
  autoAnswerKnownCallers: true,
  autoAnswerUnknownCallers: false,
  requireHistoryForResponse: true,
  transferToUserWhenUncertain: true,
  uncertaintyThreshold: 0.6,
  logAllHandledCalls: true,
  neverRecordAudio: true,
} as const;
