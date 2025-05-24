import { Component } from './Base.js';

/**
 * VectorGrid component that creates a moving grid pattern effect
 */
export class VectorGrid extends Component {
  /**
   * Create a new VectorGrid instance
   */
  constructor() {
    super();
    this.layer = createGridLayer();
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the grid is now visible
   */
  onVisibilityChange(visible) {
    if (visible) {
      this.layer.show();
    } else {
      this.layer.hide();
    }
  }

  /**
   * Set the opacity of the grid
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
 * Create a vector grid layer with animated grid points
 * @param {string} id Canvas element ID
 * @returns {Object} Grid control methods
 */
function createGridLayer(id = "vectorGrid") {
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
  const gridSpacing = 40;
  let offset = 0;
  let animationFrame;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0ff";
    ctx.lineWidth = 1;

    for (let y = offset % gridSpacing; y < canvas.height; y += gridSpacing) {
      for (let x = 0; x < canvas.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);
        ctx.stroke();
      }
    }

    offset += 1;
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