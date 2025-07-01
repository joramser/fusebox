import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { Button } from "@web/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import { EraserIcon } from "lucide-react";
import { Badge } from "./ui/badge";

export type StreamOptionsMenuProps = {
  process: ProcessSchema | undefined;
  onClear: (() => void) | undefined;
};

export const StreamOptionsMenu = ({ process, onClear }: StreamOptionsMenuProps) => {
  return (
    <div className="flex gap-2 items-center justify-between">
      <div className="flex gap-4 items-center">
        {process && (
          <>
            <div className="flex flex-col">
              <span className="font-mono">{process.name}</span>
              <span className="text-xs text-muted-foreground">
                {">"} {process.command} {process.args}
              </span>
            </div>
            {process.spawn.pid && process.spawn.status === "running" && (
              <Badge variant="secondary" className="text-xs">
                pid: {process.spawn.pid}
              </Badge>
            )}
          </>
        )}
      </div>

      <div className="flex gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                className="px-2"
                variant="outline"
                onClick={onClear}
                disabled={!process}
              >
                <EraserIcon strokeWidth="1.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
