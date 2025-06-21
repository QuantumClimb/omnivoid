import { Component } from './Base.js';

/**
 * Cylinder3D component that creates a rotating 3D wireframe cylinder
 */
export class Cylinder3D extends Component {
  /**
   * Create a new Cylinder3D instance
   */
  constructor() {
    super();
    this.layer = createCylinderLayer();
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the cylinder is now visible
   */
  onVisibilityChange(visible) {
    if (visible) {
      this.layer.show();
    } else {
      this.layer.hide();
    }
  }

  /**
   * Set the opacity of the cylinder
   * @param {number} value Opacity value between 0 and 1
   */
  setOpacity(value) {
    this.layer.setOpacity(value);
  }

  /**
   * Set the rotation speed of the cylinder
   * @param {number} speed Rotation speed multiplier
   */
  setRotationSpeed(speed) {
    this.layer.setRotationSpeed(speed);
  }

  /**
   * Set the cylinder radius
   * @param {number} radius Cylinder radius in pixels
   */
  setRadius(radius) {
    this.layer.setRadius(radius);
  }

  /**
   * Set the cylinder height
   * @param {number} height Cylinder height in pixels
   */
  setHeight(height) {
    this.layer.setHeight(height);
  }

  /**
   * Clean up resources when component is destroyed
   */
  destroy() {
    this.layer.destroy();
  }
}

/**
 * Create a 3D cylinder layer with wireframe rendering
 * @param {string} id Canvas element ID
 * @returns {Object} Cylinder control methods
 */
function createCylinderLayer(id = "cylinder3D") {
  const canvas = document.createElement("canvas");
  canvas.id = id;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.zIndex = 2; // In front of grid (grid has z-index 0-1)
  canvas.style.pointerEvents = "none";
  canvas.style.opacity = 0.8;

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  
  // Cylinder parameters
  let radius = 100;
  let height = 200;
  let rotationY = 0;
  let rotationSpeed = 0.02;
  
  // Number of segments for the cylinder
  const segments = 24;
  const heightSegments = 8;
  
  let animationFrame;

  /**
   * Project 3D point to 2D screen coordinates
   * @param {number} x 3D x coordinate
   * @param {number} y 3D y coordinate
   * @param {number} z 3D z coordinate
   * @returns {Object} 2D screen coordinates
   */
  function project3D(x, y, z) {
    const distance = 400; // Distance from camera
    const scale = distance / (distance + z);
    
    return {
      x: x * scale + canvas.width / 2,
      y: y * scale + canvas.height / 2,
      scale: scale
    };
  }

  /**
   * Rotate point around Y axis
   * @param {number} x X coordinate
   * @param {number} y Y coordinate  
   * @param {number} z Z coordinate
   * @param {number} angle Rotation angle in radians
   * @returns {Object} Rotated coordinates
   */
  function rotateY(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: x * cos + z * sin,
      y: y,
      z: -x * sin + z * cos
    };
  }

  /**
   * Generate cylinder vertices
   * @returns {Array} Array of 3D vertices
   */
  function generateVertices() {
    const vertices = [];
    
    // Generate top and bottom circles
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      // Top circle
      vertices.push({ x, y: -height / 2, z });
      // Bottom circle
      vertices.push({ x, y: height / 2, z });
    }
    
    return vertices;
  }

  /**
   * Draw the 3D cylinder
   */
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const vertices = generateVertices();
    const projectedVertices = [];
    
    // Transform and project all vertices
    for (const vertex of vertices) {
      const rotated = rotateY(vertex.x, vertex.y, vertex.z, rotationY);
      const projected = project3D(rotated.x, rotated.y, rotated.z);
      projectedVertices.push(projected);
    }
    
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.8;
    
    // Draw vertical lines connecting top and bottom
    for (let i = 0; i < segments; i++) {
      const topIndex = i * 2;
      const bottomIndex = i * 2 + 1;
      
      const top = projectedVertices[topIndex];
      const bottom = projectedVertices[bottomIndex];
      
      if (top && bottom) {
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(bottom.x, bottom.y);
        ctx.stroke();
      }
    }
    
    // Draw top circle
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const index = i * 2;
      const vertex = projectedVertices[index];
      
      if (vertex) {
        if (i === 0) {
          ctx.moveTo(vertex.x, vertex.y);
        } else {
          ctx.lineTo(vertex.x, vertex.y);
        }
      }
    }
    ctx.stroke();
    
    // Draw bottom circle
    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const index = i * 2 + 1;
      const vertex = projectedVertices[index];
      
      if (vertex) {
        if (i === 0) {
          ctx.moveTo(vertex.x, vertex.y);
        } else {
          ctx.lineTo(vertex.x, vertex.y);
        }
      }
    }
    ctx.stroke();
    
    // Draw horizontal rings
    for (let ring = 1; ring < heightSegments; ring++) {
      const ringY = -height / 2 + (height / heightSegments) * ring;
      
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        const rotated = rotateY(x, ringY, z, rotationY);
        const projected = project3D(rotated.x, rotated.y, rotated.z);
        
        if (i === 0) {
          ctx.moveTo(projected.x, projected.y);
        } else {
          ctx.lineTo(projected.x, projected.y);
        }
      }
      ctx.stroke();
    }
    
    // Update rotation
    rotationY += rotationSpeed;
    
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
    show: () => (canvas.style.opacity = 0.8),
    setRotationSpeed: (speed) => {
      rotationSpeed = speed * 0.02;
    },
    setRadius: (newRadius) => {
      radius = newRadius;
    },
    setHeight: (newHeight) => {
      height = newHeight;
    }
  };
} 