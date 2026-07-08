import React, { useRef, useEffect } from 'react';
import { useStore } from '../../core/store/index';
import { themeStore, themeActions } from '../../core/store/themeStore';
import type { OSType } from '../../core/store/themeStore';
import { processStore } from '../../core/store/processStore';

export const SettingsApp: React.FC = () => {
  const currentOS = useStore(themeStore, (s) => s.currentOS);
  const accentColor = useStore(themeStore, (s) => s.accentColor);
  const overallCpu = useStore(processStore, (s) => s.overallCpu);
  const overallMem = useStore(processStore, (s) => s.overallMem);
  const processes = useStore(processStore, (s) => s.processes);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Monitor canvas updates
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points: number[] = Array(30).fill(10);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 20; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Add current CPU load
      points.shift();
      points.push(overallCpu * 5); // scale slightly

      // Draw path
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const step = canvas.width / (points.length - 1);
      points.forEach((pt, idx) => {
        const x = idx * step;
        const y = canvas.height - (pt / 100) * canvas.height;
        if (idx === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      // Shadow under graph
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, `${accentColor}33`);
      gradient.addColorStop(1, `${accentColor}00`);
      ctx.fillStyle = gradient;
      ctx.fill();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [overallCpu, accentColor]);

  const handleOSChange = (os: OSType) => {
    themeActions.setOS(os);
    // Push the state so URL changes dynamically
    let sub = '';
    if (os === 'macos') sub = '/macos';
    if (os === 'windows') sub = '/windows';
    if (os === 'ubuntu') sub = '/linux';
    window.history.pushState({}, '', '/osbox' + sub);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="finder-app font-sans flex flex-col p-4 space-y-4 overflow-y-auto" style={{ background: '#121214', color: '#eaeaea' }}>
      <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
        <h2 className="text-lg font-bold">System Diagnostics & Settings</h2>
        <span className="text-xs bg-neutral-800 px-2 py-1 rounded">OSbox Core Engine</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Theme Settings */}
        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-lg flex flex-col space-y-3">
          <span className="text-sm font-semibold text-neutral-400">Desktop Interface Shell</span>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => handleOSChange('macos')}
              className={`px-3 py-2 rounded text-sm text-left transition flex items-center justify-between ${
                currentOS === 'macos' ? 'bg-purple-600 text-white font-medium' : 'bg-neutral-800/80 hover:bg-neutral-800'
              }`}
            >
              <span>macOS Sequoia</span>
              {currentOS === 'macos' && <span className="text-xs">Active</span>}
            </button>
            <button
              onClick={() => handleOSChange('windows')}
              className={`px-3 py-2 rounded text-sm text-left transition flex items-center justify-between ${
                currentOS === 'windows' ? 'bg-purple-600 text-white font-medium' : 'bg-neutral-800/80 hover:bg-neutral-800'
              }`}
            >
              <span>Windows 11 Pro</span>
              {currentOS === 'windows' && <span className="text-xs">Active</span>}
            </button>
            <button
              onClick={() => handleOSChange('ubuntu')}
              className={`px-3 py-2 rounded text-sm text-left transition flex items-center justify-between ${
                currentOS === 'ubuntu' ? 'bg-purple-600 text-white font-medium' : 'bg-neutral-800/80 hover:bg-neutral-800'
              }`}
            >
              <span>Ubuntu GNOME</span>
              {currentOS === 'ubuntu' && <span className="text-xs">Active</span>}
            </button>
          </div>
        </div>

        {/* Resources stats */}
        <div className="bg-neutral-900/60 border border-neutral-800 p-4 rounded-lg flex flex-col space-y-3">
          <span className="text-sm font-semibold text-neutral-400">Live CPU Load Graph</span>
          <div className="w-full bg-black/40 rounded flex items-center justify-center p-2 border border-neutral-800/40">
            <canvas ref={canvasRef} width={220} height={100} style={{ width: '100%', height: '100px' }} />
          </div>
          <div className="flex justify-between text-xs text-neutral-400">
            <span>Overall CPU: {overallCpu}%</span>
            <span>Memory Allocated: {overallMem} MB</span>
          </div>
        </div>
      </div>

      {/* Task Manager process list */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4 flex flex-col space-y-3">
        <span className="text-sm font-semibold text-neutral-400">Process Monitor</span>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500">
                <th className="pb-2">PID</th>
                <th className="pb-2">Process Name</th>
                <th className="pb-2 text-right">CPU</th>
                <th className="pb-2 text-right">Memory</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.pid} className="border-b border-neutral-800/40 hover:bg-neutral-800/20">
                  <td className="py-2 text-neutral-500">{p.pid}</td>
                  <td className="py-2 font-medium text-white">{p.title}</td>
                  <td className="py-2 text-right text-purple-400">{p.cpuUsage.toFixed(1)}%</td>
                  <td className="py-2 text-right text-blue-400">{p.memUsage} MB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SettingsApp;
