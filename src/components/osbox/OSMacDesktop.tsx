import React, { useState, useEffect } from 'react';
import { HardDrive, Terminal, Cpu, LogOut } from 'lucide-react';
import { OSWindow } from './OSWindow';
import { FinderApp } from './apps/FinderApp';
import { TerminalApp } from './apps/TerminalApp';
import { MonitorApp } from './apps/MonitorApp';

export const OSMacDesktop: React.FC = () => {
  const [windows, setWindows] = useState({
    finder: { id: 'finder', title: 'Finder', isOpen: false, isMinimized: false, isMaximized: false, x: 80, y: 80, width: 450, height: 320, zIndex: 10 },
    terminal: { id: 'terminal', title: 'zsh Terminal', isOpen: false, isMinimized: false, isMaximized: false, x: 120, y: 120, width: 460, height: 320, zIndex: 11 },
    monitor: { id: 'monitor', title: 'Activity Monitor', isOpen: false, isMinimized: false, isMaximized: false, x: 160, y: 160, width: 360, height: 260, zIndex: 12 }
  });

  const [explorerPath, setExplorerPath] = useState<'root' | 'projects' | 'system'>('root');
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [maxZ, setMaxZ] = useState(15);
  const [dragWindowId, setDragWindowId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleShutdown = () => {
    navigateTo('/osbox');
  };

  const focusWindow = (id: keyof typeof windows) => {
    const nextZ = maxZ + 1;
    setMaxZ(nextZ);
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: nextZ }
    }));
  };

  const openWindow = (id: keyof typeof windows) => {
    focusWindow(id);
  };

  const toggleMaximize = (id: keyof typeof windows) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMaximized: !prev[id].isMaximized }
    }));
  };

  const toggleMinimize = (id: keyof typeof windows) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: !prev[id].isMinimized }
    }));
  };

  const closeWindow = (id: keyof typeof windows) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false }
    }));
  };

  // Window drag handlers
  const handleDragStart = (e: React.MouseEvent, id: keyof typeof windows) => {
    focusWindow(id);
    if (windows[id].isMaximized) return;

    setDragWindowId(id);
    setDragOffset({
      x: e.clientX - windows[id].x,
      y: e.clientY - windows[id].y
    });
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!dragWindowId) return;
    const id = dragWindowId as keyof typeof windows;
    setWindows(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        x: Math.max(0, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x)),
        y: Math.max(24, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
      }
    }));
  };

  const handleDragEnd = () => {
    setDragWindowId(null);
  };

  useEffect(() => {
    if (dragWindowId) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dragWindowId, dragOffset]);

  return (
    <div className="desktop-full-env macos-desktop-theme">
      {/* Top Menu Bar */}
      <div className="mac-top-bar font-sans">
        <div className="top-bar-left">
          <div className="mac-apple-logo" onClick={handleShutdown}>
            <svg viewBox="0 0 170 170" width="13" height="13" fill="#ffffff">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.36-6.13-3.64-2.88-7.61-7.7-11.9-14.48-8.24-13.04-14.07-27.81-17.48-44.33-3.41-16.51-3.43-30.82-.07-42.94 3.37-12.12 9.24-21.6 17.61-28.43 8.37-6.84 17.5-10.36 27.38-10.58 5.75 0 11.98 1.54 18.7 4.62 6.72 3.08 10.84 4.62 12.38 4.62 1.2 0 5.15-1.57 11.83-4.7 6.68-3.13 12.92-4.59 18.72-4.4 17.65.57 31.06 6.95 40.23 19.16-14.48 8.81-21.43 20.8-20.85 35.96.58 11.72 5.08 21.36 13.51 28.92 8.44 7.56 18.42 11.66 29.97 12.3-2.18 6.68-4.81 13.11-7.88 19.29zm-31.42-120.2c0 10.63-3.83 20.1-11.48 28.43-8.58 9.38-18.66 14.34-30.24 14.9-1.2-11.4 2.87-21.56 12.18-30.51 4.54-4.51 9.77-8.1 15.68-10.77 5.91-2.67 11.81-3.99 11.71-3.99.1.53.15 1.18.15 1.94z"/>
            </svg>
          </div>
          <span className="menu-bold">Finder</span>
          <span className="desktop-menu-item">File</span>
          <span className="desktop-menu-item">Edit</span>
          <span className="desktop-menu-item">View</span>
          <span className="desktop-menu-item">Go</span>
          <span className="desktop-menu-item">Window</span>
          <span className="desktop-menu-item">Help</span>
        </div>

        <div className="top-bar-right">
          <span className="desktop-menu-item">100% 🔋</span>
          <span className="desktop-menu-item">Wed 11:15 PM</span>
          <button onClick={handleShutdown} className="mac-shutdown-trigger font-sans" style={{ background: 'none', border: 'none', padding: 0 }}>
            <LogOut size={12} />
            <span>Shut Down</span>
          </button>
        </div>
      </div>

      {/* Desktop Workspace & Grid Icons */}
      <div className="desktop-icon-layout">
        <div onDoubleClick={() => openWindow('finder')} className="desktop-icon">
          <HardDrive size={34} style={{ color: '#00bcd4' }} />
          <span>Macintosh HD</span>
        </div>
        <div onDoubleClick={() => openWindow('terminal')} className="desktop-icon">
          <Terminal size={34} style={{ color: '#a855f7' }} />
          <span>zsh Terminal</span>
        </div>
        <div onDoubleClick={() => openWindow('monitor')} className="desktop-icon">
          <Cpu size={34} style={{ color: '#ff9500' }} />
          <span>Diagnostics</span>
        </div>
      </div>

      {/* RENDER ACTIVE WINDOWS */}
      {windows.finder.isOpen && (
        <OSWindow
          {...windows.finder}
          theme="macos"
          onClose={() => closeWindow('finder')}
          onMinimize={() => toggleMinimize('finder')}
          onMaximize={() => toggleMaximize('finder')}
          onFocus={() => focusWindow('finder')}
          onMouseDown={(e) => handleDragStart(e, 'finder')}
        >
          <FinderApp
            explorerPath={explorerPath}
            setExplorerPath={setExplorerPath}
            selectedFileContent={selectedFileContent}
            setSelectedFileContent={setSelectedFileContent}
          />
        </OSWindow>
      )}

      {windows.terminal.isOpen && (
        <OSWindow
          {...windows.terminal}
          theme="macos"
          onClose={() => closeWindow('terminal')}
          onMinimize={() => toggleMinimize('terminal')}
          onMaximize={() => toggleMaximize('terminal')}
          onFocus={() => focusWindow('terminal')}
          onMouseDown={(e) => handleDragStart(e, 'terminal')}
        >
          <TerminalApp osType="macos" />
        </OSWindow>
      )}

      {windows.monitor.isOpen && (
        <OSWindow
          {...windows.monitor}
          theme="macos"
          onClose={() => closeWindow('monitor')}
          onMinimize={() => toggleMinimize('monitor')}
          onMaximize={() => toggleMaximize('monitor')}
          onFocus={() => focusWindow('monitor')}
          onMouseDown={(e) => handleDragStart(e, 'monitor')}
        >
          <MonitorApp />
        </OSWindow>
      )}

      {/* Bottom macOS Dock Shelf */}
      <div className="mac-dock-shelf">
        <div className="mac-dock-container">
          <div onClick={() => openWindow('finder')} className="dock-icon" title="Finder">
            <HardDrive size={30} style={{ color: '#5ac8fa' }} />
            {windows.finder.isOpen && <div className="dock-active-dot" />}
          </div>
          <div onClick={() => openWindow('terminal')} className="dock-icon" title="Terminal">
            <Terminal size={30} style={{ color: '#fff' }} />
            {windows.terminal.isOpen && <div className="dock-active-dot" />}
          </div>
          <div onClick={() => openWindow('monitor')} className="dock-icon" title="Activity Monitor">
            <Cpu size={30} style={{ color: '#ff9500' }} />
            {windows.monitor.isOpen && <div className="dock-active-dot" />}
          </div>
          <div className="dock-divider" />
          <div onClick={handleShutdown} className="dock-icon" title="Shut Down">
            <LogOut size={30} style={{ color: '#ff3b30' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default OSMacDesktop;
