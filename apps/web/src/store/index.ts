import type { LineCreatedEvent, ProcessUpdatedEvent } from "@fusebox/api/events";
import type { ProcessSchema } from "@fusebox/api/schemas/process.schema";
import { create } from "zustand";

// TODO: Consider using immer middleware

export interface StoreState {
  processes: ProcessSchema[];
  activeProcessKey: string | undefined;
  actions: {
    setProcesses: (processes: ProcessSchema[]) => void;
    setActiveProcess: (name: string) => void;
    updateProcessStatus: (args: ProcessUpdatedEvent["params"]) => void;
    createLine: (args: LineCreatedEvent["params"]) => void;
  };
}

export const useStore = create<StoreState>((set) => ({
  processes: [],
  activeProcessKey: undefined,
  actions: {
    setProcesses: (processes) => set(() => ({ processes })),
    setActiveProcess: (name: string) =>
      set(() => {
        return { activeProcessKey: name };
      }),
    updateProcessStatus: (args) =>
      set((state) => {
        const idx = state.processes.findIndex((p) => p.name === args.processName);
        if (idx === -1 || !state.processes[idx]) {
          return state;
        }

        const process = state.processes[idx];

        const updatedProcess = {
          ...state.processes[idx],
          spawn: {
            ...process.spawn,
            status: args.status ?? process.spawn.status,
            output: args.output ?? process.spawn.output,
            pid: args.pid ?? process.spawn.pid,
          },
        };
        const newProcesses = [...state.processes];
        newProcesses[idx] = updatedProcess;
        return { processes: newProcesses };
      }),
    createLine: (args) =>
      set((state) => {
        const idx = state.processes.findIndex((p) => p.name === args.processName);
        if (idx === -1 || !state.processes[idx]) {
          return state;
        }

        const process = state.processes[idx];
        const updatedProcess = {
          ...process,
          spawn: {
            ...process.spawn,
            output: [...process.spawn.output, { number: args.number, line: args.line }],
          },
        };
        const newProcesses = [...state.processes];
        newProcesses[idx] = updatedProcess;
        return { processes: newProcesses };
      }),
  },
}));

export const useProcesses = () => useStore((state) => state.processes);
export const useActiveProcess = () =>
  useStore((state) => state.processes.find((p) => p.name === state.activeProcessKey));

export const useStoreActions = () => useStore((state) => state.actions);
