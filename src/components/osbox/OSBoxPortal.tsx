import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const OSBoxPortal: React.FC = () => {
  
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  const goHome = () => {
    navigateTo('/');
  };

  return (
    <div className="selection-screen">
      <div className="selection-header">
        <button onClick={goHome} className="back-home-btn font-sans">
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>
      </div>

      <div className="os-grid font-sans">
        {/* macOS Sequoia Block */}
        <div 
          onClick={() => navigateTo('/osbox/macos')} 
          className="os-card macos-card"
        >
          <div className="os-card-logo-container">
            {/* Flat Apple Logo SVG */}
            <svg viewBox="0 0 24 24" width="38" height="38" fill="#ffffff" style={{ opacity: 0.95 }}>
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
            </svg>
          </div>
          <h3 className="os-card-title">macOS Sequoia</h3>
          <span className="os-card-spec">Sequoia 15.0 // Unix Environment</span>
          <p className="os-card-detail">Glassmorphic Unix desktop environment featuring circular Window managers, interactive file Finder explorer, zsh console, and live canvas Activity Monitor.</p>
          <button className="boot-btn">Boot OS</button>
        </div>

        {/* Windows 11 Block */}
        <div 
          onClick={() => navigateTo('/osbox/windows')} 
          className="os-card windows-card"
        >
          <div className="os-card-logo-container">
            {/* Windows 11 Logo SVG */}
            <svg viewBox="0 0 24 24" width="36" height="36">
              <path fill="#0078d4" d="M0 0h11.3v11.3H0zM12.7 0H24v11.3H12.7zM0 12.7h11.3V24H0zM12.7 12.7H24V24H12.7z"/>
            </svg>
          </div>
          <h3 className="os-card-title">Windows 11 Pro</h3>
          <span className="os-card-spec">Fluent Grid // PowerShell Host</span>
          <p className="os-card-detail">Fluent Design interface containing taskbar-driven workflow navigation, start menu search index, Windows explorer, Cmd diagnostics, and Task Manager.</p>
          <button className="boot-btn">Boot OS</button>
        </div>

        {/* Ubuntu Linux Block */}
        <div 
          onClick={() => navigateTo('/osbox/linux')} 
          className="os-card linux-card"
        >
          <div className="os-card-logo-container">
            {/* Ubuntu Circle of Friends Logo SVG */}
            <svg viewBox="0 0 24 24" width="38" height="38" fill="#e95420">
              <path d="M17.61.455a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zM12.92.8C8.923.777 5.137 2.941 3.148 6.451a4.5 4.5 0 0 1 .26-.007 4.92 4.92 0 0 1 2.585.737A8.316 8.316 0 0 1 12.688 3.6 4.944 4.944 0 0 1 13.723.834 11.008 11.008 0 0 0 12.92.8zm9.226 4.994a4.915 4.915 0 0 1-1.918 2.246 8.36 8.36 0 0 1-.273 8.303 4.89 4.89 0 0 1 1.632 2.54 11.156 11.156 0 0 0 .559-13.089zM3.41 7.932A3.41 3.41 0 0 0 0 11.342a3.41 3.41 0 0 0 3.41 3.409 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41zm2.027 7.866a4.908 4.908 0 0 1-2.915.358 11.1 11.1 0 0 0 7.991 6.698 11.234 11.234 0 0 0 2.422.249 4.879 4.879 0 0 1-.999-2.85 8.484 8.484 0 0 1-.836-.136 8.304 8.304 0 0 1-5.663-4.32zm11.405.928a3.41 3.41 0 0 0-3.41 3.41 3.41 3.41 0 0 0 3.41 3.41 3.41 3.41 0 0 0 3.41-3.41 3.41 3.41 0 0 0-3.41-3.41z"/>
            </svg>
          </div>
          <h3 className="os-card-title">Ubuntu Desktop</h3>
          <span className="os-card-spec">GNOME 46 // Ubuntu Daemon</span>
          <p className="os-card-detail">GNOME shell experience styled with Left application docks, interactive Bash files browser, system metrics graphs, and customizable workspaces.</p>
          <button className="boot-btn">Boot OS</button>
        </div>
      </div>
    </div>
  );
};
