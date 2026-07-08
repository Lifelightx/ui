import React, { useState, useEffect } from 'react';
import { HardDrive, Terminal, Cpu, LogOut } from 'lucide-react';
import { OSWindow } from './OSWindow';
import { FinderApp } from './apps/FinderApp';
import { TerminalApp } from './apps/TerminalApp';
import { MonitorApp } from './apps/MonitorApp';

export const OSLinuxDesktop: React.FC = () => {
  const [windows, setWindows] = useState({
    finder: { id: 'finder', title: 'Files', isOpen: false, isMinimized: false, isMaximized: false, x: 120, y: 80, width: 450, height: 320, zIndex: 10 },
    terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, isMaximized: false, x: 160, y: 120, width: 460, height: 320, zIndex: 11 },
    monitor: { id: 'monitor', title: 'System Monitor', isOpen: false, isMinimized: false, isMaximized: false, x: 200, y: 160, width: 360, height: 260, zIndex: 12 }
  });

  const [explorerPath, setExplorerPath] = useState<'root' | 'projects' | 'system'>('root');
  const [selectedFileContent, setSelectedFileContent] = useState<string | null>(null);
  const [maxZ, setMaxZ] = useState(15);
  const [dragWindowId, setDragWindowId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [gnomeMenuOpen, setGnomeMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleDateString([], { month: 'short', day: '2-digit' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
    setGnomeMenuOpen(false);
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
        x: Math.max(64, Math.min(window.innerWidth - 200, e.clientX - dragOffset.x)),
        y: Math.max(28, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
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
    <div className="desktop-full-env linux-desktop-theme" onClick={() => setGnomeMenuOpen(false)}>
      {/* Top GNOME Panel */}
      <div className="linux-topbar font-sans" onClick={(e) => e.stopPropagation()}>
        <span onClick={() => setGnomeMenuOpen(!gnomeMenuOpen)} className="activities-menu">Activities</span>
        <span>{currentTime}</span>
        <div className="linux-top-right">
          <span>📶 🔊 🔋</span>
          <button onClick={handleShutdown} className="linux-shutdown-trigger font-sans" style={{ background: 'none', border: 'none', padding: 0, color: '#df4a16', cursor: 'pointer' }}>
            <span>Power Off</span>
          </button>
        </div>
      </div> 

      {/* Left Dock Sidebar */}
      <div className="linux-left-dock" onClick={(e) => e.stopPropagation()}>
        <div className="dock-icons-list">
          {/* Ubuntu Orange Logo Button */}
          <button onClick={() => setGnomeMenuOpen(!gnomeMenuOpen)} className="linux-dock-icon" title="Applications">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#df4a16">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.2c5.412 0 9.8 4.388 9.8 9.8s-4.388 9.8-9.8 9.8-9.8-4.388-9.8-9.8 4.388-9.8 9.8-9.8zm0 3c-1.38 0-2.5 1.12-2.5 2.5 0 .973.56 1.812 1.375 2.222A4.279 4.279 0 0 0 9.5 12c0 .878.27 1.69.728 2.378-.815.41-1.375 1.25-1.375 2.222 0 1.38 1.12 2.5 2.5 2.5.973 0 1.812-.56 2.222-1.375.688.458 1.5.728 2.378.728.878 0 1.69-.27 2.378-.728.41.815 1.25 1.375 2.222 1.375 1.38 0 2.5-1.12 2.5-2.5 0-.973-.56-1.812-1.375-2.222.458-.688.728-1.5.728-2.378 0-.878-.27-1.69-.728-2.378.815-.41 1.375-1.25 1.375-2.222 0-1.38-1.12-2.5-2.5-2.5-.973 0-1.812.56-2.222 1.375A4.279 4.279 0 0 0 14.5 9.5c0-.878-.27-1.69-.728-2.378-.41-.815-1.25-1.375-2.222-1.375z"/>
            </svg>
          </button>

          <button onClick={() => openWindow('finder')} className="linux-dock-icon" title="Files">
            <HardDrive size={22} style={{ color: '#e95420' }} />
            {windows.finder.isOpen && <div className="linux-active-dot" />}
          </button>

          <button onClick={() => openWindow('terminal')} className="linux-dock-icon" title="Terminal">
            <Terminal size={22} style={{ color: '#fff' }} />
            {windows.terminal.isOpen && <div className="linux-active-dot" />}
          </button>

          <button onClick={() => openWindow('monitor')} className="linux-dock-icon" title="System Monitor">
            <Cpu size={22} style={{ color: '#34c759' }} />
            {windows.monitor.isOpen && <div className="linux-active-dot" />}
          </button>

          <div className="dock-spacer" />
          <button onClick={handleShutdown} className="linux-dock-icon" title="Power Off">
            <LogOut size={22} style={{ color: '#ef4444' }} />
          </button>
        </div>
      </div>

      {/* Desktop Workspace & Grid Icons */}
      <div className="linux-desktop-container">
        <div className="desktop-icon-layout">
          <div onDoubleClick={() => openWindow('finder')} className="desktop-icon">
            <HardDrive size={34} style={{ color: '#e95420' }} />
            <span>Home Folder</span>
          </div>
          <div onDoubleClick={() => openWindow('terminal')} className="desktop-icon">
            <Terminal size={34} style={{ color: '#fff' }} />
            <span>Bash Terminal</span>
          </div>
          <div onDoubleClick={() => openWindow('monitor')} className="desktop-icon">
            <Cpu size={34} style={{ color: '#34c759' }} />
            <span>System Telemetry</span>
          </div>
        </div>
      </div>

      {/* RENDER WINDOWS */}
      {windows.finder.isOpen && (
        <OSWindow
          {...windows.finder}
          theme="linux"
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
          theme="linux"
          onClose={() => closeWindow('terminal')}
          onMinimize={() => toggleMinimize('terminal')}
          onMaximize={() => toggleMaximize('terminal')}
          onFocus={() => focusWindow('terminal')}
          onMouseDown={(e) => handleDragStart(e, 'terminal')}
        >
          <TerminalApp osType="linux" />
        </OSWindow>
      )}

      {windows.monitor.isOpen && (
        <OSWindow
          {...windows.monitor}
          theme="linux"
          onClose={() => closeWindow('monitor')}
          onMinimize={() => toggleMinimize('monitor')}
          onMaximize={() => toggleMaximize('monitor')}
          onFocus={() => focusWindow('monitor')}
          onMouseDown={(e) => handleDragStart(e, 'monitor')}
        >
          <MonitorApp />
        </OSWindow>
      )}

      {/* GNOME APPLICATIONS MENU */}
      {gnomeMenuOpen && (
        <div className="linux-gnome-menu font-sans" onClick={(e) => e.stopPropagation()}>
          <div className="menu-search-box">
            <input type="text" className="menu-search-input" placeholder="Type to search..." autoFocus />
          </div>
          <div className="menu-apps-grid">
            <div onClick={() => openWindow('finder')} className="menu-app-item">
              <HardDrive size={32} style={{ color: '#e95420' }} />
              <span>Files</span>
            </div>
            <div onClick={() => openWindow('terminal')} className="menu-app-item">
              <Terminal size={32} style={{ color: '#fff' }} />
              <span>Terminal</span>
            </div>
            <div onClick={() => openWindow('monitor')} className="menu-app-item">
              <Cpu size={32} style={{ color: '#34c759' }} />
              <span>System Monitor</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default OSLinuxDesktop;
