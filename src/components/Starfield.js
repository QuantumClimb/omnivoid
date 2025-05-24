import { Component } from './Base.js';

/**
 * Starfield component that creates a dynamic star field effect
 */
export class Starfield extends Component {
  /**
   * Create a new Starfield instance
   */
  constructor() {
    super();
    this.layer = createStarfieldLayer();
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the starfield is now visible
   */
  onVisibilityChange(visible) {
    if (visible) {
      this.layer.show();
    } else {
      this.layer.hide();
    }
  }

  /**
   * Set the opacity of the starfield
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
 * Create a starfield layer with animated stars
 * @param {string} id Canvas element ID
 * @returns {Object} Starfield control methods
 */
function createStarfieldLayer(id = "starfield") {
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
  const numStars = 100;
  const stars = Array.from({ length: numStars }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width,
  }));

  let animationFrame;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    stars.forEach((star) => {
      star.z -= 4;
      if (star.z <= 0) star.z = canvas.width;

      const sx = (star.x - canvas.width / 2) * (canvas.width / star.z) + canvas.width / 2;
      const sy = (star.y - canvas.height / 2) * (canvas.height / star.z) + canvas.height / 2;
      const size = 1 * (canvas.width / star.z);

      ctx.beginPath();
      ctx.arc(sx, sy, size, 0, 2 * Math.PI);
      ctx.fill();
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