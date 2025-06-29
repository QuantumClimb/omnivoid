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
 * Create an ASCII tunnel layer with animated SVG characters
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
  const svgPaths = ['O.svg','WORM.svg', 'I.svg', 'V.svg', 'D.svg' , 'L.svg', 'A.svg', 'B.svg', 'S.svg'];
  const numChars = 50;
  
  // Store loaded SVG images
  const svgImages = new Map();
  let imagesLoaded = 0;
  
  // Load all SVG files
  const loadSVGs = () => {
    return Promise.all(svgPaths.map(path => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          svgImages.set(path, img);
          resolve();
        };
        img.onerror = reject;
        img.src = `public/ascii/${path}`;
      });
    }));
  };

  const tunnel = Array.from({ length: numChars }, () => ({
    svg: svgPaths[Math.floor(Math.random() * svgPaths.length)],
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: Math.random() * canvas.width,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 2
  }));

  let animationFrame;
  let isReady = false;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!isReady) {
      // Show loading indicator
      ctx.fillStyle = "#0f0";
      ctx.font = "20px 'Orbitron', monospace";
      ctx.textAlign = "center";
      ctx.fillText("Loading OMNIVOID...", canvas.width / 2, canvas.height / 2);
      animationFrame = requestAnimationFrame(draw);
      return;
    }

    tunnel.forEach((symbol) => {
      symbol.z -= 8;
      symbol.rotation += symbol.rotationSpeed;
      
      if (symbol.z <= 0) {
        symbol.z = canvas.width;
        symbol.x = Math.random() * canvas.width;
        symbol.y = Math.random() * canvas.height;
        symbol.svg = svgPaths[Math.floor(Math.random() * svgPaths.length)];
        symbol.rotation = Math.random() * 360;
        symbol.rotationSpeed = (Math.random() - 0.5) * 2;
      }

      const distance = canvas.width / symbol.z;
      const sx = (symbol.x - canvas.width / 2) * distance + canvas.width / 2;
      const sy = (symbol.y - canvas.height / 2) * distance + canvas.height / 2;
      const size = 40 * distance;

      // Get the SVG image
      const svgImage = svgImages.get(symbol.svg);
      if (svgImage && size > 1) {
        ctx.save();
        
        // Set green tint for the Matrix effect
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'hue-rotate(90deg) brightness(1.2) contrast(1.5)';
        
        // Calculate opacity based on distance (fade out distant objects)
        const opacity = Math.min(1, distance * 2);
        ctx.globalAlpha = opacity;
        
        // Move to position and rotate
        ctx.translate(sx, sy);
        ctx.rotate((symbol.rotation * Math.PI) / 180);
        
        // Draw the SVG with size based on distance
        ctx.drawImage(
          svgImage,
          -size / 2,
          -size / 2,
          size,
          size
        );
        
        ctx.restore();
      }
    });

    animationFrame = requestAnimationFrame(draw);
  }

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Start loading SVGs and begin animation
  loadSVGs().then(() => {
    console.log('🎨 OMNIVOID SVGs loaded for ASCII tunnel');
    isReady = true;
  }).catch(error => {
    console.error('❌ Failed to load SVGs:', error);
    // Fallback to text characters if SVG loading fails
    isReady = true;
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