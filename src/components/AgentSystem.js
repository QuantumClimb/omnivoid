import { Component } from './Base.js';
import { Agent } from '../utils/Agent.js';

/**
 * AgentSystem component that manages particle system with connecting lines
 */
export class AgentSystem extends Component {
  /**
   * Create a new AgentSystem instance
   * @param {AudioManager} audioManager Optional audio manager for visualization
   */
  constructor(audioManager = null) {
    super();
    this.canvas = document.getElementById('agents');
    this.ctx = this.canvas.getContext('2d');
    this.agents = [];
    this.agentCount = 60;
    this.connectDist = 100;
    this.audioManager = audioManager;
    
    // Audio visualization properties
    this.audioScale = 1.0;
    this.baseSize = 2;
    this.maxSize = 8;
    this.frequencyData = null;
    
    this.setupCanvas();
    this.initAgents();
    this.setupAudioVisualization();
    this.animate();
  }

  /**
   * Set up audio visualization if audio manager is available
   */
  setupAudioVisualization() {
    if (this.audioManager) {
      // Add this agent system as a visualizer callback
      this.audioManager.addVisualizer((normalizedData) => {
        // Use the raw frequency data for per-agent scaling
        this.frequencyData = normalizedData.raw;
        // Calculate overall audio scale based on combined frequency ranges
        const audioIntensity = (normalizedData.bass + normalizedData.mid + normalizedData.treble) / 3;
        this.audioScale = 1 + audioIntensity * 3; // Scale from 1x to 4x based on audio
      });
    }
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
      (_, index) => new Agent(this.width, this.height, index)
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
   * Get the scale factor for an agent based on audio frequency
   * @param {number} agentIndex Index of the agent
   * @returns {number} Scale factor
   */
  getAgentAudioScale(agentIndex) {
    if (!this.frequencyData || this.frequencyData.length === 0) {
      return 1.0;
    }
    
    // Map agent index to frequency bin
    const frequencyIndex = Math.floor((agentIndex / this.agentCount) * this.frequencyData.length);
    const frequencyValue = this.frequencyData[frequencyIndex];
    
    // Convert from dB to linear scale and normalize (frequency data is in dB, typically -140 to 0)
    const normalizedValue = Math.max(0, Math.min(1, (frequencyValue + 140) / 140));
    
    // Scale between 1x and 3x based on frequency intensity
    return 1 + normalizedValue * 2;
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

    // Update and draw agents with audio scaling
    this.ctx.globalAlpha = 1;
    this.agents.forEach((agent, index) => {
      agent.update(this.width, this.height);
      
      // Get audio-based scale for this agent
      const audioScale = this.getAgentAudioScale(index);
      const size = this.baseSize * audioScale;
      
      agent.draw(this.ctx, size);
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