import type { CommandSchema } from "@fusebox/api/events";
import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { PlusIcon, SlidersHorizontalIcon } from "@phosphor-icons/react";
import { Outlet, useRouter } from "@tanstack/react-router";
import { ProcessTab } from "@web/components/process-tab";
import { StreamOptionsMenu } from "@web/components/stream-options-menu";
import { ThemeToggle } from "@web/components/theme-toggle";
import { Button } from "@web/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@web/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@web/components/ui/tooltip";
import { useWebSocket } from "@web/context/websocket.context";
import { useActiveProcess, useNextProcess, usePreviousProcess, useProcesses } from "@web/store";
import { useHotkeys } from "react-hotkeys-hook";

export type ProcessDashboardProps = {
  processes: ProcessSchema[];
  activeProcess: ProcessSchema | undefined;
};

export const ProcessDashboard = () => {
  const router = useRouter();
  const ws = useWebSocket();

  const processes = useProcesses();

  const activeProcess = useActiveProcess();
  const nextProcess = useNextProcess();
  const previousProcess = usePreviousProcess();

  const onSelectProcess = (process: ProcessSchema) => {
    router.navigate({
      to: `/processes/$processName`,
      params: {
        processName: process.name,
      },
      replace: true,
    });
  };

  const onToggleProcess = (process: ProcessSchema) => {
    if (process.spawn.status !== "running") {
      ws.emit({
        name: "v1.start-process",
        params: {
          processName: process.name,
        },
      });
    } else {
      ws.emit({
        name: "v1.stop-process",
        params: {
          processName: process.name,
        },
      });
    }
  };

  const onClearProcess = (process: ProcessSchema) => {
    ws.emit({
      name: "v1.clear-process-output",
      params: {
        processName: process.name,
      },
    });
  };

  const onProcessCommand = (command: CommandSchema, process: ProcessSchema) => {
    if (command === "open-ide") {
      ws.emit({
        name: "v1.open-ide-command",
        params: {
          processName: process.name,
        },
      });
    } else if (command === "open-folder") {
      ws.emit({
        name: "v1.open-folder-command",
        params: {
          processName: process.name,
        },
      });
    }
  };

  useHotkeys("s", () => {
    if (activeProcess) {
      onToggleProcess(activeProcess);
    }
  });
  useHotkeys("space", () => {
    if (activeProcess) {
      onToggleProcess(activeProcess);
    }
  });
  useHotkeys("c", () => {
    if (activeProcess) {
      onClearProcess(activeProcess);
    }
  });
  useHotkeys("o", () => {
    if (activeProcess) {
      onProcessCommand("open-ide", activeProcess);
    }
  });
  useHotkeys("f", () => {
    if (activeProcess) {
      onProcessCommand("open-folder", activeProcess);
    }
  });
  useHotkeys("j", () => {
    if (nextProcess) {
      onSelectProcess(nextProcess);
    }
  });
  useHotkeys("k", () => {
    if (previousProcess) {
      onSelectProcess(previousProcess);
    }
  });

  return (
    <main className="min-h-screen max-h-screen max-w-screen flex flex-1 gap-4 p-4">
      <div className="w-1/4 md:2/6 lg:w-1/6 shrink-0 flex flex-col gap-2 min-w-0">
        <div className="border-b pb-2 flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <SlidersHorizontalIcon className="size-6" strokeWidth="1.5" />
            <h1 className="text-lg font-semibold font-mono">Fusebox</h1>
          </div>
          <Dialog>
            <DialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="px-2" size="sm" variant="outline">
                      <PlusIcon strokeWidth="1.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new app</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new app</DialogTitle>
                <DialogDescription>Add a new app to your workspace. Coming soon.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2 flex-1 h-full overflow-y-auto">
          {processes.size === 0 && (
            <p className="text-gray-500">
              No processes available. Create a process in processes file.
            </p>
          )}
          {Array.from(processes.values()).map((process, index) => (
            <ProcessTab
              key={process.name}
              index={index + 1}
              process={process}
              isSelected={process.name === activeProcess?.name}
              onSelect={onSelectProcess}
              onToggle={onToggleProcess}
              onCommand={onProcessCommand}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center justify-end border-t pt-2">
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <StreamOptionsMenu process={activeProcess} onClear={onClearProcess} />
        <Outlet />
      </div>
    </main>
  );
};
