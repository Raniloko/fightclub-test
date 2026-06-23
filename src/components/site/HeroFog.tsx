import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vx: number;
  growth: number;
  baseOpacity: number;
  phase: number;
};

export function HeroFog() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const rand = (min: number, max: number) => Math.random() * (max - min) + min;

    const createParticle = (index: number, h: number, w: number): Particle => ({
      x: rand(w * 0.5, w),
      y: rand(h * 0.7, h) + index * 80,
      radius: rand(100, 250),
      vy: rand(0.15, 0.3),
      vx: rand(0.05, 0.1),
      growth: 0.1,
      baseOpacity: rand(0.08, 0.14),
      phase: rand(0, Math.PI * 2),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: 12 }, (_, i) =>
          createParticle(i, height, width),
        );
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();

    const draw = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.y -= p.vy;
        p.x -= p.vx;
        p.radius += p.growth;

        if (p.y < -500 || p.radius > 600) {
          particlesRef.current[i] = createParticle(i, height, width);
          continue;
        }

        const pulse = Math.sin(t * 0.001 + p.phase) * 0.04;
        const op = Math.max(0, p.baseOpacity + pulse);

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(0, 180, 220, ${op})`);
        grad.addColorStop(0.4, `rgba(0, 160, 200, ${op * 0.5})`);
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
