import { create } from "zustand";
import type { ExecutionResult } from "@shared/schema";

interface Participant {
  id: string;
  name: string;
  color: string;
  cursorPosition?: {
    line: number;
    column: number;
  };
}

interface SessionState {
  sessionId: string | null;
  code: string;
  language: "javascript" | "python";
  participants: Participant[];
  connectionStatus: "disconnected" | "connecting" | "connected";
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  executionHistory: ExecutionResult[];

  setSessionId: (id: string | null) => void;
  setCode: (code: string) => void;
  setLanguage: (language: "javascript" | "python") => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipantCursor: (
    participantId: string,
    position: { line: number; column: number }
  ) => void;
  setConnectionStatus: (
    status: "disconnected" | "connecting" | "connected"
  ) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  setExecutionResult: (result: ExecutionResult | null) => void;
  addToExecutionHistory: (result: ExecutionResult) => void;
  clearExecutionHistory: () => void;
  reset: () => void;
}

const initialState = {
  sessionId: null,
  code: "",
  language: "javascript" as const,
  participants: [],
  connectionStatus: "disconnected" as const,
  isExecuting: false,
  executionResult: null,
  executionHistory: [],
};

export const useSessionStore = create<SessionState>((set) => ({
  ...initialState,

  setSessionId: (id) => set({ sessionId: id }),

  setCode: (code) => set({ code }),

  setLanguage: (language) => set({ language }),

  addParticipant: (participant) =>
    set((state) => {
      const exists = state.participants.some((p) => p.id === participant.id);
      if (exists) return state;
      return { participants: [...state.participants, participant] };
    }),

  removeParticipant: (participantId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.id !== participantId),
    })),

  updateParticipantCursor: (participantId, position) =>
    set((state) => ({
      participants: state.participants.map((p) =>
        p.id === participantId ? { ...p, cursorPosition: position } : p
      ),
    })),

  setConnectionStatus: (status) => set({ connectionStatus: status }),

  setIsExecuting: (isExecuting) => set({ isExecuting }),

  setExecutionResult: (result) => set({ executionResult: result }),

  addToExecutionHistory: (result) =>
    set((state) => ({
      executionHistory: [result, ...state.executionHistory].slice(0, 10),
    })),

  clearExecutionHistory: () => set({ executionHistory: [] }),

  reset: () => set(initialState),
}));
