import React from 'react';
import { X, Minus, Square } from 'lucide-react';

interface OSWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  theme: 'macos' | 'windows' | 'linux';
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const OSWindow: React.FC<OSWindowProps> = ({
  id: _id,
  title,
  isMinimized,
  isMaximized,
  x,
  y,
  width,
  height,
  zIndex,
  theme,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onMouseDown,
  children
}) => {
  if (isMinimized) return null;

  // Window styling overrides based on theme
  const windowStyle: React.CSSProperties = {
    left: isMaximized ? (theme === 'linux' ? '64px' : 0) : x,
    top: isMaximized 
      ? (theme === 'macos' ? '24px' : theme === 'linux' ? '28px' : 0) 
      : y,
    width: isMaximized 
      ? (theme === 'linux' ? 'calc(100vw - 64px)' : '100vw') 
      : width,
    height: isMaximized 
      ? `calc(100vh - ${theme === 'macos' ? '92px' : theme === 'linux' ? '28px' : '48px'})`
      : height,
    zIndex: zIndex
  };

  if (theme === 'macos') {
    return (
      <div 
        className={`mac-window-panel ${isMaximized ? 'maximized' : ''}`}
        style={windowStyle}
        onClick={onFocus}
      >
        <div className="mac-titlebar" onMouseDown={onMouseDown}>
          <div className="mac-dots">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="mac-dot red" 
              aria-label="Close"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
              className="mac-dot yellow" 
              aria-label="Minimize"
            />
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
              className="mac-dot green" 
              aria-label="Maximize"
            />
          </div>
          <span className="mac-titlebar-title">{title}</span>
        </div>
        <div className="window-content-area">
          {children}
        </div>
      </div>
    );
  }

  if (theme === 'windows') {
    return (
      <div 
        className={`win-window-panel ${isMaximized ? 'maximized' : ''}`}
        style={windowStyle}
        onClick={onFocus}
      >
        <div className="win-titlebar" onMouseDown={onMouseDown}>
          <span className="win-titlebar-title">{title}</span>
          <div className="win-controls">
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
              className="win-btn-action" 
              title="Minimize"
            >
              <Minus size={10} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
              className="win-btn-action" 
              title="Maximize"
            >
              <Square size={8} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="win-btn-action red-action" 
              title="Close"
            >
              <X size={10} />
            </button>
          </div>
        </div>
        <div className="window-content-area">
          {children}
        </div>
      </div>
    );
  }

  // Linux GNOME Theme
  return (
    <div 
      className={`linux-window-panel ${isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
      onClick={onFocus}
    >
      <div className="linux-titlebar" onMouseDown={onMouseDown}>
        <span className="linux-titlebar-title">{title}</span>
        <div className="linux-controls">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }} 
            className="linux-btn-action" 
            title="Minimize"
          >
            <Minus size={8} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(); }} 
            className="linux-btn-action" 
            title="Maximize"
          >
            <Square size={7} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="linux-btn-action red-action" 
            title="Close"
          >
            <X size={8} />
          </button>
        </div>
      </div>
      <div className="window-content-area">
        {children}
      </div>
    </div>
  );
};
