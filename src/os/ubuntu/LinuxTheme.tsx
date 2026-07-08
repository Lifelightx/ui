import React, { useState, useEffect } from 'react';
import { windowActions, windowStore } from '../../core/store/windowStore';
import { useStore } from '../../core/store/index';
import { OSIcon } from '../../components/osbox/OSIcon';

interface LinuxThemeProps {
  onShutdown: () => void;
}

export const LinuxTheme: React.FC<LinuxThemeProps> = ({ onShutdown }) => {
  const [gnomeMenuOpen, setGnomeMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const windows = useStore(windowStore, (s) => s.windows);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleDateString([], { month: 'short', day: '2-digit' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const isWindowOpen = (app: string) => {
    return windows.some((w) => w.app === app && !w.minimized);
  };

  const handleAppLaunch = (app: any, title: string) => {
    windowActions.openWindow(app, title, app);
    setGnomeMenuOpen(false);
  };

  return (
    <div className="linux-shell-container" onClick={() => setGnomeMenuOpen(false)}>
      {/* Top GNOME Status Panel */}
      <div className="linux-topbar font-sans" onClick={(e) => e.stopPropagation()}>
        <span onClick={() => setGnomeMenuOpen(!gnomeMenuOpen)} className="activities-menu">Activities</span>
        <span>{currentTime}</span>
        <div className="linux-top-right">
          <span>📶 🔊 🔋</span>
          <button onClick={onShutdown} className="linux-shutdown-trigger font-sans" style={{ background: 'none', border: 'none', padding: 0, color: '#df4a16', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <OSIcon app="shutdown" os="ubuntu" size={12} />
            <span>Power Off</span>
          </button>
        </div>
      </div>

      {/* Left App Dock Sidebar */}
      <div className="linux-left-dock" onClick={(e) => e.stopPropagation()}>
        <div className="dock-icons-list">
          {/* Ubuntu Orange Logo Button */}
          <button onClick={() => setGnomeMenuOpen(!gnomeMenuOpen)} className="linux-dock-icon" title="Applications">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="#df4a16">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.2c5.412 0 9.8 4.388 9.8 9.8s-4.388 9.8-9.8 9.8-9.8-4.388-9.8-9.8 4.388-9.8 9.8-9.8zm0 3c-1.38 0-2.5 1.12-2.5 2.5 0 .973.56 1.812 1.375 2.222A4.279 4.279 0 0 0 9.5 12c0 .878.27 1.69.728 2.378-.815.41-1.375 1.25-1.375 2.222 0 1.38 1.12 2.5 2.5 2.5.973 0 1.812-.56 2.222-1.375.688.458 1.5.728 2.378.728.878 0 1.69-.27 2.378-.728.41.815 1.25 1.375 2.222 1.375 1.38 0 2.5-1.12 2.5-2.5 0-.973-.56-1.812-1.375-2.222.458-.688.728-1.5.728-2.378 0-.878-.27-1.69-.728-2.378.815-.41 1.375-1.25 1.375-2.222 0-1.38-1.12-2.5-2.5-2.5-.973 0-1.812.56-2.222 1.375A4.279 4.279 0 0 0 14.5 9.5c0-.878-.27-1.69-.728-2.378-.41-.815-1.25-1.375-2.222-1.375z"/>
            </svg>
          </button>

          <button onClick={() => windowActions.openWindow('files', 'Files', 'folder')} className="linux-dock-icon" title="Files">
            <OSIcon app="files" os="ubuntu" size={22} />
            {isWindowOpen('files') && <div className="linux-active-dot" />}
          </button>

          <button onClick={() => windowActions.openWindow('terminal', 'Terminal', 'terminal')} className="linux-dock-icon" title="Terminal">
            <OSIcon app="terminal" os="ubuntu" size={22} />
            {isWindowOpen('terminal') && <div className="linux-active-dot" />}
          </button>

          <button onClick={() => windowActions.openWindow('vscode', 'VS Code', 'vscode')} className="linux-dock-icon" title="VS Code">
            <OSIcon app="vscode" os="ubuntu" size={22} />
            {isWindowOpen('vscode') && <div className="linux-active-dot" />}
          </button>

          <button onClick={() => windowActions.openWindow('settings', 'Settings', 'settings')} className="linux-dock-icon" title="Settings">
            <OSIcon app="settings" os="ubuntu" size={22} />
            {isWindowOpen('settings') && <div className="linux-active-dot" />}
          </button>

          <div className="dock-spacer" />
          <button onClick={onShutdown} className="linux-dock-icon" title="Power Off">
            <OSIcon app="shutdown" os="ubuntu" size={22} />
          </button>
        </div>
      </div>

      {/* GNOME APPLICATIONS MENU OVERLAY */}
      {gnomeMenuOpen && (
        <div className="linux-gnome-menu font-sans" onClick={(e) => e.stopPropagation()}>
          <div className="menu-search-box">
            <input type="text" className="menu-search-input" placeholder="Type to search..." autoFocus />
          </div>
          <div className="menu-apps-grid">
            <div onClick={() => handleAppLaunch('files', 'Files')} className="menu-app-item">
              <OSIcon app="files" os="ubuntu" size={32} />
              <span>Files</span>
            </div>
            <div onClick={() => handleAppLaunch('terminal', 'Terminal')} className="menu-app-item">
              <OSIcon app="terminal" os="ubuntu" size={32} />
              <span>Terminal</span>
            </div>
            <div onClick={() => handleAppLaunch('vscode', 'VS Code')} className="menu-app-item">
              <OSIcon app="vscode" os="ubuntu" size={32} />
              <span>VS Code</span>
            </div>
            <div onClick={() => handleAppLaunch('settings', 'Settings')} className="menu-app-item">
              <OSIcon app="settings" os="ubuntu" size={32} />
              <span>Settings</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LinuxTheme;
