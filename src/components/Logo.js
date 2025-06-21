import { Component } from './Base.js';

/**
 * Logo component that displays the Omnivoid SVG logo
 */
export class Logo extends Component {
  /**
   * Create a new Logo instance
   * @param {AudioManager} audioManager Optional audio manager for visualization
   */
  constructor(audioManager = null) {
    super();
    this.audioManager = audioManager;
    this.audioScale = 1.0;
    this.baseScale = 1.0;
    this.maxScale = 1.2;
    
    this.createElement();
    this.setupAudioVisualization();
  }

  /**
   * Create the logo element
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'logo-container';
    
    console.log('🎨 Creating logo element...');
    
    // Try to load the SVG file directly
    this.loadSVG();
    
    console.log('🎨 Logo element created and added to DOM');
  }

  /**
   * Load the SVG logo
   */
  loadSVG() {
    this.logoElement = document.createElement('img');
    this.logoElement.className = 'logo-svg';
    this.logoElement.alt = 'Omnivoid';
    
    // Try the correct path for the SVG (public folder first)
    this.logoElement.src = 'public/logo.svg';
    
    console.log('🔄 Loading logo from:', this.logoElement.src);
    
    this.logoElement.onload = () => {
      console.log('✅ Logo loaded successfully!');
      this.element.appendChild(this.logoElement);
      document.body.appendChild(this.element);
    };
    
    this.logoElement.onerror = (error) => {
      console.error('❌ Failed to load SVG:', error);
      console.log('🔍 Trying alternative path...');
      
      // Try without public prefix
      this.logoElement.src = 'logo.svg';
      
      this.logoElement.onerror = () => {
        console.error('❌ All SVG loading attempts failed');
        // Fallback: embed a simple version
        this.createFallbackLogo();
      };
    };
  }

  /**
   * Create a simple fallback logo if SVG loading fails
   */
  createFallbackLogo() {
    console.log('📄 Creating fallback logo...');
    
    // Remove any existing logo element
    if (this.logoElement) {
      this.logoElement.remove();
    }
    
    // Create a simple text logo as fallback
    this.logoElement = document.createElement('div');
    this.logoElement.className = 'logo-svg';
    this.logoElement.style.cssText = `
      color: white;
      font-family: 'Orbitron', sans-serif;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      border: 2px solid white;
      padding: 20px;
      border-radius: 8px;
      background: rgba(0,0,0,0.3);
    `;
    this.logoElement.textContent = 'OMNIVOID';
    
    this.element.appendChild(this.logoElement);
    document.body.appendChild(this.element);
    
    console.log('✅ Fallback logo created');
  }

  /**
   * Set up audio visualization if audio manager is available
   */
  setupAudioVisualization() {
    if (this.audioManager) {
      this.audioManager.addVisualizer((normalizedData) => {
        // Calculate overall audio intensity
        const audioIntensity = (normalizedData.bass + normalizedData.mid + normalizedData.treble) / 3;
        this.audioScale = this.baseScale + audioIntensity * (this.maxScale - this.baseScale);
        this.updateScale();
      });
    }
  }

  /**
   * Update the logo scale based on audio
   */
  updateScale() {
    if (this.logoElement) {
      this.logoElement.style.transform = `translate(-50%, -50%) scale(${this.audioScale})`;
    }
  }

  /**
   * Set the logo scale
   * @param {number} scale Scale factor
   */
  setScale(scale) {
    this.baseScale = scale;
    this.updateScale();
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the logo is now visible
   */
  onVisibilityChange(visible) {
    this.element.style.display = visible ? 'block' : 'none';
  }
} 