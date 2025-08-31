/**
 * PolygonEcho - Creates random polygons that echo outward in scale
 * Creates multiple copies of a random polygon at different scales and positions
 */
export class PolygonEcho {
  constructor() {
    this.element = null;
    this.animationId = null;
    this.polygons = [];
    this.maxPolygons = 8;
    this.baseSize = 100;
    this.scaleFactor = 1.2;
    this.rotationSpeed = 0.5;
    this.opacityDecay = 0.15;
    this.color = '#ff6b9d';
    this.isVisible = false;
    
    this.init();
  }

  init() {
    this.createElement();
    this.generateNewPolygon();
    this.animate();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'polygon-echo-container';
    this.element.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 100;
      overflow: hidden;
    `;
    
    document.body.appendChild(this.element);
  }

  generateNewPolygon() {
    // Clear existing polygons
    this.polygons = [];
    this.element.innerHTML = '';
    
    // Generate random polygon properties
    const sides = Math.floor(Math.random() * 4) + 3; // 3-6 sides
    const centerX = Math.random() * window.innerWidth;
    const centerY = Math.random() * window.innerHeight;
    const baseRotation = Math.random() * Math.PI * 2;
    
    // Create multiple scaled copies
    for (let i = 0; i < this.maxPolygons; i++) {
      const scale = Math.pow(this.scaleFactor, i);
      const size = this.baseSize * scale;
      const opacity = Math.max(0.1, 1 - (i * this.opacityDecay));
      const rotation = baseRotation + (i * 0.1);
      
      const polygon = this.createPolygon(
        centerX, 
        centerY, 
        size, 
        sides, 
        rotation, 
        opacity,
        i
      );
      
      this.polygons.push(polygon);
      this.element.appendChild(polygon);
    }
  }

  createPolygon(x, y, size, sides, rotation, opacity, index) {
    const polygon = document.createElement('div');
    polygon.className = 'polygon-echo';
    
    // Generate polygon points
    const points = this.generatePolygonPoints(size, sides, rotation);
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
    
    polygon.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size * 2}px;
      height: ${size * 2}px;
      transform: translate(-50%, -50%);
      opacity: ${opacity};
      transition: all 0.3s ease-out;
    `;
    
    // Create SVG polygon
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', size * 2);
    svg.setAttribute('height', size * 2);
    svg.setAttribute('viewBox', `0 0 ${size * 2} ${size * 2}`);
    
    const polygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygonElement.setAttribute('points', pointsString);
    polygonElement.setAttribute('fill', 'none');
    polygonElement.setAttribute('stroke', this.color);
    polygonElement.setAttribute('stroke-width', Math.max(1, 3 - index * 0.3));
    polygonElement.setAttribute('stroke-linejoin', 'round');
    
    svg.appendChild(polygonElement);
    polygon.appendChild(svg);
    
    return polygon;
  }

  generatePolygonPoints(size, sides, rotation) {
    const points = [];
    const angleStep = (Math.PI * 2) / sides;
    
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep + rotation;
      const x = size + Math.cos(angle) * size;
      const y = size + Math.sin(angle) * size;
      points.push({ x, y });
    }
    
    return points;
  }

  animate() {
    if (!this.isVisible) return;
    
    this.polygons.forEach((polygon, index) => {
      const scale = Math.pow(this.scaleFactor, index);
      const rotation = (Date.now() * this.rotationSpeed * 0.001) + (index * 0.2);
      
      polygon.style.transform = `translate(-50%, -50%) rotate(${rotation}rad) scale(${scale})`;
    });
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  setVisibility(visible) {
    this.isVisible = visible;
    
    if (visible) {
      this.element.style.display = 'block';
      if (!this.animationId) {
        this.animate();
      }
    } else {
      this.element.style.display = 'none';
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }

  updateColors(primaryColor, secondaryColor) {
    this.color = primaryColor || this.color;
    
    // Update all polygon strokes
    this.polygons.forEach(polygon => {
      const polygonElement = polygon.querySelector('polygon');
      if (polygonElement) {
        polygonElement.setAttribute('stroke', this.color);
      }
    });
  }

  randomize() {
    this.generateNewPolygon();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
