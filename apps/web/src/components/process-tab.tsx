import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { OnOffSwitch } from "@web/components/on-off-switch";
import { Button } from "@web/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import { apiClient } from "@web/lib/rpc-client";
import { cn } from "@web/lib/utils";
import { CodeIcon, FolderCodeIcon } from "lucide-react";

export type ProcessTabProps = {
  process: ProcessSchema;
  isSelected: boolean;
  onSelect: (process: ProcessSchema) => void;
  onToggle: (app: ProcessSchema) => void;
};

export const ProcessTab = ({ process, isSelected, onSelect, onToggle }: ProcessTabProps) => {
  return (
    <div
      role="menu"
      className={cn(
        "border transition-colors shadow-xs flex flex-col gap-4 py-2 px-2 rounded-md cursor-pointer",
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
        <div className="flex gap-2 items-center align-middle">
          <StatusIndicator status={process.spawn.status} />
          <h1 className="font-mono text-sm">{process.name}</h1>
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
                    apiClient.commands[":name"]["open-folder"].$post({
                      param: {
                        name: process.name,
                      },
                    });
                  }}
                >
                  <FolderCodeIcon strokeWidth="1.5" />
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
                  onClick={() => {
                    apiClient.commands[":name"]["open-ide"].$post({
                      param: {
                        name: process.name,
                      },
                    });
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
      className={cn("h-2 w-2 rounded-full bg-muted-foreground", {
        "bg-green-500": status === "running",
        "bg-yellow-500": status === "exited",
      })}
    />
  );
};
