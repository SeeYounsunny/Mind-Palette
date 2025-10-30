import React, { useEffect, useRef, useState } from 'react';

// Rectangular gradient picker using canvas. Emits HEX on click.
const GradientColorPicker = ({ value, onChange, height = 140 }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [cursorPos, setCursorPos] = useState(null); // {x, y}

  const drawGradient = (ctx, width, height) => {
    // Horizontal hue gradient
    const hueGradient = ctx.createLinearGradient(0, 0, width, 0);
    // Rainbow stops similar to Figma preview
    hueGradient.addColorStop(0.0, '#ff0000');
    hueGradient.addColorStop(0.17, '#ffff00');
    hueGradient.addColorStop(0.33, '#00ff00');
    hueGradient.addColorStop(0.5, '#00ffff');
    hueGradient.addColorStop(0.66, '#0000ff');
    hueGradient.addColorStop(0.83, '#ff00ff');
    hueGradient.addColorStop(1.0, '#ff0000');
    ctx.fillStyle = hueGradient;
    ctx.fillRect(0, 0, width, height);

    // Vertical value overlay: top bright, bottom dark
    const valueGradient = ctx.createLinearGradient(0, 0, 0, height);
    valueGradient.addColorStop(0, 'rgba(255,255,255,0.25)');
    valueGradient.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = valueGradient;
    ctx.fillRect(0, 0, width, height);

    // Rounded-corner mask via clipping is handled by CSS on wrapper
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    drawGradient(ctx, rect.width, height);
  }, [height]);

  const pickColor = (evt) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.min(Math.max(evt.clientX - rect.left, 0), rect.width - 1);
    const y = Math.min(Math.max(evt.clientY - rect.top, 0), height - 1);
    setCursorPos({ x, y });

    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext('2d');
    const data = ctx.getImageData(Math.floor(x * dpr), Math.floor(y * dpr), 1, 1).data;
    const hex = `#${[data[0], data[1], data[2]]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')}`.toUpperCase();
    onChange?.(hex);
  };

  return (
    <div className="gradient-picker-wrapper" ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        className="gradient-picker-canvas"
        style={{ width: '100%', height }}
        onMouseDown={pickColor}
        onMouseMove={(e) => {
          if (e.buttons === 1) pickColor(e);
          else {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;
            const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width - 1);
            const y = Math.min(Math.max(e.clientY - rect.top, 0), height - 1);
            setCursorPos({ x, y });
          }
        }}
      />
      {cursorPos && (
        <div
          className="gradient-crosshair"
          style={{ left: cursorPos.x, top: cursorPos.y }}
        >
          <div className="crosshair-h" />
          <div className="crosshair-v" />
        </div>
      )}
      {value ? (
        <div className="gradient-picker-indicator" style={{ backgroundColor: value }} />
      ) : null}
    </div>
  );
};

export default GradientColorPicker;


