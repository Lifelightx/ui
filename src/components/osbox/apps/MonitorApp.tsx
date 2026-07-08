import React, { useRef, useEffect } from 'react';

export const MonitorApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const points: number[] = Array(30).fill(10);

    const updatePoints = () => {
      points.shift();
      const lastPoint = points[points.length - 1] || 10;
      const change = (Math.random() - 0.5) * 20;
      const nextPoint = Math.max(5, Math.min(95, lastPoint + change));
      points.push(nextPoint);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 20; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // CPU graph line
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
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
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // CPU percentage label
      const currentCpuVal = Math.round(points[points.length - 1] || 0);
      ctx.fillStyle = '#fff';
      ctx.font = '10px sans-serif';
      ctx.fillText(`CPU Load: ${currentCpuVal}%`, 10, 20);

      updatePoints();
    };

    const loop = () => {
      draw();
      setTimeout(() => {
        animationId = requestAnimationFrame(loop);
      }, 200);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="monitor-app">
      <div className="monitor-canvas-box">
        <canvas ref={canvasRef} width={340} height={180} className="monitor-app-canvas" />
      </div>
    </div>
  );
};
export default MonitorApp;
