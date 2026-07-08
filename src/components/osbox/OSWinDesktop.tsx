import React, { useState, useEffect } from 'react';
import { HardDrive, Terminal, Cpu, LogOut } from 'lucide-react';
import { OSWindow } from './OSWindow';
import { FinderApp } from './apps/FinderApp';
import { TerminalApp } from './apps/TerminalApp';
import { MonitorApp } from './apps/MonitorApp';

export const OSWinDesktop: React.FC = () => {
  const [windows, setWindows] = useState({
    finder: { id: 'finder', title: 'File Explorer', isOpen: false, isMinimized: false, isMaximized: false, x: 100, y: 80, width: 460, height: 320, zIndex: 10 },
    terminal: { id: 'terminal', title: 'Command Prompt', isOpen: false, isMinimized: false, isMaximized: false, x: 140, y: 120, width: 470, height: 330, zIndex: 11 },
    monitor: { id: 'monitor', title: 'Task Manager', isOpen: false, isMinimized: false, isMaximized: false, x: 180, y: 160, width: 360, height: 260, zIndex: 12 }
  });

  const [explorerPath, setExplorerPath] = useState<'root' | 'projects' | 'system'>('root');
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [maxZ, setMaxZ] = useState(15);
  const [dragWindowId, setDragWindowId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startOpen, setStartOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

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
    setStartOpen(false);
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
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
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
    <div className="desktop-full-env windows-desktop-theme" onClick={() => setStartOpen(false)}>
      {/* Grid Icons */}
      <div className="desktop-icon-layout">
        <div onDoubleClick={() => openWindow('finder')} className="desktop-icon">
          <HardDrive size={34} style={{ color: '#0078d7' }} />
          <span>This PC</span>
        </div>
        <div onDoubleClick={() => openWindow('terminal')} className="desktop-icon">
          <Terminal size={34} style={{ color: '#66bb6a' }} />
          <span>CMD Console</span>
        </div>
        <div onDoubleClick={() => openWindow('monitor')} className="desktop-icon">
          <Cpu size={34} style={{ color: '#4fc3f7' }} />
          <span>Task Manager</span>
        </div>
      </div>

      {/* RENDER WINDOWS */}
      {windows.finder.isOpen && (
        <OSWindow
          {...windows.finder}
          theme="windows"
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
          theme="windows"
          onClose={() => closeWindow('terminal')}
          onMinimize={() => toggleMinimize('terminal')}
          onMaximize={() => toggleMaximize('terminal')}
          onFocus={() => focusWindow('terminal')}
          onMouseDown={(e) => handleDragStart(e, 'terminal')}
        >
          <TerminalApp osType="windows" />
        </OSWindow>
      )}

      {windows.monitor.isOpen && (
        <OSWindow
          {...windows.monitor}
          theme="windows"
          onClose={() => closeWindow('monitor')}
          onMinimize={() => toggleMinimize('monitor')}
          onMaximize={() => toggleMaximize('monitor')}
          onFocus={() => focusWindow('monitor')}
          onMouseDown={(e) => handleDragStart(e, 'monitor')}
        >
          <MonitorApp />
        </OSWindow>
      )}

      {/* START MENU DIALOG */}
      {startOpen && (
        <div className="win-start-menu font-sans" onClick={(e) => e.stopPropagation()}>
          <div className="start-pinned-section">
            <span className="start-label">Pinned Apps</span>
            <div className="start-grid">
              <div onClick={() => openWindow('finder')} className="start-app">
                <HardDrive size={24} style={{ color: '#0078d7' }} />
                <span>File Explorer</span>
              </div>
              <div onClick={() => openWindow('terminal')} className="start-app">
                <Terminal size={24} style={{ color: '#66bb6a' }} />
                <span>Terminal CMD</span>
              </div>
              <div onClick={() => openWindow('monitor')} className="start-app">
                <Cpu size={24} style={{ color: '#4fc3f7' }} />
                <span>Task Manager</span>
              </div>
            </div>
          </div>

          <div className="start-footer">
            <div className="user-profile">
              <div className="user-avatar">A</div>
              <span>Administrator</span>
            </div>
            <button onClick={handleShutdown} className="start-shutdown font-sans">
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Taskbar Bottom */}
      <div className="win-taskbar font-sans" onClick={(e) => e.stopPropagation()}>
        <div className="taskbar-left">
          <span>Widgets</span>
        </div>

        <div className="taskbar-center">
          {/* Windows 11 Center Start Logo */}
          <button 
            onClick={() => setStartOpen(!startOpen)} 
            className="taskbar-btn" 
            title="Start"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ filter: 'drop-shadow(0 0 3px rgba(0,120,215,0.4))' }}>
              <path fill="#0078d4" d="M0 0h11.3v11.3H0zM12.7 0H24v11.3H12.7zM0 12.7h11.3V24H0zM12.7 12.7H24V24H12.7z"/>
            </svg>
          </button>
          
          <button onClick={() => openWindow('finder')} className="taskbar-btn" title="File Explorer">
            <HardDrive size={18} style={{ color: '#ffb300' }} />
            {windows.finder.isOpen && <div className="win-running-bar" />}
          </button>
          
          <button onClick={() => openWindow('terminal')} className="taskbar-btn" title="Command Prompt">
            <Terminal size={18} style={{ color: '#66bb6a' }} />
            {windows.terminal.isOpen && <div className="win-running-bar" />}
          </button>
          
          <button onClick={() => openWindow('monitor')} className="taskbar-btn" title="Task Manager">
            <Cpu size={18} style={{ color: '#4fc3f7' }} />
            {windows.monitor.isOpen && <div className="win-running-bar" />}
          </button>
        </div>

        <div className="taskbar-right">
          <div className="tray-icons">
            <span>📶</span>
            <span>🔊</span>
          </div>
          <div className="taskbar-clock">
            <span>{currentTime}</span>
            <span>{new Date().toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OSWinDesktop;
