import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  
  const windowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x, y });
  const sizeRef = useRef({ w: width, h: height });

  // Sync ref values when properties change externally
  useEffect(() => {
    posRef.current = { x, y };
    sizeRef.current = { w: width, h: height };
    if (windowRef.current && !maximized) {
      windowRef.current.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
      windowRef.current.style.width = `${width}px`;
      windowRef.current.style.height = `${height}px`;
    }
  }, [x, y, width, height, maximized]);

  if (minimized) return null;

  // Window drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    if (maximized) return;
    windowActions.focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = posRef.current.x;
    const initialY = posRef.current.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const nextX = initialX + deltaX;
      // Constraint header below top bar (24px)
      const nextY = Math.max(28, initialY + deltaY);

      posRef.current = { x: nextX, y: nextY };
      if (windowRef.current) {
        windowRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0px)`;
      }
    };

    const onMouseUp = () => {
      windowActions.updateWindowPosition(id, posRef.current.x, posRef.current.y);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Window resize handler
  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    windowActions.focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = sizeRef.current.w;
    const initialH = sizeRef.current.h;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      const nextW = Math.max(280, initialW + deltaX);
      const nextH = Math.max(200, initialH + deltaY);

      sizeRef.current = { w: nextW, h: nextH };
      if (windowRef.current) {
        windowRef.current.style.width = `${nextW}px`;
        windowRef.current.style.height = `${nextH}px`;
      }
    };

    const onMouseUp = () => {
      windowActions.updateWindowSize(id, sizeRef.current.w, sizeRef.current.h);
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
        transform: 'none'
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
    <motion.div
      ref={windowRef}
      className={`${getWindowThemeClass()} ${focused ? 'focused-win' : ''} ${maximized ? 'maximized' : ''}`}
      style={windowStyle}
      onClick={() => windowActions.focusWindow(id)}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
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
    </motion.div>
  );
};
export default Window;
