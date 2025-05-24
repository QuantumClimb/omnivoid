import { Component } from './Base.js';

/**
 * ASCIITunnel component that creates a matrix-like tunnel effect with ASCII characters
 */
export class ASCIITunnel extends Component {
  /**
   * Create a new ASCIITunnel instance
   */
  constructor() {
    super();
    this.layer = createASCIITunnelLayer();
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the tunnel is now visible
   */
  onVisibilityChange(visible) {
    if (visible) {
      this.layer.show();
    } else {
      this.layer.hide();
    }
  }

  /**
   * Set the opacity of the tunnel
   * @param {number} value Opacity value between 0 and 1
   */
  setOpacity(value) {
    this.layer.setOpacity(value);
  }

  /**
   * Clean up resources when component is destroyed
   */
  destroy() {
    this.layer.destroy();
  }
}

/**
 * Create an ASCII tunnel layer with animated characters
 * @param {string} id Canvas element ID
 * @returns {Object} Tunnel control methods
 */
function createASCIITunnelLayer(id = "asciiTunnel") {
  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = 1;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const characters = ['O', 'M', 'N', 'I', 'V','D'];
  const numChars = 80;
  const tunnel = Array.from({ length: numChars }, () => ({
    char: characters[Math.floor(Math.random() * characters.length)],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width,
  }));

  let animationFrame;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    tunnel.forEach((symbol) => {
      symbol.z -= 10;
      if (symbol.z <= 0) {
        symbol.z = canvas.width;
        symbol.x = Math.random() * canvas.width;
        symbol.y = Math.random() * canvas.height;
        symbol.char = characters[Math.floor(Math.random() * characters.length)];
      }

      const sx = (symbol.x - canvas.width / 2) * (canvas.width / symbol.z) + canvas.width / 2;
      const sy = (symbol.y - canvas.height / 2) * (canvas.height / symbol.z) + canvas.height / 2;
      const size = 24 * (canvas.width / symbol.z);

      ctx.font = `bold ${size}px monospace`;
      ctx.fillText(symbol.char, sx, sy);
    });

    animationFrame = requestAnimationFrame(draw);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  draw();

  return {
    canvas,
    destroy: () => {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    },
    setOpacity: (value) => {
      canvas.style.opacity = value;
    },
    hide: () => (canvas.style.opacity = 0),
    show: () => (canvas.style.opacity = 1),
  };
} 