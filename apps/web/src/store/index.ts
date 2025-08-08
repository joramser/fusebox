import type { LineCreatedEvent, ProcessUpdatedEvent } from "@fusebox/api/events";
import type { ProcessOutputSchema, ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { enableMapSet } from "immer";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

enableMapSet();

export interface StoreState {
  processes: Map<string, ProcessSchema>;
  outputs: Map<string, ProcessOutputSchema[]>;
  activeProcessKey: string | undefined;
  actions: {
    setProcesses: (processes: ProcessSchema[]) => void;
    setActiveProcess: (name: string) => void;
    updateProcessStatus: (args: ProcessUpdatedEvent["params"]) => void;
    createLine: (args: LineCreatedEvent["params"]) => void;
  };
}

export const useStore = create<StoreState>()(
  immer(
    subscribeWithSelector((set) => ({
      processes: new Map(),
      outputs: new Map(),
      activeProcessKey: undefined,
      actions: {
        setProcesses: (processes) =>
          set((state) => {
            state.processes = new Map(processes.map((p) => [p.name, { ...p, output: [] }]));
            state.outputs = new Map(processes.map((p) => [p.name, p.spawn.output]));
            state.activeProcessKey = processes[0]?.name;
          }),
        setActiveProcess: (name: string) =>
          set((state) => {
            state.activeProcessKey = name;
          }),
        updateProcessStatus: (args) =>
          set((state) => {
            const process = state.processes.get(args.processName);
            const output = state.outputs.get(args.processName);

            if (!process) return;

            process.spawn.status = args.status ?? process.spawn.status;
            process.spawn.pid = args.pid ?? process.spawn.pid;

            if (!output) return;

            if (args.output?.length === 0) {
              output.length = 0;
            }
          }),
        createLine: (args) =>
          set((state) => {
            const output = state.outputs.get(args.processName);

            if (!output) return;

            output.push({
              number: args.number,
              line: args.line,
            });
          }),
      },
    })),
  ),
);

export const useProcesses = () => useStore((state) => state.processes);

export const useActiveProcess = () =>
  useStore((state) => state.processes.get(state.activeProcessKey ?? ""));

export const useNextProcess = () =>
  useStore((state) => {
    const processes = Array.from(state.processes.values());
    const activeIndex = processes.findIndex((p) => p.name === state.activeProcessKey);
    return processes[(activeIndex + 1) % processes.length];
  });

export const usePreviousProcess = () =>
  useStore((state) => {
    const processes = Array.from(state.processes.values());
    const activeIndex = processes.findIndex((p) => p.name === state.activeProcessKey);
    return processes[(activeIndex - 1 + processes.length) % processes.length];
  });

export const useActiveProcessOutput = () =>
  useStore((state) => state.outputs.get(state.activeProcessKey ?? "") ?? []);

export const useStoreActions = () => useStore((state) => state.actions);
