import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.enum(["javascript", "python"]),
  createdAt: z.string(),
  participants: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
    cursorPosition: z.object({
      line: z.number(),
      column: z.number(),
    }).optional(),
  })),
});

export type Session = z.infer<typeof sessionSchema>;

export const createSessionResponseSchema = z.object({
  id: z.string(),
  code: z.string(),
  language: z.enum(["javascript", "python"]),
  createdAt: z.string(),
});

export type CreateSessionResponse = z.infer<typeof createSessionResponseSchema>;

export const codeUpdateMessageSchema = z.object({
  type: z.literal("code_update"),
  sessionId: z.string(),
  code: z.string(),
  userId: z.string(),
  timestamp: z.string(),
});

export type CodeUpdateMessage = z.infer<typeof codeUpdateMessageSchema>;

export const cursorUpdateMessageSchema = z.object({
  type: z.literal("cursor_update"),
  sessionId: z.string(),
  userId: z.string(),
  userName: z.string(),
  color: z.string(),
  position: z.object({
    line: z.number(),
    column: z.number(),
  }),
  timestamp: z.string(),
});

export type CursorUpdateMessage = z.infer<typeof cursorUpdateMessageSchema>;

export const participantJoinMessageSchema = z.object({
  type: z.literal("participant_join"),
  sessionId: z.string(),
  participant: z.object({
    id: z.string(),
    name: z.string(),
    color: z.string(),
  }),
  timestamp: z.string(),
});

export type ParticipantJoinMessage = z.infer<typeof participantJoinMessageSchema>;

export const participantLeaveMessageSchema = z.object({
  type: z.literal("participant_leave"),
  sessionId: z.string(),
  participantId: z.string(),
  timestamp: z.string(),
});

export type ParticipantLeaveMessage = z.infer<typeof participantLeaveMessageSchema>;

export const executionResultMessageSchema = z.object({
  type: z.literal("execution_result"),
  sessionId: z.string(),
  output: z.string(),
  error: z.string().optional(),
  executionTime: z.number(),
  timestamp: z.string(),
});

export type ExecutionResultMessage = z.infer<typeof executionResultMessageSchema>;

export const wsMessageSchema = z.discriminatedUnion("type", [
  codeUpdateMessageSchema,
  cursorUpdateMessageSchema,
  participantJoinMessageSchema,
  participantLeaveMessageSchema,
  executionResultMessageSchema,
]);

export type WsMessage = z.infer<typeof wsMessageSchema>;

export const executionResultSchema = z.object({
  output: z.string(),
  error: z.string().optional(),
  executionTime: z.number(),
  language: z.enum(["javascript", "python"]),
});

export type ExecutionResult = z.infer<typeof executionResultSchema>;
