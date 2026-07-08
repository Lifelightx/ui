import React from 'react';
import { windowActions, windowStore } from '../../core/store/windowStore';
import { useStore } from '../../core/store/index';
import { OSIcon } from '../../components/osbox/OSIcon';

interface MacThemeProps {
  onShutdown: () => void;
}

export const MacTheme: React.FC<MacThemeProps> = ({ onShutdown }) => {
  const windows = useStore(windowStore, (s) => s.windows);

  const isWindowOpen = (app: string) => {
    return windows.some((w) => w.app === app && !w.minimized);
  };

  return (
    <div className="macos-shell-container">
      {/* Top Glassmorphic Menu Bar */}
      <div className="mac-top-bar font-sans">
        <div className="top-bar-left">
          <div className="mac-apple-logo" onClick={onShutdown}>
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
          <button onClick={onShutdown} className="mac-shutdown-trigger font-sans" style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#ff3b30', fontWeight: 500, cursor: 'pointer' }}>
            <OSIcon app="shutdown" os="macos" size={14} />
            <span>Shut Down</span>
          </button>
        </div>
      </div>
 
      {/* Magnification Shelf Dock */}
      <div className="mac-dock-shelf">
        <div className="mac-dock-container">
          <div onClick={() => windowActions.openWindow('files', 'Finder', 'folder')} className="dock-icon" title="Finder">
            <OSIcon app="files" os="macos" size={30} />
            {isWindowOpen('files') && <div className="dock-active-dot" />}
          </div>
          <div onClick={() => windowActions.openWindow('terminal', 'zsh Terminal', 'terminal')} className="dock-icon" title="Terminal">
            <OSIcon app="terminal" os="macos" size={30} />
            {isWindowOpen('terminal') && <div className="dock-active-dot" />}
          </div>
          <div onClick={() => windowActions.openWindow('vscode', 'VS Code', 'vscode')} className="dock-icon" title="VS Code">
            <OSIcon app="vscode" os="macos" size={30} />
            {isWindowOpen('vscode') && <div className="dock-active-dot" />}
          </div>
          <div onClick={() => windowActions.openWindow('settings', 'System Settings', 'settings')} className="dock-icon" title="System Settings">
            <OSIcon app="settings" os="macos" size={30} />
            {isWindowOpen('settings') && <div className="dock-active-dot" />}
          </div>
          <div className="dock-divider" />
          <div onClick={onShutdown} className="dock-icon" title="Shut Down">
            <OSIcon app="shutdown" os="macos" size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default MacTheme;
