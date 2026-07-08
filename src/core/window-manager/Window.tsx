import React, { useState } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { windowActions } from '../store/windowStore';
import type { WindowInstance } from '../store/windowStore';

interface WindowProps {
  windowInfo: WindowInstance;
  osType: 'macos' | 'windows' | 'ubuntu';
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ windowInfo, osType, children }) => {
  const { id, title, x, y, width, height, zIndex, minimized, maximized, focused } = windowInfo;
  const [isDraggingOrResizing, setIsDraggingOrResizing] = useState(false);
  
  if (minimized) return null;

  // Window drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (maximized) return;
    windowActions.focusWindow(id);
    setIsDraggingOrResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = x;
    const initialY = y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const nextX = initialX + deltaX;
      // Constraint header below top bar (28px)
      const nextY = Math.max(28, initialY + deltaY);

      windowActions.updateWindowPosition(id, nextX, nextY);
    };

    const onMouseUp = () => {
      setIsDraggingOrResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Window resize handler
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    windowActions.focusWindow(id);
    setIsDraggingOrResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = width;
    const initialH = height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const nextW = Math.max(280, initialW + deltaX);
      const nextH = Math.max(200, initialH + deltaY);

      windowActions.updateWindowSize(id, nextW, nextH);
    };

    const onMouseUp = () => {
      setIsDraggingOrResizing(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Maximize styling overrides
  const windowStyle: React.CSSProperties = maximized
    ? {
        position: 'absolute',
        left: osType === 'ubuntu' ? '64px' : 0,
        top: osType === 'macos' ? '24px' : osType === 'ubuntu' ? '28px' : 0,
        width: osType === 'ubuntu' ? 'calc(100vw - 64px)' : '100vw',
        height: `calc(100vh - ${osType === 'macos' ? '92px' : osType === 'ubuntu' ? '28px' : '48px'})`,
        zIndex,
      }
    : {
        position: 'absolute',
        left: 0,
        top: 0,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate3d(${x}px, ${y}px, 0px)`,
        zIndex
      };

  const getWindowThemeClass = () => {
    if (osType === 'macos') return 'mac-window-panel';
    if (osType === 'windows') return 'win-window-panel';
    return 'linux-window-panel';
  };

  const getTitlebarClass = () => {
    if (osType === 'macos') return 'mac-titlebar';
    if (osType === 'windows') return 'win-titlebar';
    return 'linux-titlebar';
  };

  return (
    <div
      className={`window-panel-container ${getWindowThemeClass()} ${focused ? 'focused-win' : ''} ${maximized ? 'maximized' : ''} ${isDraggingOrResizing ? 'dragging' : ''} window-animate-in`}
      style={windowStyle}
      onClick={() => windowActions.focusWindow(id)}
    >
      {/* WINDOW TITLE BAR */}
      <div className={getTitlebarClass()} onMouseDown={handleDragStart}>
        {osType === 'macos' ? (
          <>
            <div className="mac-dots">
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.closeWindow(id); }} 
                className="mac-dot red" 
                aria-label="Close"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.minimizeWindow(id); }} 
                className="mac-dot yellow" 
                aria-label="Minimize"
              />
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.maximizeWindow(id); }} 
                className="mac-dot green" 
                aria-label="Maximize"
              />
            </div>
            <span className="mac-titlebar-title">{title}</span>
          </>
        ) : osType === 'windows' ? (
          <>
            <span className="win-titlebar-title">{title}</span>
            <div className="win-controls">
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.minimizeWindow(id); }} 
                className="win-btn-action"
              >
                <Minus size={10} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.maximizeWindow(id); }} 
                className="win-btn-action"
              >
                <Square size={8} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.closeWindow(id); }} 
                className="win-btn-action red-action"
              >
                <X size={10} />
              </button>
            </div>
          </>
        ) : (
          /* Linux GNOME Titlebar */
          <>
            <span className="linux-titlebar-title">{title}</span>
            <div className="linux-controls">
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.minimizeWindow(id); }} 
                className="linux-btn-action"
              >
                <Minus size={8} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.maximizeWindow(id); }} 
                className="linux-btn-action"
              >
                <Square size={7} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); windowActions.closeWindow(id); }} 
                className="linux-btn-action red-action"
              >
                <X size={8} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* WINDOW CONTENT CONTAINER */}
      <div className="window-content-area">
        {children}
      </div>

      {/* RESIZE HANDLE (only visible when not maximized) */}
      {!maximized && (
        <div 
          className="window-resize-handle"
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '12px',
            height: '12px',
            cursor: 'se-resize',
            zIndex: 99
          }}
        />
      )}
    </div>
  );
};
export default Window;
