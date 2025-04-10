// src/pages/PaymentResult.jsx

import React, { useEffect, useRef } from "react";

export default function PaymentResult() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ==== Settings
    const settings = {
      particles: {
        length: 10000,
        duration: 4,
        velocity: 80,
        effect: -1.3,
        size: 8,
      },
    };

    // ==== Utils
    class Point {
      constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
      }
      clone() {
        return new Point(this.x, this.y);
      }
      length(length) {
        if (length === undefined)
          return Math.sqrt(this.x * this.x + this.y * this.y);
        this.normalize();
        this.x *= length;
        this.y *= length;
        return this;
      }
      normalize() {
        const length = this.length();
        this.x /= length;
        this.y /= length;
        return this;
      }
    }

    class Particle {
      constructor() {
        this.position = new Point();
        this.velocity = new Point();
        this.acceleration = new Point();
        this.age = 0;
      }
      initialize(x, y, dx, dy) {
        this.position.x = x;
        this.position.y = y;
        this.velocity.x = dx;
        this.velocity.y = dy;
        this.acceleration.x = dx * settings.particles.effect;
        this.acceleration.y = dy * settings.particles.effect;
        this.age = 0;
      }
      update(deltaTime) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.age += deltaTime;
      }
      draw(context, image) {
        function ease(t) {
          return (--t) * t * t + 1;
        }
        const size = image.width * ease(this.age / settings.particles.duration);
        context.globalAlpha = 1 - this.age / settings.particles.duration;
        context.drawImage(
          image,
          this.position.x - size / 2,
          this.position.y - size / 2,
          size,
          size
        );
      }
    }

    class ParticlePool {
      constructor(length) {
        this.particles = new Array(length).fill().map(() => new Particle());
        this.firstActive = 0;
        this.firstFree = 0;
        this.duration = settings.particles.duration;
      }
      add(x, y, dx, dy) {
        this.particles[this.firstFree].initialize(x, y, dx, dy);
        this.firstFree = (this.firstFree + 1) % this.particles.length;
        if (this.firstFree === this.firstActive)
          this.firstActive = (this.firstActive + 1) % this.particles.length;
      }
      update(deltaTime) {
        const { particles, duration } = this;
        for (let i = this.firstActive; i !== this.firstFree;) {
          particles[i].update(deltaTime);
          if (particles[i].age >= duration) {
            this.firstActive = (this.firstActive + 1) % particles.length;
          }
          i = (i + 1) % particles.length;
        }
      }
      draw(context, image) {
        const { particles } = this;
        for (let i = this.firstActive; i !== this.firstFree; i = (i + 1) % particles.length) {
          particles[i].draw(context, image);
        }
      }
    }

    function pointOnHeart(t) {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) -
          50 * Math.cos(2 * t) -
          20 * Math.cos(3 * t) -
          10 * Math.cos(4 * t) +
          25
      );
    }

    const createHeartImage = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = settings.particles.size;
      canvas.height = settings.particles.size;

      function to(t) {
        const point = pointOnHeart(t);
        point.x = settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
        point.y = settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
        return point;
      }

      ctx.beginPath();
      let t = -Math.PI;
      let point = to(t);
      ctx.moveTo(point.x, point.y);
      while (t < Math.PI) {
        t += 0.01;
        point = to(t);
        ctx.lineTo(point.x, point.y);
      }
      ctx.closePath();
      ctx.fillStyle = "#d13a78c7";
      ctx.fill();

      const image = new Image();
      image.src = canvas.toDataURL();
      return image;
    };

    const context = canvas.getContext("2d");
    const particles = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration;
    let time;
    const image = createHeartImage();

    function render() {
      requestAnimationFrame(render);
      const newTime = Date.now() / 1000;
      const deltaTime = newTime - (time || newTime);
      time = newTime;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const amount = particleRate * deltaTime;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity);
        particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
      }

      particles.update(deltaTime);
      particles.draw(context, image);
    }

    function onResize() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }

    window.addEventListener("resize", onResize);
    setTimeout(() => {
      onResize();
      render();
    }, 10);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="box" style={{ width: "100vw", height: "100vh", background: "white" }}>
      <canvas id="pinkboard" ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
