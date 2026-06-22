import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const generateUUID = () => {
  const lut = Array(256).fill().map((_, i) => (i < 16 ? '0' : '') + i.toString(16));
  const d0 = Math.random() * 0xffffffff | 0;
  const d1 = Math.random() * 0xffffffff | 0;
  const d2 = Math.random() * 0xffffffff | 0;
  const d3 = Math.random() * 0xffffffff | 0;
  return (
    lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff]
  );
};

export default function StarfieldCanvas({
  starColor = 'rgba(255,255,255,0.9)',
  bgColor = '#040408',
  speed = 0.4,
  quantity = 350,
  opacity = 0.12,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const sd = useRef({
    w: 0, h: 0, ctx: null,
    cw: 0, ch: 0,
    x: 0, y: 0, z: 0,
    star: { colorRatio: 0, arr: [] },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      const el = canvas.parentElement;
      sd.current.w = el.clientWidth;
      sd.current.h = el.clientHeight;
      sd.current.x = Math.round(sd.current.w / 2);
      sd.current.y = Math.round(sd.current.h / 2);
      sd.current.z = (sd.current.w + sd.current.h) / 2;
      sd.current.star.colorRatio = 1 / sd.current.z;
    };

    const setup = () => {
      measure();
      sd.current.ctx = canvas.getContext('2d');
      canvas.width = sd.current.w;
      canvas.height = sd.current.h;
    };

    const bigBang = () => {
      const { w, h, x, y, z } = sd.current;
      sd.current.star.arr = Array.from({ length: quantity }, () => [
        Math.random() * w * 2 - x * 2,
        Math.random() * h * 2 - y * 2,
        Math.round(Math.random() * z),
        0, 0, 0, 0, true,
      ]);
    };

    const resize = () => {
      const { ctx, w: cw, h: ch } = sd.current;
      measure();
      if (!ctx) return;
      if (cw !== sd.current.w || ch !== sd.current.h) {
        const rw = sd.current.w / cw || 1;
        const rh = sd.current.h / ch || 1;
        ctx.canvas.width = sd.current.w;
        ctx.canvas.height = sd.current.h;
        sd.current.star.arr = sd.current.star.arr.map(s => {
          const n = [...s];
          n[0] *= rw; n[1] *= rh;
          return n;
        });
      }
    };

    const ratio = quantity / 2;

    const update = () => {
      const { x, y, z, w, h, star } = sd.current;
      star.arr = star.arr.map(s => {
        const n = [...s];
        n[7] = true;
        n[5] = n[3]; n[6] = n[4];
        n[2] -= speed;
        if (n[2] <= 0) { n[2] += z; n[7] = false; }
        if (n[2] > z)  { n[2] -= z; n[7] = false; }
        n[3] = x + (n[0] / n[2]) * ratio;
        n[4] = y + (n[1] / n[2]) * ratio;
        if (n[3] < 0 || n[3] > w || n[4] < 0 || n[4] > h) n[7] = false;
        return n;
      });
    };

    const draw = () => {
      const { ctx, w, h, star } = sd.current;
      // Semi-transparent fill creates trailing effect
      ctx.fillStyle = `rgba(4,4,8,${opacity})`;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = starColor;
      star.arr.forEach(s => {
        if (s[5] > 0 && s[5] < w && s[6] > 0 && s[6] < h && s[7]) {
          ctx.lineWidth = (1 - sd.current.star.colorRatio * s[2]) * 2;
          ctx.beginPath();
          ctx.moveTo(s[5], s[6]);
          ctx.lineTo(s[3], s[4]);
          ctx.stroke();
          ctx.closePath();
        }
      });
    };

    const animate = () => {
      resize();
      update();
      draw();
      rafRef.current = requestAnimationFrame(animate);
    };

    setup();
    bigBang();
    animate();

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, [starColor, bgColor, speed, quantity, opacity]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}

StarfieldCanvas.propTypes = {
  starColor: PropTypes.string,
  bgColor: PropTypes.string,
  speed: PropTypes.number,
  quantity: PropTypes.number,
  opacity: PropTypes.number,
};
