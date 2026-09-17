import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
  type: 'star' | 'circle' | 'sparkle';
}

const PALETTE = [
  '#ffb6c1', // light pink
  '#f472b6', // rose pink
  '#e36fc9', // vibrant pink
  '#c084fc', // purple
  '#9d70aa', // lilac
  '#839cca', // periwinkle
  '#ffd700', // soft gold
  '#ffffff', // pure white shimmer
];

export const SparkleCursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    const particles: Particle[] = [];

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse velocity
    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();

    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    const drawSparkle = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number
    ) => {
      // 4-point sparkle cross
      context.beginPath();
      context.moveTo(cx, cy - radius * 1.5);
      context.quadraticCurveTo(cx, cy, cx + radius * 1.5, cy);
      context.quadraticCurveTo(cx, cy, cx, cy + radius * 1.5);
      context.quadraticCurveTo(cx, cy, cx - radius * 1.5, cy);
      context.quadraticCurveTo(cx, cy, cx, cy - radius * 1.5);
      context.closePath();
      context.fill();
    };

    const spawnSparkle = (x: number, y: number, speed: number) => {
      // Số lượng hạt tỷ lệ theo vận tốc di chuột
      const count = Math.min(Math.floor(speed / 12) + 1, 4);

      for (let i = 0; i < count; i++) {
        // Chỉ thêm tối đa 80 hạt trên màn hình cùng lúc để cực kỳ mượt mà
        if (particles.length > 80) break;

        const angle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * 1.2 + 0.3;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const types: ('star' | 'circle' | 'sparkle')[] = ['sparkle', 'star', 'circle'];
        const type = types[Math.floor(Math.random() * types.length)];
        const maxLife = Math.floor(Math.random() * 22) + 18; // tồn tại trong 18 - 40 frames (~0.3 - 0.6s)

        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * pSpeed,
          vy: Math.sin(angle) * pSpeed - 0.2, // hơi bay nhẹ lên
          size: Math.random() * 3 + 2.5,
          maxSize: Math.random() * 3 + 2.5,
          color,
          alpha: 0.95,
          life: 0,
          maxLife,
          rotation: Math.random() * Math.PI,
          rotSpeed: (Math.random() - 0.5) * 0.15,
          type,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = (dist / dt) * 10; // pixels per unit time

      // Chỉ kích hoạt bling bling khi di chuột nhanh (speed > threshold)
      // Vận tốc nhanh vừa đủ: speed > 18
      if (speed > 16 && dist > 12) {
        spawnSparkle(e.clientX, e.clientY, speed);
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Loop animation
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        const progress = p.life / p.maxLife;
        p.alpha = Math.max(0, 1 - progress);
        const currentSize = p.maxSize * (1 - progress * 0.4);

        if (p.life >= p.maxLife || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;

        if (p.type === 'sparkle') {
          drawSparkle(ctx, 0, 0, currentSize);
        } else if (p.type === 'star') {
          drawStar(ctx, 0, 0, 4, currentSize * 1.2, currentSize * 0.4);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 0.75, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 select-none"
      style={{ willChange: 'contents' }}
      aria-hidden="true"
    />
  );
};
