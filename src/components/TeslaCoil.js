import { Component } from './Base.js';

/**
 * TeslaCoil component - Energy arc and lightning effect overlay
 * Creates concentric waves, circuit lines, and lightning bolts
 */
export class TeslaCoil extends Component {
  /**
   * Create a new TeslaCoil instance
   */
  constructor() {
    super();
    this.canvas = null;
    this.ctx = null;
    this.isVisible = true;
    
    this.setupCanvas();
    this.initializeEffects();
    this.animate();
    
    console.log('⚡ TeslaCoil: Component initialized');
  }

  /**
   * Set up the canvas element
   */
  setupCanvas() {
    // Try to find existing tesla canvas
    this.canvas = document.getElementById('tesla-coil');
    
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'tesla-coil';
      this.canvas.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      `;
      document.body.appendChild(this.canvas);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Handle window resize
   */
  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * Initialize effect arrays
   */
  initializeEffects() {
    this.concentricWaves = [];
    this.circuitLines = [];
    this.lightningBolts = [];
    
    // Create concentric waves
    const waveCount = this.isMobile ? 2 : 4;
    for (let i = 0; i < waveCount; i++) {
      const wave = new ConcentricWave();
      wave.radius = (i / waveCount) * wave.maxRadius;
      this.concentricWaves.push(wave);
    }
    
    // Create circuit lines
    const lineCount = this.isMobile ? 4 : 8;
    for (let i = 0; i < lineCount; i++) {
      this.circuitLines.push(new CircuitLine());
    }
    
    // Create lightning bolts (reduced for performance)
    const boltCount = this.isMobile ? 2 : 4;
    for (let i = 0; i < boltCount; i++) {
      this.lightningBolts.push(new LightningBolt());
    }
  }

  /**
   * Draw coil glow at center
   */
  drawCoilGlow() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    const gradient = this.ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 100);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.3, 'rgba(255, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, 100, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Animation loop
   */
  animate = () => {
    if (!this.isVisible) {
      requestAnimationFrame(this.animate);
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // Update and draw circuit lines
    this.circuitLines.forEach(line => {
      line.update();
      line.draw(this.ctx, centerX, centerY, this.time || 0);
    });
    
    // Update and draw concentric waves
    this.concentricWaves.forEach(wave => {
      wave.update();
      wave.draw(this.ctx, centerX, centerY);
    });
    
    // Draw coil glow
    this.drawCoilGlow();
    
    // Update and draw lightning bolts
    this.lightningBolts.forEach(bolt => {
      bolt.update(centerX, centerY);
      bolt.draw(this.ctx, centerX, centerY);
    });
    
    this.time = (this.time || 0) + 1;
    
    requestAnimationFrame(this.animate);
  }

  /**
   * Toggle visibility
   */
  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.canvas.style.display = this.isVisible ? 'block' : 'none';
    return this.isVisible;
  }

  /**
   * Set visibility
   */
  setVisibility(visible) {
    this.isVisible = visible;
    this.canvas.style.display = visible ? 'block' : 'none';
  }

  /**
   * Set opacity
   */
  setOpacity(value) {
    this.canvas.style.opacity = Math.max(0, Math.min(1, value));
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}

/**
 * ConcentricWave class - Expanding circular waves
 */
class ConcentricWave {
  constructor() {
    this.radius = 0;
    this.maxRadius = 400;
    this.speed = 2 + Math.random() * 2;
    this.color = Math.random() > 0.5 ? '#FFFFFF' : '#FF0000';
  }

  update() {
    this.radius += this.speed;
    if (this.radius > this.maxRadius) {
      this.radius = 0;
    }
  }

  draw(ctx, centerX, centerY) {
    const alpha = 1 - (this.radius / this.maxRadius);
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = alpha * 0.4;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}

/**
 * CircuitLine class - Branching circuit-like paths with nodes
 */
class CircuitLine {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 200 + Math.random() * 300;
    this.x = Math.cos(this.angle) * this.distance;
    this.y = Math.sin(this.angle) * this.distance;
    this.length = 30 + Math.random() * 80;
    this.direction = Math.random() * Math.PI * 2;
    this.nodes = [];
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.lifetime = 0;
    this.maxLifetime = 60 + Math.floor(Math.random() * 40);
    this.generateNodes();
  }

  generateNodes() {
    let currentX = this.x;
    let currentY = this.y;
    const segments = 3 + Math.floor(Math.random() * 5);

    for (let i = 0; i < segments; i++) {
      const segmentLength = 20 + Math.random() * 40;
      const angle = this.direction + (Math.random() - 0.5) * Math.PI / 4;
      const nextX = currentX + Math.cos(angle) * segmentLength;
      const nextY = currentY + Math.sin(angle) * segmentLength;

      this.nodes.push({
        x1: currentX,
        y1: currentY,
        x2: nextX,
        y2: nextY,
        hasNode: Math.random() > 0.6
      });

      currentX = nextX;
      currentY = nextY;
      this.direction = angle;
    }
  }
  
  update() {
    this.lifetime++;
    if (this.lifetime >= this.maxLifetime) {
      this.reset();
    }
  }

  draw(ctx, centerX, centerY, time) {
    // Fade in and fade out
    const fadeInDuration = 10;
    const fadeOutDuration = 15;
    const visibleDuration = this.maxLifetime - fadeInDuration - fadeOutDuration;
    
    let alpha = 1;
    if (this.lifetime < fadeInDuration) {
      alpha = this.lifetime / fadeInDuration;
    } else if (this.lifetime > fadeInDuration + visibleDuration) {
      alpha = 1 - ((this.lifetime - fadeInDuration - visibleDuration) / fadeOutDuration);
    }
    
    const pulse = Math.sin(time * 0.003 + this.pulseOffset) * 0.5 + 0.5;

    this.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.moveTo(centerX + node.x1, centerY + node.y1);
      ctx.lineTo(centerX + node.x2, centerY + node.y2);
      ctx.strokeStyle = '#FF0000';
      ctx.globalAlpha = alpha * (0.3 + pulse * 0.3);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (node.hasNode) {
        ctx.beginPath();
        ctx.arc(centerX + node.x2, centerY + node.y2, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = alpha * (0.6 + pulse * 0.4);
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FFFFFF';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    ctx.globalAlpha = 1;
  }
}

/**
 * LightningBolt class - Smooth wave-like energy bolts
 */
class LightningBolt {
  constructor() {
    this.reset();
  }

  reset() {
    this.angle = Math.random() * Math.PI * 2;
    this.distance = 150 + Math.random() * 250;
    this.endX = Math.cos(this.angle) * this.distance;
    this.endY = Math.sin(this.angle) * this.distance;
    this.segments = [];
    this.lifetime = 0;
    this.maxLifetime = 12 + Math.floor(Math.random() * 20);
    this.color = Math.random() > 0.3 ? '#FFFFFF' : '#FF0000';
    this.thickness = 2 + Math.random() * 3;
    this.waveFrequency = 2 + Math.random() * 4;
    this.waveAmplitude = 15 + Math.random() * 25;
    this.generateSegments();
  }

  generateSegments() {
    this.segments = [];
    const steps = 40 + Math.floor(Math.random() * 40);
    const baseAngle = Math.atan2(this.endY, this.endX);

    for (let i = 0; i < steps - 1; i++) {
      const progress1 = i / steps;
      const progress2 = (i + 1) / steps;
      
      // Create smooth wave motion along the bolt path
      const x1 = this.endX * progress1;
      const y1 = this.endY * progress1;
      
      const x2 = this.endX * progress2;
      const y2 = this.endY * progress2;
      
      // Add subtle wave perpendicular to bolt direction
      const waveOffset1 = Math.sin(progress1 * this.waveFrequency * Math.PI) * this.waveAmplitude;
      const waveOffset2 = Math.sin(progress2 * this.waveFrequency * Math.PI) * this.waveAmplitude;
      
      const perpX = -Math.sin(baseAngle);
      const perpY = Math.cos(baseAngle);
      
      this.segments.push({
        x1: x1 + perpX * waveOffset1,
        y1: y1 + perpY * waveOffset1,
        x2: x2 + perpX * waveOffset2,
        y2: y2 + perpY * waveOffset2,
        progress: progress2
      });
    }
  }

  update(centerX, centerY) {
    this.lifetime++;
    if (this.lifetime >= this.maxLifetime) {
      this.reset();
    }
  }

  draw(ctx, centerX, centerY) {
    const alpha = 1 - (this.lifetime / this.maxLifetime);
    const fadeInDuration = 3;
    const actualAlpha = this.lifetime < fadeInDuration ? 
      (this.lifetime / fadeInDuration) * alpha : alpha;

    this.segments.forEach((segment, index) => {
      ctx.beginPath();
      ctx.moveTo(centerX + segment.x1, centerY + segment.y1);
      ctx.lineTo(centerX + segment.x2, centerY + segment.y2);

      // Brighter core glow
      ctx.shadowBlur = this.thickness * 12;
      ctx.shadowColor = this.color;
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = actualAlpha * 0.8;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }
}
