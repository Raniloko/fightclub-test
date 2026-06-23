import { useEffect, useRef } from "react";

export function SmokeEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles: {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      speedX: number;
      speedY: number;
      growSpeed: number;
      rotation: number;
      rotationSpeed: number;
      life: number;
    }[] = [];
    const PARTICLE_COUNT = 18;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: canvas.width * (0.4 + Math.random() * 0.6),
        y: canvas.height * (0.5 + Math.random() * 0.5),
        radius: 120 + Math.random() * 250,
        opacity: 0.03 + Math.random() * 0.06,
        speedX: -(0.08 + Math.random() * 0.15),
        speedY: -(0.1 + Math.random() * 0.25),
        growSpeed: 0.15 + Math.random() * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.002,
        life: Math.random(),
      });
    }

    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(0.3, `rgba(220, 220, 220, ${p.opacity * 0.7})`);
        gradient.addColorStop(0.6, `rgba(200, 200, 200, ${p.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(180, 180, 180, 0)`);

        ctx.scale(1, 0.55);
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();

        p.x += p.speedX;
        p.y += p.speedY;
        p.radius += p.growSpeed;
        p.rotation += p.rotationSpeed;
        p.life += 0.003;

        const fade = Math.sin(p.life * Math.PI);
        p.opacity = (0.03 + Math.random() * 0.01) * fade;

        if (p.y < -p.radius || p.opacity <= 0.005 || p.life >= 1) {
          p.x = canvas.width * (0.4 + Math.random() * 0.6);
          p.y = canvas.height * (0.7 + Math.random() * 0.3);
          p.radius = 120 + Math.random() * 200;
          p.opacity = 0.03 + Math.random() * 0.05;
          p.speedX = -(0.08 + Math.random() * 0.15);
          p.speedY = -(0.1 + Math.random() * 0.2);
          p.life = 0;
        }
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
