import { v4 as uuidv4 } from "uuid";
import type { CreateSessionResponse, Session } from "@shared/schema";

const MOCK_DELAY = 300;

const sessions = new Map<string, Session>();

const defaultJSCode = `// Welcome to CodeCollab!
// Write your JavaScript code here

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("World"));
`;

const defaultPythonCode = `# Welcome to CodeCollab!
# Write your Python code here

def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
`;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createSession(): Promise<CreateSessionResponse> {
  await delay(MOCK_DELAY);

  const id = uuidv4();
  const language = "javascript" as const;
  const session: Session = {
    id,
    code: defaultJSCode,
    language,
    createdAt: new Date().toISOString(),
    participants: [],
  };

  sessions.set(id, session);

  return {
    id: session.id,
    code: session.code,
    language: session.language,
    createdAt: session.createdAt,
  };
}

export async function getSession(id: string): Promise<Session | null> {
  await delay(MOCK_DELAY / 2);

  const session = sessions.get(id);
  if (!session) {
    const newSession: Session = {
      id,
      code: defaultJSCode,
      language: "javascript",
      createdAt: new Date().toISOString(),
      participants: [],
    };
    sessions.set(id, newSession);
    return newSession;
  }

  return session;
}

export async function updateSessionCode(
  id: string,
  code: string
): Promise<void> {
  await delay(50);

  const session = sessions.get(id);
  if (session) {
    session.code = code;
  }
}

export async function updateSessionLanguage(
  id: string,
  language: "javascript" | "python"
): Promise<{ code: string }> {
  await delay(100);

  const session = sessions.get(id);
  if (session) {
    session.language = language;
    session.code = language === "javascript" ? defaultJSCode : defaultPythonCode;
    return { code: session.code };
  }

  return { code: language === "javascript" ? defaultJSCode : defaultPythonCode };
}

export const mockApi = {
  createSession,
  getSession,
  updateSessionCode,
  updateSessionLanguage,
};
