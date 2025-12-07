import { Play, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "./ThemeToggle";
import { ConnectionStatus } from "./ConnectionStatus";
import { ParticipantAvatars } from "./ParticipantAvatars";
import { LanguageSelector } from "./LanguageSelector";
import { useSessionStore } from "@/store/sessionStore";

interface SessionHeaderProps {
  sessionId: string;
  onRunCode: () => void;
  onLanguageChange?: (language: "javascript" | "python") => void;
}

export function SessionHeader({
  sessionId,
  onRunCode,
  onLanguageChange,
}: SessionHeaderProps) {
  const isExecuting = useSessionStore((state) => state.isExecuting);
  const [copied, setCopied] = useState(false);

  const shortSessionId = sessionId.slice(0, 8);

  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy session ID:", err);
    }
  };

  return (
    <header
      className="flex h-14 items-center justify-between gap-4 border-b border-border bg-card px-4"
      role="banner"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            CodeCollab
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopySessionId}
                className="flex items-center gap-1.5 rounded-full"
                data-testid="button-copy-session-id"
                aria-label="Copy session ID"
              >
                <Badge variant="secondary" className="font-mono text-xs gap-1">
                  {shortSessionId}
                  {copied ? (
                    <Check className="h-3 w-3 text-status-online" />
                  ) : (
                    <Copy className="h-3 w-3 opacity-50" />
                  )}
                </Badge>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              {copied ? "Copied!" : "Click to copy full session ID"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="h-4 w-px bg-border" aria-hidden="true" />

        <ConnectionStatus />
      </div>

      <div className="flex items-center gap-3">
        <ParticipantAvatars />

        <div className="h-4 w-px bg-border" aria-hidden="true" />

        <LanguageSelector onLanguageChange={onLanguageChange} />

        <Button
          onClick={onRunCode}
          disabled={isExecuting}
          data-testid="button-run-code"
          aria-label={isExecuting ? "Running code..." : "Run code"}
        >
          {isExecuting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run Code
            </>
          )}
        </Button>

        <ThemeToggle />
      </div>
    </header>
  );
}
