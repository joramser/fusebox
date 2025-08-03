import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { Button } from "@web/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import { CheckIcon, EraserIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

export type StreamOptionsMenuProps = {
  process: ProcessSchema | undefined;
  onClear: (process: ProcessSchema) => void;
};

export const StreamOptionsMenu = ({ process, onClear }: StreamOptionsMenuProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text?: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

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
              <Badge
                variant="secondary"
                className="group relative text-xs hover:opacity-80"
                onClick={() => handleCopy(process.spawn.pid?.toString())}
              >
                <span className="group-hover:opacity-0 transition-opacity">
                  pid: {process.spawn.pid}
                </span>
                <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity select-none">
                  {copied ? <CheckIcon className="size-4" /> : "Copy pid"}
                </span>
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
                onClick={() => {
                  if (process) {
                    onClear(process);
                  }
                }}
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
