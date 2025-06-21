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
    
    // Create canvas if it doesn't exist
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'agents';
      document.body.appendChild(this.canvas);
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.agents = [];
    this.agentCount = 60;
    this.baseConnectDist = 100; // Base connection distance
    this.connectDist = 100; // Current connection distance (will be modulated by audio)
    this.audioManager = audioManager;
    
    // Audio visualization properties
    this.audioScale = 1.0;
    this.baseSize = 2;
    this.maxSize = 12; // Increased max size for more dramatic effect
    this.frequencyData = null;
    this.audioIntensity = 0; // Overall audio intensity
    this.bassIntensity = 0; // Bass-specific intensity
    
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
      console.log('🎵 AgentSystem: Setting up audio visualization...');
      console.log('🎵 AgentSystem: AudioManager instance:', this.audioManager);
      console.log('🎵 AgentSystem: Current visualizer callbacks count:', this.audioManager.visualizerCallbacks.size);
      
      // Add this agent system as a visualizer callback
      const visualizerCallback = (normalizedData) => {
        // Debug: Log that we're receiving audio data
        if (Math.random() < 0.01) { // Log 1% of the time to avoid spam
          console.log('🎵 AgentSystem RECEIVED audio data:', {
            bass: normalizedData.bass.toFixed(3),
            mid: normalizedData.mid.toFixed(3),
            treble: normalizedData.treble.toFixed(3),
            rawDataLength: normalizedData.raw ? normalizedData.raw.length : 'null',
            rawFirstValues: normalizedData.raw ? Array.from(normalizedData.raw.slice(0, 3)).map(v => v.toFixed(1)) : 'null'
          });
        }
        
        // Use the raw frequency data for per-agent scaling
        this.frequencyData = normalizedData.raw;
        
        // Calculate overall audio intensity with emphasis on bass and mid
        this.bassIntensity = normalizedData.bass;
        this.audioIntensity = (normalizedData.bass * 1.5 + normalizedData.mid + normalizedData.treble * 0.8) / 3.3;
        
        // Scale agents more dramatically: 1x to 6x based on audio
        this.audioScale = 1 + this.audioIntensity * 5;
        
        // Dynamic connection distance: increases significantly with loud music
        // Base distance + up to 150% more when audio is intense
        this.connectDist = this.baseConnectDist * (1 + this.audioIntensity * 1.5);
      };
      
      this.audioManager.addVisualizer(visualizerCallback);
      console.log('🎵 AgentSystem: Visualizer callback added. New count:', this.audioManager.visualizerCallbacks.size);
    } else {
      console.warn('⚠️ AgentSystem: No audio manager provided');
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
    this.baseConnectDist = dist;
    // Update current connect distance with current audio intensity
    this.connectDist = this.baseConnectDist * (1 + this.audioIntensity * 1.5);
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
    
    // More dramatic per-agent scaling: 0.5x to 4x based on frequency intensity
    // Combined with global audio scale for even more reactive effect
    const perAgentScale = 0.5 + normalizedValue * 3.5;
    const globalScale = 1 + this.audioIntensity * 2;
    
    return perAgentScale * globalScale;
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

    // Debug: Draw audio info overlay in top-left corner
    if (this.audioManager && this.audioManager.isPlaying) {
      this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--fg-color');
      this.ctx.font = '12px monospace';
      this.ctx.fillText(`Audio: ${this.audioIntensity.toFixed(2)} | Bass: ${this.bassIntensity.toFixed(2)}`, 10, 20);
      this.ctx.fillText(`Connections: ${this.connectDist.toFixed(0)} | Scale: ${this.audioScale.toFixed(1)}`, 10, 40);
      this.ctx.fillText(`Playing: ${this.audioManager.isPlaying ? 'YES' : 'NO'}`, 10, 60);
    }

    // Draw connections with audio-reactive properties
    for (let i = 0; i < this.agents.length; i++) {
      for (let j = i + 1; j < this.agents.length; j++) {
        const a = this.agents[i], b = this.agents[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < this.connectDist) {
          // Base opacity based on distance
          let opacity = 1 - dist / this.connectDist;
          
          // Enhance opacity with audio intensity - connections get brighter with loud music
          opacity *= (0.3 + this.audioIntensity * 0.7);
          
          // Bass boost - make connections thicker and more visible during bass hits
          const lineWidth = 1 + this.bassIntensity * 2;
          
          this.ctx.globalAlpha = Math.min(1, opacity);
          this.ctx.lineWidth = lineWidth;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    // Update and draw agents with enhanced audio scaling
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = 1; // Reset line width for agent drawing
    
    this.agents.forEach((agent, index) => {
      // Make agents move faster when music is intense
      const speedMultiplier = 1 + this.audioIntensity * 0.5;
      agent.update(this.width, this.height, speedMultiplier);
      
      // Get audio-based scale for this agent
      const audioScale = this.getAgentAudioScale(index);
      const size = Math.max(0.5, this.baseSize * audioScale);
      
      // Add subtle glow effect during intense audio
      if (this.audioIntensity > 0.5) {
        this.ctx.shadowBlur = 10 * this.audioIntensity;
        this.ctx.shadowColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--fg-color');
      } else {
        this.ctx.shadowBlur = 0;
      }
      
      agent.draw(this.ctx, size);
    });
    
    // Reset shadow for next frame
    this.ctx.shadowBlur = 0;

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