import React, { useState, useEffect } from 'react';
import { LogOut, HardDrive, Terminal, Cpu, Settings } from 'lucide-react';
import { windowActions, windowStore } from '../../core/store/windowStore';
import { useStore } from '../../core/store/index';

interface WinThemeProps {
  onShutdown: () => void;
}

export const WinTheme: React.FC<WinThemeProps> = ({ onShutdown }) => {
  const [startOpen, setStartOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const windows = useStore(windowStore, (s) => s.windows);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isWindowOpen = (app: string) => {
    return windows.some((w) => w.app === app && !w.minimized);
  };

  const handleStartAppClick = (app: any, title: string) => {
    windowActions.openWindow(app, title, app);
    setStartOpen(false);
  };

  return (
    <div className="win-shell-container" onClick={() => setStartOpen(false)}>
      {/* START MENU DIALOG */}
      {startOpen && (
        <div className="win-start-menu font-sans" onClick={(e) => e.stopPropagation()}>
          <div className="start-pinned-section">
            <span className="start-label">Pinned Apps</span>
            <div className="start-grid">
              <div onClick={() => handleStartAppClick('files', 'File Explorer')} className="start-app">
                <HardDrive size={24} style={{ color: '#0078d7' }} />
                <span>File Explorer</span>
              </div>
              <div onClick={() => handleStartAppClick('terminal', 'Command Prompt')} className="start-app">
                <Terminal size={24} style={{ color: '#66bb6a' }} />
                <span>CMD Terminal</span>
              </div>
              <div onClick={() => handleStartAppClick('vscode', 'VS Code')} className="start-app">
                <Settings size={24} style={{ color: '#007acc' }} />
                <span>VS Code</span>
              </div>
              <div onClick={() => handleStartAppClick('settings', 'Settings')} className="start-app">
                <Cpu size={24} style={{ color: '#8e8e93' }} />
                <span>Settings</span>
              </div>
            </div>
          </div>

          <div className="start-footer">
            <div className="user-profile">
              <div className="user-avatar">A</div>
              <span>Administrator</span>
            </div>
            <button onClick={onShutdown} className="start-shutdown font-sans">
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
          
          <button onClick={() => windowActions.openWindow('files', 'File Explorer', 'folder')} className="taskbar-btn" title="File Explorer">
            <HardDrive size={18} style={{ color: '#ffb300' }} />
            {isWindowOpen('files') && <div className="win-running-bar" />}
          </button>
          
          <button onClick={() => windowActions.openWindow('terminal', 'Command Prompt', 'terminal')} className="taskbar-btn" title="Command Prompt">
            <Terminal size={18} style={{ color: '#66bb6a' }} />
            {isWindowOpen('terminal') && <div className="win-running-bar" />}
          </button>
          
          <button onClick={() => windowActions.openWindow('vscode', 'VS Code', 'vscode')} className="taskbar-btn" title="VS Code">
            <Settings size={18} style={{ color: '#007acc' }} />
            {isWindowOpen('vscode') && <div className="win-running-bar" />}
          </button>

          <button onClick={() => windowActions.openWindow('settings', 'Settings', 'settings')} className="taskbar-btn" title="Settings">
            <Cpu size={18} style={{ color: '#8e8e93' }} />
            {isWindowOpen('settings') && <div className="win-running-bar" />}
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
export default WinTheme;
