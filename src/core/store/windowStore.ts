import { createStore } from './index';

export interface WindowInstance {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  focused: boolean;
  app: 'terminal' | 'browser' | 'files' | 'settings' | 'vscode' | 'calculator' | 'notes';
}

interface WindowState {
  windows: WindowInstance[];
  maxZIndex: number;
}

const initialWindowState: WindowState = {
  windows: [],
  maxZIndex: 10
};

export const windowStore = createStore<WindowState>(initialWindowState);

export const windowActions = {
  openWindow: (app: WindowInstance['app'], title: string, icon: string) => {
    const state = windowStore.getState();
    const existing = state.windows.find((w) => w.app === app);
    
    // If it's already open, just focus and unminimize it
    if (existing) {
      windowActions.focusWindow(existing.id);
      if (existing.minimized) {
        windowActions.minimizeWindow(existing.id);
      }
      return;
    }

    const nextZ = state.maxZIndex + 1;
    const newWindow: WindowInstance = {
      id: `${app}-${Date.now()}`,
      title,
      icon,
      x: 100 + (state.windows.length * 25) % 150,
      y: 80 + (state.windows.length * 25) % 150,
      width: app === 'settings' || app === 'calculator' ? 350 : 550,
      height: app === 'settings' || app === 'calculator' ? 300 : 380,
      zIndex: nextZ,
      minimized: false,
      maximized: false,
      focused: true,
      app
    };

    // Unfocus all other windows
    const updatedWindows = state.windows.map((w) => ({ ...w, focused: false }));

    windowStore.setState({
      windows: [...updatedWindows, newWindow],
      maxZIndex: nextZ
    });
  },

  closeWindow: (id: string) => {
    const state = windowStore.getState();
    windowStore.setState({
      windows: state.windows.filter((w) => w.id !== id)
    });
  },

  minimizeWindow: (id: string) => {
    const state = windowStore.getState();
    windowStore.setState({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, minimized: !w.minimized, focused: w.minimized } : w
      )
    });
  },

  maximizeWindow: (id: string) => {
    const state = windowStore.getState();
    windowStore.setState({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, maximized: !w.maximized } : w
      )
    });
  },

  focusWindow: (id: string) => {
    const state = windowStore.getState();
    const nextZ = state.maxZIndex + 1;
    windowStore.setState({
      maxZIndex: nextZ,
      windows: state.windows.map((w) =>
        w.id === id
          ? { ...w, focused: true, zIndex: nextZ, minimized: false }
          : { ...w, focused: false }
      )
    });
  },

  updateWindowPosition: (id: string, x: number, y: number) => {
    const state = windowStore.getState();
    windowStore.setState({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w))
    });
  },

  updateWindowSize: (id: string, width: number, height: number) => {
    const state = windowStore.getState();
    windowStore.setState({
      windows: state.windows.map((w) => (w.id === id ? { ...w, width, height } : w))
    });
  }
};
