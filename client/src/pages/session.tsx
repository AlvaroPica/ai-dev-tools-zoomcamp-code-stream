import { useEffect, useRef, useCallback, useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { SessionHeader } from "@/components/SessionHeader";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputPanel } from "@/components/OutputPanel";
import { useSessionStore } from "@/store/sessionStore";
import { api } from "@/api/apiClient";
import { createSocketClient, MockWebSocketClient } from "@/ws/socketClient";
import type { ExecutionResult } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function Session() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const socketRef = useRef<MockWebSocketClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    setSessionId,
    setCode,
    setLanguage,
    setConnectionStatus,
    addParticipant,
    removeParticipant,
    updateParticipantCursor,
    setIsExecuting,
    setExecutionResult,
    addToExecutionHistory,
    reset,
    code,
    language,
  } = useSessionStore();

  useEffect(() => {
    if (!id) {
      setLocation("/");
      return;
    }

    let currentUserId = "";

    const initSession = async () => {
      setIsLoading(true);
      try {
        const session = await api.getSession(id);
        if (session) {
          setSessionId(session.id);
          setCode(session.code);
          setLanguage(session.language);
        } else {
          console.error("Session not found");
          setLocation("/");
          return;
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        setLocation("/");
        return;
      } finally {
        setIsLoading(false);
      }

      setConnectionStatus("connecting");
      const socket = createSocketClient(id, "User 1");
      socketRef.current = socket;
      currentUserId = socket.getUserId();

      socket.onConnect(() => {
        setConnectionStatus("connected");
      });

      socket.onDisconnect(() => {
        setConnectionStatus("disconnected");
      });

      socket.onMessage((message) => {
        switch (message.type) {
          case "participant_join":
            addParticipant(message.participant);
            break;
          case "participant_leave":
            removeParticipant(message.participantId);
            break;
          case "cursor_update":
            updateParticipantCursor(message.userId, message.position);
            break;
          case "code_update":
            if (message.userId !== currentUserId) {
              setCode(message.code);
            }
            break;
          case "execution_result":
            setIsExecuting(false);
            const result: ExecutionResult = {
              output: message.output,
              error: message.error,
              executionTime: message.executionTime,
              language: language,
            };
            setExecutionResult(result);
            addToExecutionHistory(result);
            break;
        }
      });

      socket.connect();
    };

    initSession();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      reset();
    };
  }, [id]);

  const handleCodeChange = useCallback(
    (newCode: string) => {
      if (socketRef.current?.isConnected()) {
        socketRef.current.sendCodeUpdate(newCode);
      }
      api.updateSessionCode(id!, newCode).catch((error) => {
        console.error("Failed to sync code:", error);
      });
    },
    [id]
  );

  const handleCursorChange = useCallback((line: number, column: number) => {
    if (socketRef.current?.isConnected()) {
      socketRef.current.sendCursorUpdate(line, column);
    }
  }, []);

  const handleLanguageChange = useCallback(
    async (newLanguage: "javascript" | "python") => {
      if (!id) return;
      try {
        const result = await api.updateSessionLanguage(id, newLanguage);
        setCode(result.code);
      } catch (error) {
        console.error("Failed to update language:", error);
      }
    },
    [id, setCode]
  );

  const handleRunCode = useCallback(async () => {
    setIsExecuting(true);
    setExecutionResult(null);

    const startTime = performance.now();

    try {
      let output = "";
      let error: string | undefined;

      if (language === "javascript") {
        try {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: unknown[]) => {
              logs.push(args.map(String).join(" "));
            },
            error: (...args: unknown[]) => {
              logs.push(`Error: ${args.map(String).join(" ")}`);
            },
            warn: (...args: unknown[]) => {
              logs.push(`Warning: ${args.map(String).join(" ")}`);
            },
            info: (...args: unknown[]) => {
              logs.push(args.map(String).join(" "));
            },
          };

          const sandbox = new Function(
            "console",
            `
            "use strict";
            try {
              ${code}
            } catch (e) {
              console.error(e.message);
            }
          `
          );

          sandbox(customConsole);
          output = logs.join("\n");
        } catch (e) {
          error = e instanceof Error ? e.message : String(e);
        }
      } else if (language === "python") {
        try {
          if (typeof (window as unknown as { loadPyodide: unknown }).loadPyodide === "function") {
            const pyodide = await (window as unknown as { loadPyodide: () => Promise<{ runPython: (code: string) => string }> }).loadPyodide();
            output = await pyodide.runPython(code);
          } else {
            output = "[Pyodide] Python execution simulated.\n";
            const printMatches = code.match(/print\s*\((.*?)\)/g);
            if (printMatches) {
              printMatches.forEach((match) => {
                const content = match.match(/print\s*\((.*?)\)/)?.[1] || "";
                let value = content.trim();
                if (
                  (value.startsWith('"') && value.endsWith('"')) ||
                  (value.startsWith("'") && value.endsWith("'"))
                ) {
                  value = value.slice(1, -1);
                } else if (value.includes("(")) {
                  value = "[function call result]";
                }
                output += value + "\n";
              });
            }
          }
        } catch (e) {
          error = e instanceof Error ? e.message : String(e);
        }
      }

      const executionTime = performance.now() - startTime;

      const result: ExecutionResult = {
        output: output || (error ? "" : "No output"),
        error,
        executionTime,
        language,
      };

      setExecutionResult(result);
      addToExecutionHistory(result);
    } catch (e) {
      const executionTime = performance.now() - startTime;
      const result: ExecutionResult = {
        output: "",
        error: e instanceof Error ? e.message : "Unknown error occurred",
        executionTime,
        language,
      };
      setExecutionResult(result);
      addToExecutionHistory(result);
    } finally {
      setIsExecuting(false);
    }
  }, [
    code,
    language,
    setIsExecuting,
    setExecutionResult,
    addToExecutionHistory,
  ]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Loading session...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen flex-col bg-background"
      data-testid="session-page"
    >
      <SessionHeader
        sessionId={id || ""}
        onRunCode={handleRunCode}
        onLanguageChange={handleLanguageChange}
      />

      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60} minSize={40}>
            <CodeEditor
              onCodeChange={handleCodeChange}
              onCursorChange={handleCursorChange}
            />
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="w-1 bg-border transition-colors hover:bg-primary/50 active:bg-primary resize-handle"
          />

          <ResizablePanel defaultSize={40} minSize={25}>
            <OutputPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
