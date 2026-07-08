import React from 'react';

// Official / high-fidelity SVGs for each OS
export const MacHDIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <defs>
      <linearGradient id="macHDGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f3f4f6" />
        <stop offset="30%" stopColor="#d1d5db" />
        <stop offset="70%" stopColor="#9ca3af" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>
    </defs>
    <rect x="12" y="14" width="40" height="36" rx="4" fill="url(#macHDGrad)" stroke="#374151" strokeWidth="2" />
    <rect x="22" y="50" width="20" height="4" rx="1" fill="#1f2937" />
    <line x1="12" y1="36" x2="52" y2="36" stroke="#4b5563" strokeWidth="1" />
    <circle cx="18" cy="43" r="2.5" fill="#10b981" />
    <rect x="24" y="22" width="16" height="8" rx="1" fill="#111827" />
    <line x1="28" y1="26" x2="36" y2="26" stroke="#4b5563" strokeWidth="1.5" />
  </svg>
);

export const MacTerminalIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="8" width="52" height="48" rx="10" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
    <text x="14" y="38" fill="#a855f7" fontFamily="Courier, monospace" fontSize="24" fontWeight="bold">&gt;_</text>
  </svg>
);

export const MacMonitorIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="8" width="52" height="48" rx="10" fill="#09090b" stroke="#27272a" strokeWidth="2" />
    <path d="M10 20 h44 M10 32 h44 M10 44 h44 M20 10 v44 M36 10 v44 M48 10 v44" stroke="#18181b" strokeWidth="1" />
    <path d="M8 32 h12 l4 -16 l6 32 l4 -22 l4 10 h18" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const WinPCIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="8" width="52" height="36" rx="4" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
    <rect x="10" y="12" width="44" height="24" rx="2" fill="#0284c7" />
    <path d="M26 44 h12 l2 8 h-16 z" fill="#475569" stroke="#334155" strokeWidth="1.5" />
    <rect x="18" y="52" width="28" height="4" rx="1" fill="#1e293b" />
  </svg>
);

export const WinTerminalIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="10" width="52" height="44" rx="4" fill="#0b0f19" stroke="#1e293b" strokeWidth="2" />
    <rect x="6" y="10" width="52" height="10" rx="2" fill="#1e293b" />
    <circle cx="14" cy="15" r="2" fill="#ef4444" />
    <circle cx="21" cy="15" r="2" fill="#eab308" />
    <circle cx="28" cy="15" r="2" fill="#22c55e" />
    <text x="14" y="38" fill="#38bdf8" fontFamily="Consolas, monospace" fontSize="16" fontWeight="bold">PS&gt;</text>
  </svg>
);

export const WinMonitorIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="8" width="52" height="48" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
    <rect x="14" y="34" width="8" height="14" fill="#0284c7" rx="1" />
    <rect x="24" y="22" width="8" height="26" fill="#38bdf8" rx="1" />
    <rect x="34" y="14" width="8" height="34" fill="#0ea5e9" rx="1" />
    <rect x="44" y="28" width="8" height="20" fill="#0369a1" rx="1" />
  </svg>
);

export const LinuxFolderIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M6 14a4 4 0 0 1 4-4h14l6 6h24a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V14z" fill="#df4a16" stroke="#b6340c" strokeWidth="1.5" />
    <path d="M10 20h44v24a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V20z" fill="#f07848" />
  </svg>
);

export const LinuxTerminalIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="10" width="52" height="44" rx="6" fill="#300a24" stroke="#df4a16" strokeWidth="2" />
    <text x="14" y="38" fill="#ffffff" fontFamily="monospace" fontSize="22" fontWeight="bold">$_</text>
  </svg>
);

export const LinuxMonitorIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <rect x="6" y="10" width="52" height="44" rx="6" fill="#2d2d2d" stroke="#1c1c1c" strokeWidth="2" />
    <circle cx="32" cy="32" r="16" fill="none" stroke="#444" strokeWidth="4" />
    <path d="M18 38 A16 16 0 1 1 46 38" fill="none" stroke="#e95420" strokeWidth="4" strokeLinecap="round" />
    <line x1="32" y1="32" x2="42" y2="22" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const VSCodeIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <defs>
      <linearGradient id="vscodeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#29b6f6" />
        <stop offset="100%" stopColor="#0288d1" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="52" height="52" rx="12" fill="#1e1e24" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" />
    <g transform="translate(14, 14) scale(1.5)">
      <path d="M23.984 6.742a.485.485 0 0 0-.25-.39L15.352.338a.47.47 0 0 0-.583.078l-7.24 7.234-4.444-3.32a.48.48 0 0 0-.573.018L.245 6.136a.487.487 0 0 0-.056.685l3.83 4.966-3.83 4.965a.486.486 0 0 0 .056.686l2.268 1.788a.48.48 0 0 0 .573.018l4.444-3.32 7.24 7.234a.47.47 0 0 0 .583.077l8.382-6.014a.485.485 0 0 0 .25-.39v-13.48a.483.483 0 0 0-.007-.023zM16.51 12l-4.51 3.425V8.575zm1.503-7.5l4.5 3.325v12.35l-4.5 3.325zm-9.362 7.5L4.5 9.075V14.925z" fill="url(#vscodeGrad)"/>
    </g>
  </svg>
);

export const ShutdownIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g transform="translate(10, 10) scale(1.83)">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="#ff3b30" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

interface OSIconProps {
  app: 'files' | 'terminal' | 'vscode' | 'settings' | 'shutdown';
  os: 'macos' | 'windows' | 'ubuntu';
  size?: number;
}

export const OSIcon: React.FC<OSIconProps> = ({ app, os, size }) => {
  if (app === 'shutdown') {
    return <ShutdownIcon size={size} />;
  }

  if (app === 'vscode') {
    return <VSCodeIcon size={size} />;
  }

  switch (os) {
    case 'macos':
      if (app === 'files') return <MacHDIcon size={size} />;
      if (app === 'terminal') return <MacTerminalIcon size={size} />;
      return <MacMonitorIcon size={size} />;
      
    case 'windows':
      if (app === 'files') return <WinPCIcon size={size} />;
      if (app === 'terminal') return <WinTerminalIcon size={size} />;
      return <WinMonitorIcon size={size} />;

    case 'ubuntu':
    default:
      if (app === 'files') return <LinuxFolderIcon size={size} />;
      if (app === 'terminal') return <LinuxTerminalIcon size={size} />;
      return <LinuxMonitorIcon size={size} />;
  }
};
