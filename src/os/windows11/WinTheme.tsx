import React, { useState, useEffect } from 'react';
import { windowActions, windowStore } from '../../core/store/windowStore';
import { useStore } from '../../core/store/index';
import { OSIcon } from '../../components/osbox/OSIcon';

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
                <OSIcon app="files" os="windows" size={24} />
                <span>File Explorer</span>
              </div>
              <div onClick={() => handleStartAppClick('terminal', 'Command Prompt')} className="start-app">
                <OSIcon app="terminal" os="windows" size={24} />
                <span>CMD Terminal</span>
              </div>
              <div onClick={() => handleStartAppClick('vscode', 'VS Code')} className="start-app">
                <OSIcon app="vscode" os="windows" size={24} />
                <span>VS Code</span>
              </div>
              <div onClick={() => handleStartAppClick('settings', 'Settings')} className="start-app">
                <OSIcon app="settings" os="windows" size={24} />
                <span>Settings</span>
              </div>
            </div>
          </div>

          <div className="start-footer">
            <div className="user-profile">
              <div className="user-avatar">A</div>
              <span>Administrator</span>
            </div>
            <button onClick={onShutdown} className="start-shutdown font-sans" style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <OSIcon app="shutdown" os="windows" size={14} />
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
            <OSIcon app="files" os="windows" size={18} />
            {isWindowOpen('files') && <div className="win-running-bar" />}
          </button>
          
          <button onClick={() => windowActions.openWindow('terminal', 'Command Prompt', 'terminal')} className="taskbar-btn" title="Command Prompt">
            <OSIcon app="terminal" os="windows" size={18} />
            {isWindowOpen('terminal') && <div className="win-running-bar" />}
          </button>
          
          <button onClick={() => windowActions.openWindow('vscode', 'VS Code', 'vscode')} className="taskbar-btn" title="VS Code">
            <OSIcon app="vscode" os="windows" size={18} />
            {isWindowOpen('vscode') && <div className="win-running-bar" />}
          </button>

          <button onClick={() => windowActions.openWindow('settings', 'Settings', 'settings')} className="taskbar-btn" title="Settings">
            <OSIcon app="settings" os="windows" size={18} />
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
