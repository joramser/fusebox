import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { CodeIcon, FolderIcon } from "@phosphor-icons/react";
import { OnOffSwitch } from "@web/components/on-off-switch";
import { Button } from "@web/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import type { Commands } from "@web/lib/rpc-client";
import { cn } from "@web/lib/utils";
import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export type ProcessTabProps = {
  index: number;
  process: ProcessSchema;
  isSelected: boolean;
  onSelect: (process: ProcessSchema) => void;
  onToggle: (process: ProcessSchema) => void;
  onCommand: (command: Commands, process: ProcessSchema) => void;
};

export const ProcessTab = ({
  index,
  process,
  isSelected,
  onSelect,
  onToggle,
  onCommand,
}: ProcessTabProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useHotkeys(
    index.toString(),
    () => {
      onSelect(process);
    },
    {
      enabled: index < 10,
    },
  );

  useEffect(() => {
    if (isSelected) {
      itemRef.current?.focus();
    }
  }, [isSelected]);

  return (
    <div
      ref={itemRef}
      role="menu"
      className={cn(
        "border transition-colors shadow-xs flex flex-col gap-4 py-2 px-2 rounded-md cursor-pointer outline-0",
        {
          "shadow-md border-primary": isSelected,
        },
      )}
      tabIndex={0}
      key={process.name}
      onClick={() => onSelect(process)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(process);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center align-middle w-4/5">
          <StatusIndicator status={process.spawn.status} />
          <h1
            className="font-mono text-sm text-nowrap overflow-hidden text-ellipsis"
            title={process.name}
          >
            {process.name}
          </h1>
        </div>
        <OnOffSwitch
          checked={process.spawn.status === "running"}
          onCheckedChange={() => onToggle(process)}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex gap-1 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="px-2"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCommand("open-folder", process);
                  }}
                >
                  <FolderIcon strokeWidth="1.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Folder</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="px-2"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCommand("open-ide", process);
                  }}
                >
                  <CodeIcon strokeWidth="1.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open IDE</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status }: { status: ProcessSchema["spawn"]["status"] }) => {
  return (
    <div
      className={cn("size-2 rounded-full bg-muted-foreground shrink-0", {
        "bg-emerald-500": status === "running",
        "bg-amber-500": status === "killed",
      })}
    />
  );
};
