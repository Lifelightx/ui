import React, { useState, useEffect } from 'react';
import './osbox.css';
import { OSBoxPortal } from './OSBoxPortal';
import { OSMacDesktop } from './OSMacDesktop';
import { OSWinDesktop } from './OSWinDesktop';
import { OSLinuxDesktop } from './OSLinuxDesktop';

export const OSBoxPage: React.FC = () => {
  const [currentSubRoute, setCurrentSubRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentSubRoute(path);
      // Sync the root attribute so styles know exactly which page we are on
      document.documentElement.setAttribute('data-route', path);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Initial sync
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Conditional rendering based on pathname
  if (currentSubRoute === '/osbox/macos') {
    return <OSMacDesktop />;
  }
  if (currentSubRoute === '/osbox/windows') {
    return <OSWinDesktop />;
  }
  if (currentSubRoute === '/osbox/linux') {
    return <OSLinuxDesktop />;
  }

  // Fallback selection portal
  return (
    <div className="os-portal-wrapper">
      <OSBoxPortal />
    </div>
  );
};

export default OSBoxPage;
