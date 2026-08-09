import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  kind: "flame" | "ember";
  seed: number;
};

const MAX_PARTICLES = 100;

/**
 * Cinematic fire aura rendered on a canvas that sits BEHIND the slogan.
 * Flame tongues lick upward around the edges, embers drift with turbulence.
 */
export function FireAura({
  intense = false,
  mode = "banner",
}: {
  intense?: boolean;
  mode?: "banner" | "orbit";
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intenseRef = useRef(intense);
  intenseRef.current = intense;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles: Particle[] = [];
    const start = performance.now();

    const spawn = (burstFactor: number, now: number) => {
      if (modeRef.current === "orbit") {
        // Emit along a rotating ellipse that wraps around the logo
        const rot = now * 0.0006;
        const angle = Math.random() * Math.PI * 2 + rot;
        const rx = w * 0.36 * (0.9 + Math.random() * 0.2);
        const ry = h * 0.38 * (0.9 + Math.random() * 0.2);
        const cx = w / 2;
        const cy = h / 2;
        const x = cx + Math.cos(angle) * rx;
        const y = cy + Math.sin(angle) * ry;
        const isEmber = Math.random() < 0.4;
        const outward = 0.25 + Math.random() * 0.45;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * outward * (isEmber ? 1.2 : 0.6) - Math.sin(angle) * 0.25,
          vy:
            Math.sin(angle) * outward * 0.35 -
            (isEmber ? 0.35 + Math.random() * 0.5 : 0.5 + Math.random() * 0.6) * burstFactor,
          life: 0,
          maxLife: isEmber ? 900 + Math.random() * 900 : 450 + Math.random() * 450,
          size: isEmber ? 1.2 + Math.random() * 1.8 : h * 0.045 * (0.6 + Math.random() * 0.9),
          kind: isEmber ? "ember" : "flame",
          seed: Math.random() * 1000,
        });
        return;
      }
      // Ring of emission around the slogan box (inset area), stronger at bottom/edges
      const edge = Math.random();
      let x: number;
      let y: number;
      if (edge < 0.55) {
        // bottom edge
        x = w * (0.05 + Math.random() * 0.9);
        y = h * (0.72 + Math.random() * 0.2);
      } else if (edge < 0.8) {
        // left / right edges
        x = Math.random() < 0.5 ? w * (0.02 + Math.random() * 0.12) : w * (0.86 + Math.random() * 0.12);
        y = h * (0.35 + Math.random() * 0.5);
      } else {
        // top edge embers
        x = w * (0.1 + Math.random() * 0.8);
        y = h * (0.28 + Math.random() * 0.18);
      }
      const isEmber = edge >= 0.8 || Math.random() < 0.25;
      const maxLife = isEmber ? 900 + Math.random() * 900 : 500 + Math.random() * 450;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.22,
        vy: -(isEmber ? 0.35 + Math.random() * 0.45 : 0.55 + Math.random() * 0.75) * burstFactor,
        life: 0,
        maxLife,
        size: isEmber ? 1.2 + Math.random() * 1.8 : (h * 0.05) * (0.6 + Math.random() * 0.9),
        kind: isEmber ? "ember" : "flame",
        seed: Math.random() * 1000,
      });
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      const elapsed = now - start;

      // 1.5s dramatic burst, then ambient
      const burst = elapsed < 1500 ? 1 + 1.1 * (1 - elapsed / 1500) : 1;
      const intensity = (intenseRef.current ? 1.45 : 1) * burst;

      const target = Math.min(MAX_PARTICLES, Math.round(52 * intensity));
      let toSpawn = Math.max(0, target - particles.length);
      while (toSpawn-- > 0) spawn(intensity, now);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / p.maxLife;
        // turbulence
        const turb = Math.sin((now * 0.004) + p.seed) * (p.kind === "ember" ? 0.05 : 0.03);
        p.vx += turb * (dt / 16);
        p.vy -= 0.008 * (dt / 16);
        p.x += p.vx * (dt / 16) * (p.kind === "ember" ? 1.4 : 1);
        p.y += p.vy * (dt / 16);

        const fade = 1 - t;

        if (p.kind === "ember") {
          const r = p.size * fade;
          ctx.globalAlpha = 0.85 * fade;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, Math.max(0.6, r * 4));
          g.addColorStop(0, "rgba(255,230,150,1)");
          g.addColorStop(0.35, "rgba(255,160,40,0.7)");
          g.addColorStop(1, "rgba(255,60,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.6, r * 4), 0, Math.PI * 2);
          ctx.fill();
        } else {
          const r = p.size * (0.5 + 0.9 * (1 - t));
          ctx.globalAlpha = 0.55 * fade * intensity;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          g.addColorStop(0, "rgba(255,245,200,0.95)");
          g.addColorStop(0.25, "rgba(255,200,70,0.8)");
          g.addColorStop(0.55, "rgba(255,120,10,0.55)");
          g.addColorStop(1, "rgba(190,30,0,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, r * 0.72, r * 1.25, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="fc-fire-canvas" aria-hidden="true" />;
}
