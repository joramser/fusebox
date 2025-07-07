import type { LineCreatedEvent, ProcessUpdatedEvent } from "@fusebox/api/events";
import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

enableMapSet();

export interface StoreState {
  processes: Map<string, ProcessSchema>;
  activeProcessKey: string | undefined;
  actions: {
    setProcesses: (processes: ProcessSchema[]) => void;
    setActiveProcess: (name: string) => void;
    updateProcessStatus: (args: ProcessUpdatedEvent["params"]) => void;
    createLine: (args: LineCreatedEvent["params"]) => void;
  };
}

export const useStore = create<StoreState>()(
  immer((set) => ({
    processes: new Map(),
    outputs: new Map(),
    activeProcessKey: undefined,
    actions: {
      setProcesses: (processes) =>
        set((state) => {
          state.processes = new Map(processes.map((p) => [p.name, p]));
          state.activeProcessKey = processes[0]?.name;
        }),
      setActiveProcess: (name: string) =>
        set((state) => {
          state.activeProcessKey = name;
        }),
      updateProcessStatus: (args) =>
        set((state) => {
          const process = state.processes.get(args.processName);

          if (!process) return;

          process.spawn.status = args.status ?? process.spawn.status;
          process.spawn.pid = args.pid ?? process.spawn.pid;
          process.spawn.output = args.output ?? process.spawn.output;
        }),
      createLine: (args) =>
        set((state) => {
          const process = state.processes.get(args.processName);

          if (!process) return;

          process.spawn.output.push({
            number: args.number,
            line: args.line,
          });
        }),
    },
  })),
);

export const useProcesses = () => useStore((state) => state.processes);

export const useActiveProcess = () =>
  useStore((state) => state.processes.get(state.activeProcessKey ?? ""));

export const useStoreActions = () => useStore((state) => state.actions);
