import { Play, Loader2, Copy, Check, Share2, Link } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  const [linkCopied, setLinkCopied] = useState(false);

  const shortSessionId = sessionId.slice(0, 8);
  const shareableUrl = `${window.location.origin}/session/${sessionId}`;

  const handleCopySessionId = async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy session ID:", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
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

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" data-testid="button-share">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share this session</DialogTitle>
              <DialogDescription>
                Share this link with candidates to invite them to the coding session.
                Anyone with the link can join and collaborate in real-time.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <Link className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Session Link</p>
                  <p className="text-xs text-muted-foreground">
                    Copy and share this link
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={shareableUrl}
                  readOnly
                  className="font-mono text-sm"
                  data-testid="input-share-url"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="secondary"
                  data-testid="button-copy-link"
                >
                  {linkCopied ? (
                    <>
                      <Check className="mr-2 h-4 w-4 text-status-online" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="rounded-md bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> All participants can see and edit the code in real-time. Code execution results are visible to everyone.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
