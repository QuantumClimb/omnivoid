import { Component } from './Base.js';
import { Agent } from '../utils/Agent.js';

/**
 * AgentSystem component that manages particle system with connecting lines
 */
export class AgentSystem extends Component {
  /**
   * Create a new AgentSystem instance
   */
  constructor() {
    super();
    this.canvas = document.getElementById('agents');
    this.ctx = this.canvas.getContext('2d');
    this.agents = [];
    this.agentCount = 60;
    this.connectDist = 100;
    this.setupCanvas();
    this.initAgents();
    this.animate();
  }

  /**
   * Set up the canvas and handle resizing
   */
  setupCanvas() {
    const resize = () => {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
  }

  /**
   * Initialize agents
   */
  initAgents() {
    this.agents = Array.from(
      { length: this.agentCount }, 
      () => new Agent(this.width, this.height)
    );
  }

  /**
   * Set the number of agents
   * @param {number} count Number of agents
   */
  setAgentCount(count) {
    this.agentCount = count;
    this.initAgents();
  }

  /**
   * Set the connection distance between agents
   * @param {number} dist Maximum distance for connection
   */
  setConnectDistance(dist) {
    this.connectDist = dist;
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
    this.ctx.strokeStyle = this.ctx.fillStyle = getComputedStyle(document.documentElement)
      .getPropertyValue('--fg-color');

    // Draw connections
    for (let i = 0; i < this.agents.length; i++) {
      for (let j = i + 1; j < this.agents.length; j++) {
        const a = this.agents[i], b = this.agents[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < this.connectDist) {
          this.ctx.globalAlpha = 1 - dist / this.connectDist;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    // Update and draw agents
    this.ctx.globalAlpha = 1;
    this.agents.forEach(a => {
      a.update(this.width, this.height);
      a.draw(this.ctx);
    });

    requestAnimationFrame(this.animate);
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the system is now visible
   */
  onVisibilityChange(visible) {
    this.canvas.style.display = visible ? 'block' : 'none';
  }
} 