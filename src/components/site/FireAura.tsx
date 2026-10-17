import { useEffect, useRef } from "react";
import type { FirePhase } from "./IntroSequence";

type Flame = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  seed: number;
  wf: number;
};
type Ember = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  seed: number;
};

const MAX_FLAMES = 150;
const MAX_EMBERS = 50;

// Where the painted brush stroke sits inside slogan.webp (fractions of the image box)
const STROKE = { left: 0.06, right: 0.94, top: 0.22, bottom: 0.8 };

/** Pre-rendered soft blob per colour stage, so frames only blit images (no per-particle gradients). */
function makeSprite(stops: [number, string][]) {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  stops.forEach(([o, col]) => grad.addColorStop(o, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

/** Pre-rendered flame tongue: round, hot base and a pointed tip that fades out. */
function makeTongue(base: string, mid: string, tip: string) {
  const c = document.createElement("canvas");
  c.width = 80;
  c.height = 150;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 8, 0, 128);
  grad.addColorStop(0, "rgba(0,0,0,0)");
  grad.addColorStop(0.3, tip);
  grad.addColorStop(0.65, mid);
  grad.addColorStop(1, base);
  g.filter = "blur(4px)";
  g.fillStyle = grad;
  g.beginPath();
  g.moveTo(40, 8);
  g.quadraticCurveTo(60, 60, 62, 104);
  g.arc(40, 104, 22, 0, Math.PI, false);
  g.quadraticCurveTo(20, 60, 40, 8);
  g.fill();
  return c;
}

/**
 * Fire behind the slogan: flame tongues rise from the brush stroke, a few embers
 * streak upward, and a soft heat glow sits under everything.
 * ignite → builds up, burn → one short flare, fade → dies down while the shutter rolls up.
 */
export function FireAura({ phase }: { phase: FirePhase }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const phaseRef = useRef(phase);
  const phaseChangedAt = useRef(0);

  useEffect(() => {
    phaseRef.current = phase;
    phaseChangedAt.current = performance.now();
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const banner = canvas?.parentElement;
    if (!canvas || !banner) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sprites = [
      makeSprite([
        [0, "rgba(255,250,225,1)"],
        [0.35, "rgba(255,225,140,0.9)"],
        [1, "rgba(255,180,60,0)"],
      ]), // core
      makeSprite([
        [0, "rgba(255,210,90,0.95)"],
        [0.45, "rgba(255,140,20,0.7)"],
        [1, "rgba(255,90,0,0)"],
      ]), // yellow-orange
      makeSprite([
        [0, "rgba(255,120,10,0.85)"],
        [0.5, "rgba(220,50,0,0.5)"],
        [1, "rgba(160,20,0,0)"],
      ]), // orange-red
      makeSprite([
        [0, "rgba(150,25,0,0.55)"],
        [1, "rgba(60,0,0,0)"],
      ]), // dying red
    ];
    const tongues = [
      makeTongue("rgba(255,250,220,1)", "rgba(255,200,70,0.95)", "rgba(255,110,0,0.7)"), // young & hot
      makeTongue("rgba(255,200,80,0.95)", "rgba(255,120,10,0.85)", "rgba(210,40,0,0.6)"),
      makeTongue("rgba(255,120,20,0.8)", "rgba(200,40,0,0.6)", "rgba(120,10,0,0.35)"), // cooling
    ];
    const glow = makeSprite([
      [0, "rgba(255,110,0,0.55)"],
      [0.5, "rgba(200,40,0,0.25)"],
      [1, "rgba(120,0,0,0)"],
    ]);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    // brush stroke rectangle in canvas coordinates
    let sx0 = 0,
      sx1 = 0,
      sy0 = 0,
      sy1 = 0,
      bandH = 0,
      scale = 1;

    const resize = () => {
      const cr = canvas.getBoundingClientRect();
      const br = banner.getBoundingClientRect();
      w = cr.width;
      h = cr.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ox = br.left - cr.left;
      const oy = br.top - cr.top;
      sx0 = ox + br.width * STROKE.left;
      sx1 = ox + br.width * STROKE.right;
      sy0 = oy + br.height * STROKE.top;
      sy1 = oy + br.height * STROKE.bottom;
      bandH = sy1 - sy0;
      scale = Math.min(1, Math.max(0.45, br.width / 1100)); // fewer particles on phones
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(banner);

    const flames: Flame[] = [];
    const embers: Ember[] = [];
    let flameDebt = 0;
    let emberDebt = 0;
    let burstDone = false;

    // denser fire in the middle (behind "BESTEN VERSION"), lighter at the ends
    const strokeX = () => {
      const u = (Math.random() + Math.random() + Math.random()) / 3;
      return sx0 + (sx1 - sx0) * (Math.random() < 0.7 ? u : Math.random());
    };

    const spawnFlame = (power: number) => {
      flames.push({
        x: strokeX(),
        y: sy0 + bandH * (0.12 + Math.random() * 0.3),
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.35 + Math.random() * 0.6) * (bandH / 90) * (0.8 + power * 0.3),
        life: 0,
        max: 380 + Math.random() * 380,
        size: bandH * (0.9 + Math.random() * 0.9) * (0.8 + power * 0.3),
        seed: Math.random() * 1000,
        wf: 0.4 + Math.random() * 0.3,
      });
    };
    const spawnEmber = (fast = false) => {
      embers.push({
        x: strokeX(),
        y: sy0 + bandH * Math.random() * 0.4,
        vx: (Math.random() - 0.5) * (fast ? 2.2 : 0.9),
        vy: -(fast ? 2.2 + Math.random() * 2.4 : 0.9 + Math.random() * 1.4),
        life: 0,
        max: 900 + Math.random() * 1000,
        size: 0.8 + Math.random() * 1.4,
        seed: Math.random() * 1000,
      });
    };

    // How strongly the fire burns right now (0 … ~1.5)
    const intensity = (now: number) => {
      // rAF timestamps can be a hair older than the phase switch; a negative value would turn ** into NaN
      const since = Math.max(0, now - phaseChangedAt.current);
      switch (phaseRef.current) {
        case "ignite":
          return Math.min(1, since / 600) ** 1.4;
        case "burn":
          return 1 + 0.5 * Math.max(0, 1 - since / 450);
        case "fade":
          return Math.max(0, 1 - since / 380);
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      const dt = Math.min(40, now - last);
      last = now;
      const k = dt / 16.67;
      const power = intensity(now);

      if (phaseRef.current === "burn" && !burstDone) {
        burstDone = true;
        for (let i = 0; i < Math.round(18 * scale); i++) spawnEmber(true);
      }

      flameDebt += (dt / 1000) * 220 * scale * power;
      emberDebt += (dt / 1000) * 12 * scale * power;
      while (flameDebt >= 1) {
        flameDebt -= 1;
        if (flames.length < MAX_FLAMES) spawnFlame(power);
      }
      while (emberDebt >= 1) {
        emberDebt -= 1;
        if (embers.length < MAX_EMBERS) spawnEmber();
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // heat bed under the stroke
      if (power > 0.01) {
        const flicker = 0.85 + 0.15 * Math.sin(now * 0.013) * Math.sin(now * 0.007);
        ctx.globalAlpha = Math.min(1, 0.55 * power * flicker);
        ctx.drawImage(glow, sx0 - bandH, sy0 - bandH * 1.6, sx1 - sx0 + bandH * 2, bandH * 3.6);
      }

      for (let i = flames.length - 1; i >= 0; i--) {
        const f = flames[i];
        f.life += dt;
        if (f.life >= f.max) {
          flames.splice(i, 1);
          continue;
        }
        const t = f.life / f.max;
        f.vx += Math.sin(now * 0.006 + f.seed) * 0.03 * k;
        f.vy -= 0.006 * k; // slight lift; the tongue grows rather than flies
        f.x += f.vx * k;
        f.y += f.vy * k;
        const tongue = tongues[t < 0.3 ? 0 : t < 0.65 ? 1 : 2];
        const s = f.size;
        // rooted in the stroke: the tongue shoots up, licks and collapses
        const grow = Math.sin(Math.PI * Math.min(1, t * 1.1));
        const flick = 0.82 + 0.18 * Math.sin(now * 0.028 + f.seed);
        const fh = s * 1.45 * grow * flick;
        const fw = s * f.wf * (0.65 + 0.35 * grow);
        const angle = Math.max(-0.3, Math.min(0.3, f.vx * 0.35));
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        ctx.globalAlpha = 0.9 * (1 - t * 0.5);
        // base sits below the origin, hidden behind the brush stroke
        ctx.setTransform(dpr * cos, dpr * sin, -dpr * sin, dpr * cos, dpr * f.x, dpr * f.y);
        ctx.drawImage(tongue, -fw / 2, -fh + s * 0.12, fw, fh);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life += dt;
        if (e.life >= e.max || e.y < -20) {
          embers.splice(i, 1);
          continue;
        }
        const t = e.life / e.max;
        e.vx += Math.sin(now * 0.004 + e.seed) * 0.02 * k;
        e.vy *= 1 - 0.004 * k;
        e.x += e.vx * k;
        e.y += e.vy * k;
        const twinkle = 0.65 + 0.35 * Math.sin(now * 0.03 + e.seed);
        ctx.globalAlpha = (1 - t) * twinkle;
        ctx.strokeStyle = t < 0.5 ? "rgba(255,220,140,1)" : "rgba(255,140,40,1)";
        ctx.lineWidth = e.size * 0.8;
        ctx.beginPath();
        ctx.moveTo(e.x, e.y);
        ctx.lineTo(e.x - e.vx * 2, e.y - e.vy * 2);
        ctx.stroke();
        const r = e.size * 3.2;
        ctx.drawImage(sprites[t < 0.5 ? 0 : 1], e.x - r, e.y - r, r * 2, r * 2);
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
