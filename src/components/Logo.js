import { Component } from './Base.js';

/**
 * Logo component that displays the Omnivoid SVG logo
 */
export class Logo extends Component {
  /**
   * Create a new Logo instance
   */
  constructor() {
    super();
    this.baseScale = this.isMobile ? 0.8 : 1.0; // Smaller on mobile
    
    this.createElement();
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
    this.logoElement.src = 'public/logo.svg?v=' + Date.now();
    
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
      this.logoElement.src = 'logo.svg?v=' + Date.now();
      
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
      font-family: 'Space Mono', monospace;
      font-size: ${this.isMobile ? '18px' : '24px'};
      font-weight: bold;
      text-align: center;
      border: 2px solid white;
      padding: ${this.isMobile ? '15px' : '20px'};
      border-radius: 8px;
      background: rgba(0,0,0,0.3);
    `;
    this.logoElement.textContent = 'OMNIVOID';
    
    this.element.appendChild(this.logoElement);
    document.body.appendChild(this.element);
    
    console.log('✅ Fallback logo created');
  }

  /**
   * Audio visualization removed - Logo no longer responds to audio
   */

  /**
   * Update the logo scale (no audio reactivity)
   */
  updateScale() {
    if (this.logoElement) {
      this.logoElement.style.transform = `translate(-50%, -50%) scale(${this.baseScale})`;
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
