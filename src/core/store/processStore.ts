import { createStore } from './index';

export interface ProcessInstance {
  pid: number;
  app: string;
  title: string;
  running: boolean;
  cpuUsage: number;
  memUsage: number;
}

interface ProcessState {
  processes: ProcessInstance[];
  overallCpu: number;
  overallMem: number;
}

const initialProcessState: ProcessState = {
  processes: [
    { pid: 101, app: 'kernel', title: 'System Kernel', running: true, cpuUsage: 1.2, memUsage: 128 },
    { pid: 102, app: 'windowserver', title: 'Window Server', running: true, cpuUsage: 2.5, memUsage: 256 },
    { pid: 103, app: 'syslogd', title: 'Logger Daemon', running: true, cpuUsage: 0.4, memUsage: 32 }
  ],
  overallCpu: 4.1,
  overallMem: 416
};

export const processStore = createStore<ProcessState>(initialProcessState);

export const processActions = {
  launchProcess: (app: string, title: string) => {
    const state = processStore.getState();
    const existing = state.processes.find((p) => p.app === app);
    if (existing) return;

    const nextPid = Math.max(...state.processes.map((p) => p.pid), 200) + 1;
    const newProc: ProcessInstance = {
      pid: nextPid,
      app,
      title,
      running: true,
      cpuUsage: Math.random() * 5 + 1,
      memUsage: Math.round(50 + Math.random() * 80)
    };

    processStore.setState({
      processes: [...state.processes, newProc]
    });
    processActions.updateTotals();
  },

  killProcess: (app: string) => {
    const state = processStore.getState();
    processStore.setState({
      processes: state.processes.filter((p) => p.app !== app)
    });
    processActions.updateTotals();
  },

  tickResources: () => {
    const state = processStore.getState();
    const updated = state.processes.map((p) => {
      if (p.app === 'kernel') {
        return { ...p, cpuUsage: Math.max(0.5, Math.min(5, p.cpuUsage + (Math.random() - 0.5) * 0.5)) };
      }
      // Running app fluctuations
      return {
        ...p,
        cpuUsage: Math.max(0.1, Math.min(25, p.cpuUsage + (Math.random() - 0.5) * 3)),
        memUsage: Math.max(15, Math.min(512, p.memUsage + Math.round((Math.random() - 0.5) * 8)))
      };
    });

    processStore.setState({ processes: updated });
    processActions.updateTotals();
  },

  updateTotals: () => {
    const state = processStore.getState();
    const overallCpu = parseFloat(state.processes.reduce((acc, p) => acc + p.cpuUsage, 0).toFixed(1));
    const overallMem = state.processes.reduce((acc, p) => acc + p.memUsage, 0);
    processStore.setState({ overallCpu, overallMem });
  }
};

// Start resources polling simulation
setInterval(() => {
  processActions.tickResources();
}, 2000);
