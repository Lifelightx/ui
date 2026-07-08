import React, { useState, useEffect } from 'react';
import './osbox/osbox.css';
import { OSBoxPortal } from './osbox/OSBoxPortal';
import { Desktop } from '../core/desktop/Desktop';
import { themeActions } from '../core/store/themeStore';
import { windowActions } from '../core/store/windowStore';

export const OSBoxPage: React.FC = () => {
  const [currentSubRoute, setCurrentSubRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentSubRoute(path);

      // Sync root data-route attribute for cursor override stylesheets
      document.documentElement.setAttribute('data-route', path);

      // Reset windows when switching OS environments
      windowActions.clearWindows();

      // Update theme store if navigating to specific OS subroute
      if (path === '/osbox/macos') {
        themeActions.setOS('macos');
      } else if (path === '/osbox/windows') {
        themeActions.setOS('windows');
      } else if (path === '/osbox/linux') {
        themeActions.setOS('ubuntu');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    // Trigger initial check
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const isOSRoute = 
    currentSubRoute === '/osbox/macos' || 
    currentSubRoute === '/osbox/windows' || 
    currentSubRoute === '/osbox/linux';

  if (isOSRoute) {
    return <Desktop />;
  }

  // Fallback boot menu
  return (
    <div className="os-portal-wrapper">
      <OSBoxPortal />
    </div>
  );
};

export default OSBoxPage;
