import { useRef, useEffect } from "react";
import {
  Terminal,
  AlertCircle,
  Clock,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/store/sessionStore";

export function OutputPanel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const executionResult = useSessionStore((state) => state.executionResult);
  const executionHistory = useSessionStore((state) => state.executionHistory);
  const isExecuting = useSessionStore((state) => state.isExecuting);
  const clearExecutionHistory = useSessionStore(
    (state) => state.clearExecutionHistory
  );

  useEffect(() => {
    if (scrollRef.current && executionResult) {
      scrollRef.current.scrollTop = 0;
    }
  }, [executionResult]);

  const hasOutput =
    executionResult || executionHistory.length > 0 || isExecuting;

  return (
    <div
      className="flex h-full flex-col bg-card"
      data-testid="output-panel"
      role="region"
      aria-label="Code execution output"
    >
      <div className="flex h-10 items-center justify-between gap-2 border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Output</span>
          {executionHistory.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {executionHistory.length}
            </Badge>
          )}
        </div>
        {executionHistory.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearExecutionHistory}
            data-testid="button-clear-output"
            aria-label="Clear output history"
            className="h-7 w-7"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div ref={scrollRef} className="p-4 space-y-4">
          {!hasOutput && (
            <div
              className="flex h-48 flex-col items-center justify-center text-center"
              data-testid="output-empty-state"
            >
              <div className="rounded-full bg-muted p-3 mb-3">
                <Terminal className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                No output yet
              </p>
              <p className="text-xs text-muted-foreground max-w-[200px]">
                Run your code to see the output here
              </p>
            </div>
          )}

          {isExecuting && (
            <div
              className="flex items-center gap-3 rounded-md border border-border bg-muted/50 p-3"
              data-testid="output-executing"
            >
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">
                Executing code...
              </span>
            </div>
          )}

          {executionResult && !isExecuting && (
            <div className="space-y-3" data-testid="output-result">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {executionResult.error ? (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-status-online" />
                  )}
                  <span className="text-sm font-medium">
                    {executionResult.error ? "Error" : "Success"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {executionResult.executionTime.toFixed(2)}ms
                </div>
              </div>

              {executionResult.output && (
                <div className="rounded-md border border-border bg-background p-3">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words text-foreground">
                    {executionResult.output}
                  </pre>
                </div>
              )}

              {executionResult.error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3">
                  <pre className="font-mono text-sm whitespace-pre-wrap break-words text-destructive">
                    {executionResult.error}
                  </pre>
                </div>
              )}
            </div>
          )}

          {executionHistory.length > 1 && (
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Previous Results
              </p>
              <div className="space-y-2">
                {executionHistory.slice(1).map((result, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border bg-muted/30 p-3"
                    data-testid={`output-history-${index}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {result.error ? (
                          <AlertCircle className="h-3 w-3 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3 text-status-online" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {result.language}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {result.executionTime.toFixed(2)}ms
                      </span>
                    </div>
                    <pre className="font-mono text-xs whitespace-pre-wrap break-words text-muted-foreground line-clamp-3">
                      {result.error || result.output || "No output"}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
