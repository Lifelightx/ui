import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HardDrive, Terminal, Cpu, Settings, FolderPlus, FilePlus } from 'lucide-react';
import { useStore } from '../store/index';
import { themeStore, themeActions } from '../store/themeStore';
import { windowStore, windowActions } from '../store/windowStore';
import { fsHelpers } from '../store/fileStore';
import { Window } from '../window-manager/Window';

// Import apps
import { TerminalApp } from '../../apps/terminal/Terminal';
import { FilesApp } from '../../apps/files/Files';
import { SettingsApp } from '../../apps/settings/Settings';
import { VSCodeApp } from '../../apps/vscode/VSCode';

// Import Theme Shells
import { MacTheme } from '../../os/macos/MacTheme';
import { WinTheme } from '../../os/windows11/WinTheme';
import { LinuxTheme } from '../../os/ubuntu/LinuxTheme';

export const Desktop: React.FC = () => {
  const currentOS = useStore(themeStore, (s) => s.currentOS);
  const wallpaper = useStore(themeStore, (s) => s.wallpaper);
  const windows = useStore(windowStore, (s) => s.windows);
  
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean } | null>(null);

  const handleShutdown = () => {
    window.history.pushState({}, '', '/osbox');
    window.dispatchEvent(new Event('popstate'));
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      visible: true
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const getDesktopIconLabel = () => {
    if (currentOS === 'macos') return 'Macintosh HD';
    if (currentOS === 'windows') return 'This PC';
    return 'Home Folder';
  };

  const getTerminalLabel = () => {
    if (currentOS === 'macos') return 'zsh Terminal';
    if (currentOS === 'windows') return 'CMD Console';
    return 'Bash Terminal';
  };

  const renderAppContent = (appType: string) => {
    switch (appType) {
      case 'terminal':
        return <TerminalApp osType={currentOS} />;
      case 'files':
        return <FilesApp />;
      case 'vscode':
        return <VSCodeApp />;
      case 'settings':
        return <SettingsApp />;
      default:
        return <div className="p-4 text-white">App is currently loading...</div>;
    }
  };

  const createNewFileOnDesktop = () => {
    fsHelpers.createFile('/Users/jeebanjyoti/Desktop', 'Untitled.txt', 'This is a new text file.');
    handleCloseContextMenu();
  };

  const createNewFolderOnDesktop = () => {
    fsHelpers.createFolder('/Users/jeebanjyoti/Desktop', 'New Folder');
    handleCloseContextMenu();
  };

  return (
    <div 
      className="desktop-full-env" 
      style={{ background: wallpaper }}
      onContextMenu={handleDesktopContextMenu}
      onClick={handleCloseContextMenu}
    >
      {/* Desktop Grid Icons */}
      <div className="desktop-icon-layout">
        <div 
          onDoubleClick={() => windowActions.openWindow('files', getDesktopIconLabel(), 'folder')} 
          className="desktop-icon"
        >
          <HardDrive size={34} style={{ color: currentOS === 'macos' ? '#00bcd4' : currentOS === 'windows' ? '#0078d7' : '#e95420' }} />
          <span>{getDesktopIconLabel()}</span>
        </div>
        <div 
          onDoubleClick={() => windowActions.openWindow('terminal', getTerminalLabel(), 'terminal')} 
          className="desktop-icon"
        >
          <Terminal size={34} style={{ color: '#ffffff' }} />
          <span>{getTerminalLabel()}</span>
        </div>
        <div 
          onDoubleClick={() => windowActions.openWindow('vscode', 'VS Code', 'vscode')} 
          className="desktop-icon"
        >
          <Settings size={34} style={{ color: '#007acc' }} />
          <span>VS Code</span>
        </div>
        <div 
          onDoubleClick={() => windowActions.openWindow('settings', 'System Diagnostics', 'settings')} 
          className="desktop-icon"
        >
          <Cpu size={34} style={{ color: currentOS === 'macos' ? '#ff9500' : currentOS === 'windows' ? '#4fc3f7' : '#34c759' }} />
          <span>Diagnostics</span>
        </div>
      </div>

      {/* Render Active Windows with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {windows.map((win) => (
          <Window key={win.id} windowInfo={win} osType={currentOS}>
            {renderAppContent(win.app)}
          </Window>
        ))}
      </AnimatePresence>

      {/* Render Active OS Taskbars/Menu bars */}
      {currentOS === 'macos' && <MacTheme onShutdown={handleShutdown} />}
      {currentOS === 'windows' && <WinTheme onShutdown={handleShutdown} />}
      {currentOS === 'ubuntu' && <LinuxTheme onShutdown={handleShutdown} />}

      {/* Desktop Right Click Context Menu */}
      {contextMenu?.visible && (
        <div 
          className="win-context-menu font-sans"
          style={{
            position: 'absolute',
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
            zIndex: 99999
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={createNewFileOnDesktop} className="context-item">
            <FilePlus size={14} />
            <span>New Text File</span>
          </button>
          <button onClick={createNewFolderOnDesktop} className="context-item">
            <FolderPlus size={14} />
            <span>New Folder</span>
          </button>
          <div className="context-divider" />
          <button onClick={() => { themeActions.setWallpaper('linear-gradient(135deg, #1e3a8a 0%, #3b0764 100%)'); handleCloseContextMenu(); }} className="context-item">
            <span>Change Accent Backdrop</span>
          </button>
          <button onClick={handleCloseContextMenu} className="context-item">
            <span>Refresh Desktop</span>
          </button>
        </div>
      )}
    </div>
  );
};
export default Desktop;
