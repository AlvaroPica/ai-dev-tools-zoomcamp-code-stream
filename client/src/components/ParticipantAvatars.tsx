import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSessionStore } from "@/store/sessionStore";

export function ParticipantAvatars() {
  const participants = useSessionStore((state) => state.participants);

  if (participants.length === 0) {
    return null;
  }

  return (
    <div
      className="flex items-center -space-x-2"
      data-testid="participant-avatars"
      role="group"
      aria-label="Active participants"
    >
      {participants.slice(0, 5).map((participant) => (
        <Tooltip key={participant.id}>
          <TooltipTrigger asChild>
            <div className="relative">
              <Avatar
                className="h-7 w-7 border-2 border-background"
                style={{ boxShadow: `0 0 0 2px ${participant.color}` }}
              >
                <AvatarFallback
                  className="text-xs font-medium"
                  style={{
                    backgroundColor: participant.color,
                    color: "#fff",
                  }}
                >
                  {participant.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-status-online"
                aria-hidden="true"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {participant.name}
          </TooltipContent>
        </Tooltip>
      ))}

      {participants.length > 5 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className="h-7 w-7 border-2 border-background bg-muted">
              <AvatarFallback className="text-xs font-medium text-muted-foreground">
                +{participants.length - 5}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {participants.length - 5} more participants
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
