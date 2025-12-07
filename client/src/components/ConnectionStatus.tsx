import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useSessionStore } from "@/store/sessionStore";

export function ConnectionStatus() {
  const connectionStatus = useSessionStore((state) => state.connectionStatus);
  const participantCount = useSessionStore(
    (state) => state.participants.length
  );

  return (
    <div
      className="flex items-center gap-2 text-sm"
      data-testid="status-connection"
      role="status"
      aria-live="polite"
    >
      {connectionStatus === "connected" && (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-online opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-online" />
          </span>
          <span className="text-muted-foreground">
            Connected
            {participantCount > 0 && (
              <span className="ml-1 text-foreground font-medium">
                {participantCount} {participantCount === 1 ? "user" : "users"}
              </span>
            )}
          </span>
        </>
      )}

      {connectionStatus === "connecting" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-status-away" />
          <span className="text-muted-foreground">Connecting...</span>
        </>
      )}

      {connectionStatus === "disconnected" && (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-status-busy" />
          </span>
          <span className="text-muted-foreground">Disconnected</span>
        </>
      )}
    </div>
  );
}
