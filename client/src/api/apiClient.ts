import { apiRequest } from "@/lib/queryClient";
import type { CreateSessionResponse, Session } from "@shared/schema";

export async function createSession(): Promise<CreateSessionResponse> {
  const response = await fetch("/api/session/create");
  if (!response.ok) {
    throw new Error("Failed to create session");
  }
  return response.json();
}

export async function getSession(id: string): Promise<Session | null> {
  try {
    const response = await fetch(`/api/session/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error("Failed to get session");
    }
    return response.json();
  } catch {
    return null;
  }
}

export async function updateSessionCode(id: string, code: string): Promise<void> {
  await apiRequest("PATCH", `/api/session/${id}/code`, { code });
}

export async function updateSessionLanguage(
  id: string,
  language: "javascript" | "python"
): Promise<{ code: string }> {
  const response = await apiRequest("PATCH", `/api/session/${id}/language`, { language });
  return response.json();
}

export const api = {
  createSession,
  getSession,
  updateSessionCode,
  updateSessionLanguage,
};
