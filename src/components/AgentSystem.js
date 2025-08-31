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
    
    // Store default values for restoration
    this.defaultAgentCount = 60;
    this.defaultConnectDist = 100;
    
    // Audio visualization properties
    this.audioScale = 1.0;
    this.baseSize = 2;
    this.maxSize = 12; // Increased max size for more dramatic effect
    this.frequencyData = null;
    this.audioIntensity = 0; // Overall audio intensity
    this.bassIntensity = 0; // Bass-specific intensity
    
    // Color lookup table for audio-reactive colors
    this.colorLUT = this.createColorLookupTable();
    this.defaultColor = getComputedStyle(document.documentElement).getPropertyValue('--fg-color').trim();
    
    // Store default colors for restoration
    this.defaultColors = {
      agent: this.defaultColor,
      connection: this.defaultColor,
      accent: '#99ccff' // OMNIVOID blue
    };
    
    // Current theme colors
    this.currentThemeColors = { ...this.defaultColors };
    
    this.setupCanvas();
    this.initAgents();
    this.setupAudioVisualization();
    this.animate();
  }

  /**
   * Create a color lookup table that maps frequency ranges to colors
   * @returns {Array} Array of color objects with RGB values and frequency ranges
   */
  createColorLookupTable() {
    return [
      // Deep bass - Deep purple/violet
      { r: 138, g: 43, b: 226, freqMin: 0, freqMax: 0.1, name: 'Deep Bass' },
      // Bass - Blue
      { r: 0, g: 100, b: 255, freqMin: 0.1, freqMax: 0.2, name: 'Bass' },
      // Low-mid - Cyan
      { r: 0, g: 255, b: 255, freqMin: 0.2, freqMax: 0.35, name: 'Low-Mid' },
      // Mid - Green
      { r: 0, g: 255, b: 100, freqMin: 0.35, freqMax: 0.5, name: 'Mid' },
      // High-mid - Yellow
      { r: 255, g: 255, b: 0, freqMin: 0.5, freqMax: 0.65, name: 'High-Mid' },
      // High - Orange
      { r: 255, g: 165, b: 0, freqMin: 0.65, freqMax: 0.8, name: 'High' },
      // Treble - Red
      { r: 255, g: 50, b: 50, freqMin: 0.8, freqMax: 0.9, name: 'Treble' },
      // Ultra-high - Pink/Magenta
      { r: 255, g: 20, b: 147, freqMin: 0.9, freqMax: 1.0, name: 'Ultra-High' }
    ];
  }

  /**
   * Update colors with new random theme palette
   * @param {Object} colorPalette Color palette object from ThemeManager
   */
  updateColors(colorPalette) {
    this.currentThemeColors = {
      agent: colorPalette.accent1 || colorPalette.foreground,
      connection: colorPalette.accent2 || colorPalette.track,
      accent: colorPalette.accent3 || colorPalette.thumb
    };
    
    // Update the color lookup table with theme colors
    this.updateColorLookupTable(colorPalette);
  }

  /**
   * Update the color lookup table with theme colors
   * @param {Object} colorPalette Color palette object
   */
  updateColorLookupTable(colorPalette) {
    // Create new color variations based on the theme palette
    const themeColors = [
      colorPalette.accent1,
      colorPalette.accent2,
      colorPalette.accent3,
      colorPalette.thumb,
      colorPalette.track,
      colorPalette.foreground,
      colorPalette.background,
      colorPalette.panel
    ].filter(Boolean); // Remove undefined colors
    
    if (themeColors.length === 0) return;
    
    // Update the color lookup table with theme-based colors
    this.colorLUT = this.colorLUT.map((colorObj, index) => {
      const themeColor = themeColors[index % themeColors.length];
      const rgb = this.hslToRgb(themeColor);
      
      return {
        ...colorObj,
        r: rgb.r,
        g: rgb.g,
        b: rgb.b
      };
    });
  }

  /**
   * Convert HSL color to RGB
   * @param {string} hslColor HSL color string
   * @returns {Object} RGB object
   */
  hslToRgb(hslColor) {
    const hslMatch = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!hslMatch) return { r: 255, g: 255, b: 255 }; // Default white
    
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Reset colors to default theme
   */
  resetColors() {
    this.currentThemeColors = { ...this.defaultColors };
    this.colorLUT = this.createColorLookupTable();
  }

  /**
   * Get color for an agent based on its frequency data
   * @param {number} agentIndex Index of the agent
   * @param {number} intensity Audio intensity multiplier (0-1)
   * @returns {string} CSS color string
   */
  getAgentColor(agentIndex, intensity = 1) {
    if (!this.frequencyData || this.frequencyData.length === 0) {
      return this.currentThemeColors.agent;
    }
    
    // Map agent index to frequency position (0-1)
    const freqPosition = agentIndex / this.agentCount;
    
    // Get the frequency bin for this agent
    const frequencyIndex = Math.floor(freqPosition * this.frequencyData.length);
    const frequencyValue = this.frequencyData[frequencyIndex];
    
    // Convert from dB to linear scale (frequency data is typically -140 to 0 dB)
    const normalizedFreq = Math.max(0, Math.min(1, (frequencyValue + 140) / 140));
    
    // Find the appropriate color from the lookup table
    let selectedColor = this.colorLUT[0]; // Default to first color
    for (const color of this.colorLUT) {
      if (freqPosition >= color.freqMin && freqPosition < color.freqMax) {
        selectedColor = color;
        break;
      }
    }
    
    // Apply intensity-based brightness and saturation
    const brightness = 0.3 + (normalizedFreq * intensity * 0.7); // 30% to 100% brightness
    const saturation = 0.5 + (normalizedFreq * 0.5); // 50% to 100% saturation
    
    // Calculate final RGB values with brightness applied
    const r = Math.floor(selectedColor.r * brightness);
    const g = Math.floor(selectedColor.g * brightness);
    const b = Math.floor(selectedColor.b * brightness);
    
    // Add some alpha based on audio intensity for subtle transparency effects
    const alpha = 0.7 + (this.audioIntensity * 0.3);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Get connection color based on the two connected agents
   * @param {number} agentIndex1 First agent index
   * @param {number} agentIndex2 Second agent index
   * @returns {string} CSS color string
   */
  getConnectionColor(agentIndex1, agentIndex2) {
    if (!this.frequencyData || this.frequencyData.length === 0) {
      return this.currentThemeColors.connection;
    }
    
    // Blend colors of the two connected agents
    const color1 = this.getAgentColor(agentIndex1, this.audioIntensity);
    const color2 = this.getAgentColor(agentIndex2, this.audioIntensity);
    
    // For simplicity, use the color of the agent with higher frequency response
    const freq1Position = agentIndex1 / this.agentCount;
    const freq2Position = agentIndex2 / this.agentCount;
    
    const freq1Index = Math.floor(freq1Position * this.frequencyData.length);
    const freq2Index = Math.floor(freq2Position * this.frequencyData.length);
    
    const freq1Value = this.frequencyData[freq1Index];
    const freq2Value = this.frequencyData[freq2Index];
    
    // Use the color of the agent with higher frequency response
    return freq1Value > freq2Value ? color1 : color2;
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

    // Debug: Draw audio info overlay in top-left corner
    if (this.audioManager && this.audioManager.isPlaying) {
      this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--fg-color');
      this.ctx.font = '12px monospace';
      this.ctx.fillText(`Audio: ${this.audioIntensity.toFixed(2)} | Bass: ${this.bassIntensity.toFixed(2)}`, 10, 20);
      this.ctx.fillText(`Connections: ${this.connectDist.toFixed(0)} | Scale: ${this.audioScale.toFixed(1)}`, 10, 40);
      this.ctx.fillText(`Playing: ${this.audioManager.isPlaying ? 'YES' : 'NO'}`, 10, 60);
      this.ctx.fillText(`Colors: ${this.frequencyData ? 'ACTIVE' : 'INACTIVE'}`, 10, 80);
    }

    // Draw connections with audio-reactive colors
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
          
          // Get dynamic color for the connection
          const connectionColor = this.getConnectionColor(i, j);
          
          this.ctx.globalAlpha = Math.min(1, opacity);
          this.ctx.lineWidth = lineWidth;
          this.ctx.strokeStyle = connectionColor;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    // Update and draw agents with enhanced audio scaling and dynamic colors
    this.ctx.globalAlpha = 1;
    this.ctx.lineWidth = 1; // Reset line width for agent drawing
    
    this.agents.forEach((agent, index) => {
      // Make agents move faster when music is intense
      const speedMultiplier = 1 + this.audioIntensity * 0.5;
      agent.update(this.width, this.height, speedMultiplier);
      
      // Get audio-based scale for this agent
      const audioScale = this.getAgentAudioScale(index);
      const size = Math.max(0.5, this.baseSize * audioScale);
      
      // Get dynamic color for this agent
      const agentColor = this.getAgentColor(index, this.audioIntensity);
      
      // Add subtle glow effect during intense audio
      if (this.audioIntensity > 0.5) {
        this.ctx.shadowBlur = 10 * this.audioIntensity;
        this.ctx.shadowColor = agentColor;
      } else {
        this.ctx.shadowBlur = 0;
      }
      
      // Set the agent color
      this.ctx.fillStyle = agentColor;
      this.ctx.strokeStyle = agentColor;
      
      agent.draw(this.ctx, size);
    });
    
    // Reset shadow and color for next frame
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

  /**
   * Set the number of agents
   * @param {number} count New agent count
   */
  setAgentCount(count) {
    console.log(`🎯 AgentSystem: Setting agent count to ${count}`);
    this.agentCount = Math.max(20, Math.min(120, count));
    
    // Recreate agents with new count
    this.agents = [];
    this.initAgents();
  }

  /**
   * Set the connection distance
   * @param {number} distance New connection distance
   */
  setConnectionDistance(distance) {
    console.log(`🔗 AgentSystem: Setting connection distance to ${distance}`);
    this.connectDist = Math.max(50, Math.min(200, distance));
  }

  /**
   * Get current agent count
   * @returns {number} Current agent count
   */
  getAgentCount() {
    return this.agentCount;
  }

  /**
   * Get current connection distance
   * @returns {number} Current connection distance
   */
  getConnectionDistance() {
    return this.connectDist;
  }

  /**
   * Randomize agent count and connection distance for variety
   */
  randomizeStructure() {
    // Random agent count between 30 and 100
    const newAgentCount = Math.floor(Math.random() * 71) + 30;
    
    // Random connection distance between 60 and 180
    const newConnectDist = Math.floor(Math.random() * 121) + 60;
    
    console.log(`🎲 AgentSystem: Randomizing structure - Agents: ${newAgentCount}, Connect: ${newConnectDist}`);
    
    this.setAgentCount(newAgentCount);
    this.setConnectionDistance(newConnectDist);
  }

  /**
   * Reset agent count and connection distance to defaults
   */
  resetStructure() {
    console.log(`🔄 AgentSystem: Resetting structure to defaults - Agents: ${this.defaultAgentCount}, Connect: ${this.defaultConnectDist}`);
    
    this.setAgentCount(this.defaultAgentCount);
    this.setConnectionDistance(this.defaultConnectDist);
  }
} 
