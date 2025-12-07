import { v4 as uuidv4 } from "uuid";
import type {
  WsMessage,
  CodeUpdateMessage,
  CursorUpdateMessage,
  ParticipantJoinMessage,
  ParticipantLeaveMessage,
} from "@shared/schema";

type MessageHandler = (message: WsMessage) => void;
type ConnectionHandler = () => void;

interface MockUser {
  id: string;
  name: string;
  color: string;
}

const PARTICIPANT_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export class MockWebSocketClient {
  private sessionId: string;
  private userId: string;
  private userName: string;
  private userColor: string;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private connected: boolean = false;
  private mockUsers: MockUser[] = [];
  private simulationInterval: NodeJS.Timeout | null = null;

  constructor(sessionId: string, userName: string = "User 1") {
    this.sessionId = sessionId;
    this.userId = uuidv4();
    this.userName = userName;
    this.userColor = PARTICIPANT_COLORS[0];
  }

  connect(): void {
    setTimeout(() => {
      this.connected = true;
      this.connectionHandlers.forEach((handler) => handler());

      const joinMessage: ParticipantJoinMessage = {
        type: "participant_join",
        sessionId: this.sessionId,
        participant: {
          id: this.userId,
          name: this.userName,
          color: this.userColor,
        },
        timestamp: new Date().toISOString(),
      };
      this.messageHandlers.forEach((handler) => handler(joinMessage));

      this.startMockSimulation();
    }, 500);
  }

  disconnect(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }

    if (this.connected) {
      const leaveMessage: ParticipantLeaveMessage = {
        type: "participant_leave",
        sessionId: this.sessionId,
        participantId: this.userId,
        timestamp: new Date().toISOString(),
      };
      this.messageHandlers.forEach((handler) => handler(leaveMessage));

      this.mockUsers.forEach((user) => {
        const mockLeaveMessage: ParticipantLeaveMessage = {
          type: "participant_leave",
          sessionId: this.sessionId,
          participantId: user.id,
          timestamp: new Date().toISOString(),
        };
        this.messageHandlers.forEach((handler) => handler(mockLeaveMessage));
      });

      this.connected = false;
      this.disconnectionHandlers.forEach((handler) => handler());
    }
  }

  private startMockSimulation(): void {
    setTimeout(() => {
      if (!this.connected) return;

      const mockUser: MockUser = {
        id: uuidv4(),
        name: "Interviewer",
        color: PARTICIPANT_COLORS[1],
      };
      this.mockUsers.push(mockUser);

      const joinMessage: ParticipantJoinMessage = {
        type: "participant_join",
        sessionId: this.sessionId,
        participant: mockUser,
        timestamp: new Date().toISOString(),
      };
      this.messageHandlers.forEach((handler) => handler(joinMessage));
    }, 2000);

    this.simulationInterval = setInterval(() => {
      if (!this.connected || this.mockUsers.length === 0) return;

      const mockUser = this.mockUsers[0];
      const cursorMessage: CursorUpdateMessage = {
        type: "cursor_update",
        sessionId: this.sessionId,
        userId: mockUser.id,
        userName: mockUser.name,
        color: mockUser.color,
        position: {
          line: Math.floor(Math.random() * 10) + 1,
          column: Math.floor(Math.random() * 20) + 1,
        },
        timestamp: new Date().toISOString(),
      };
      this.messageHandlers.forEach((handler) => handler(cursorMessage));
    }, 3000);
  }

  sendCodeUpdate(code: string): void {
    if (!this.connected) return;

    const message: CodeUpdateMessage = {
      type: "code_update",
      sessionId: this.sessionId,
      code,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      this.messageHandlers.forEach((handler) => handler(message));
    }, 50);
  }

  sendCursorUpdate(line: number, column: number): void {
    if (!this.connected) return;

    const message: CursorUpdateMessage = {
      type: "cursor_update",
      sessionId: this.sessionId,
      userId: this.userId,
      userName: this.userName,
      color: this.userColor,
      position: { line, column },
      timestamp: new Date().toISOString(),
    };

    setTimeout(() => {
      this.messageHandlers.forEach((handler) => handler(message));
    }, 20);
  }

  onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onConnect(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => this.connectionHandlers.delete(handler);
  }

  onDisconnect(handler: ConnectionHandler): () => void {
    this.disconnectionHandlers.add(handler);
    return () => this.disconnectionHandlers.delete(handler);
  }

  isConnected(): boolean {
    return this.connected;
  }

  getUserId(): string {
    return this.userId;
  }

  getUserName(): string {
    return this.userName;
  }

  getUserColor(): string {
    return this.userColor;
  }
}

export function createSocketClient(
  sessionId: string,
  userName?: string
): MockWebSocketClient {
  return new MockWebSocketClient(sessionId, userName);
}
