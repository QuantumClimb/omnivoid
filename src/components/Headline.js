import { Component } from './Base.js';

/**
 * Headline component that manages the main text display
 */
export class Headline extends Component {
  /**
   * Create a new Headline instance
   * @param {AudioManager} audioManager Audio manager instance
   */
  constructor(audioManager) {
    super();
    this.element = document.querySelector('.headline-text');
    this.audioManager = audioManager;
    
    // Check if element exists
    if (!this.element) {
      console.warn('⚠️ Headline: No .headline-text element found in DOM');
      return; // Don't set up audio visualization if no element
    }
    
    // Base style values
    this.baseScale = 1;
    this.baseOpacity = 1;
    
    // Audio response settings
    this.settings = {
      scaleRange: { min: 0.8, max: 1.5 },
      opacityRange: { min: 0.4, max: 1 },
      bassWeight: 0.6,
      midWeight: 0.3,
      trebleWeight: 0.1,
      smoothing: 0.3
    };
    
    // Current values for smooth transitions
    this.currentScale = this.baseScale;
    this.currentOpacity = this.baseOpacity;
    
    if (this.audioManager) {
      this.audioManager.addVisualizer(this.onAudioData.bind(this));
    }
  }

  /**
   * Handle audio frequency data
   * @param {Object} data Audio frequency data
   */
  onAudioData({ bass, mid, treble }) {
    // Safety check: ensure element exists
    if (!this.element) {
      return;
    }
    
    // Calculate weighted average of frequencies
    const intensity = 
      bass * this.settings.bassWeight + 
      mid * this.settings.midWeight + 
      treble * this.settings.trebleWeight;
    
    // Calculate target scale and opacity
    const targetScale = this.lerp(
      this.settings.scaleRange.min,
      this.settings.scaleRange.max,
      intensity
    );
    
    const targetOpacity = this.lerp(
      this.settings.opacityRange.min,
      this.settings.opacityRange.max,
      intensity
    );
    
    // Smooth transitions
    this.currentScale = this.lerp(
      this.currentScale,
      targetScale,
      this.settings.smoothing
    );
    
    this.currentOpacity = this.lerp(
      this.currentOpacity,
      targetOpacity,
      this.settings.smoothing
    );
    
    // Apply transformations
    this.element.style.transform = `translate(-50%, -50%) scale(${this.currentScale})`;
    this.element.style.opacity = this.currentOpacity;
  }

  /**
   * Linear interpolation helper
   * @param {number} start Start value
   * @param {number} end End value
   * @param {number} t Interpolation factor
   * @returns {number} Interpolated value
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  }

  /**
   * Set the headline text
   * @param {string} text New text to display
   */
  setText(text) {
    if (!this.element) return;
    this.element.textContent = text;
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the headline is now visible
   */
  onVisibilityChange(visible) {
    if (!this.element) return;
    this.element.style.display = visible ? 'block' : 'none';
  }

  /**
   * Clean up when component is destroyed
   */
  destroy() {
    if (this.audioManager) {
      this.audioManager.removeVisualizer(this.onAudioData.bind(this));
    }
  }
} 