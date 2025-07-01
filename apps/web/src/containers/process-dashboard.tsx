import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { useRouter } from "@tanstack/react-router";
import { ProcessTab } from "@web/components/process-tab";
import { StreamDisplay } from "@web/components/stream-display";
import { StreamOptionsMenu } from "@web/components/stream-options-menu";
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
import { apiClient } from "@web/lib/rpc-client";
import { useActiveProcess, useProcesses } from "@web/store";
import { PlusIcon, SlidersHorizontalIcon } from "lucide-react";

export type ProcessDashboardProps = {
  processes: ProcessSchema[];
  activeProcess: ProcessSchema | undefined;
};

export const ProcessDashboard = () => {
  const router = useRouter();

  const processes = useProcesses();
  const activeProcess = useActiveProcess();

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
      apiClient.processes[":name"].start.$post({
        param: {
          name: process.name,
        },
      });
    } else {
      apiClient.processes[":name"].stop.$post({
        param: {
          name: process.name,
        },
      });
    }
  };

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
        <div className="flex flex-col gap-2 h-full">
          <div className="flex flex-col gap-2 flex-1 h-full overflow-y-auto">
            {!processes.length && (
              <p className="text-gray-500">
                No processes available. Create a process in processes file.
              </p>
            )}
            {processes.map((process) => (
              <ProcessTab
                key={process.name}
                process={process}
                isSelected={process.name === activeProcess?.name}
                onSelect={onSelectProcess}
                onToggle={onToggleProcess}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <StreamOptionsMenu
          process={activeProcess}
          onClear={() => {
            if (!activeProcess) return;
            apiClient.processes[":name"].clear.$post({
              param: {
                name: activeProcess.name,
              },
            });
          }}
        />
        <StreamDisplay output={activeProcess?.spawn.output ?? []} />
      </div>
    </main>
  );
};
