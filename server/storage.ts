import { randomUUID } from "crypto";

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface Participant {
  id: string;
  name: string;
  color: string;
  cursorPosition?: {
    line: number;
    column: number;
  };
}

export interface Session {
  id: string;
  code: string;
  language: "javascript" | "python";
  createdAt: string;
  participants: Participant[];
}

export interface InsertSession {
  code?: string;
  language?: "javascript" | "python";
}

const PARTICIPANT_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

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

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSession(data?: InsertSession): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  updateSessionCode(id: string, code: string): Promise<Session | undefined>;
  updateSessionLanguage(id: string, language: "javascript" | "python"): Promise<Session | undefined>;
  addParticipant(sessionId: string, name: string): Promise<Participant | undefined>;
  removeParticipant(sessionId: string, participantId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, Session>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSession(data?: InsertSession): Promise<Session> {
    const id = randomUUID();
    const language = data?.language || "javascript";
    const session: Session = {
      id,
      code: data?.code || (language === "javascript" ? defaultJSCode : defaultPythonCode),
      language,
      createdAt: new Date().toISOString(),
      participants: [],
    };
    this.sessions.set(id, session);
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    return this.sessions.get(id);
  }

  async updateSessionCode(id: string, code: string): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (session) {
      session.code = code;
      return session;
    }
    return undefined;
  }

  async updateSessionLanguage(id: string, language: "javascript" | "python"): Promise<Session | undefined> {
    const session = this.sessions.get(id);
    if (session) {
      session.language = language;
      session.code = language === "javascript" ? defaultJSCode : defaultPythonCode;
      return session;
    }
    return undefined;
  }

  async addParticipant(sessionId: string, name: string): Promise<Participant | undefined> {
    const session = this.sessions.get(sessionId);
    if (session) {
      const participant: Participant = {
        id: randomUUID(),
        name,
        color: PARTICIPANT_COLORS[session.participants.length % PARTICIPANT_COLORS.length],
      };
      session.participants.push(participant);
      return participant;
    }
    return undefined;
  }

  async removeParticipant(sessionId: string, participantId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.participants = session.participants.filter(p => p.id !== participantId);
    }
  }
}

export const storage = new MemStorage();
