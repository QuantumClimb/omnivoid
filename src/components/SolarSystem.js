import { Component } from './Base.js';

/**
 * SolarSystem component that creates an orbital system with planets
 */
export class SolarSystem extends Component {
  /**
   * Create a new SolarSystem instance
   */
  constructor() {
    super();
    this.element = document.querySelector('.solar-system');
    
    // Create the solar system element if it doesn't exist
    if (!this.element) {
      this.createElement();
    }
    
    this.planets = Array.from(this.element.querySelectorAll('.planet'));
    
    // Mobile optimization: Reduce animation complexity on mobile
    if (this.isMobile) {
      this.setOrbitSpeed(8); // Slower animation on mobile for better performance
    } else {
      this.setOrbitSpeed(4); // Normal speed on desktop
    }
    
    // Store default pink theme colors
    this.defaultColors = [
      '#ff6b9d', // Mercury - darker pink
      '#ff7aa8', // Venus - medium pink
      '#ff89b3', // Earth - lighter pink
      '#ff98be', // Mars - bright pink
      '#ffa7c9', // Jupiter - very bright pink
      '#ffb6d4', // Saturn - main pink
      '#ffc5df', // Uranus - lighter than main
      '#ffd4ea', // Neptune - very light pink
      '#ffe3f5'  // Pluto - lightest pink
    ];
    
    this.defaultSunColor = '#ffb6d4';
    
    this.setupOrbits();
  }

  /**
   * Create the solar system element and structure
   */
  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'solar-system';
    
    /* // Create sun
    const sun = document.createElement('div');
    sun.className = 'sun';
    this.element.appendChild(sun); */
    
    // Create planets with orbits
    const planetNames = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    planetNames.forEach(name => {
      const orbit = document.createElement('div');
      orbit.className = 'orbit';
      
      const planet = document.createElement('div');
      planet.className = `planet ${name}`;
      
      orbit.appendChild(planet);
      this.element.appendChild(orbit);
    });
    
    document.body.appendChild(this.element);
  }

  /**
   * Set up the orbital system
   */
  setupOrbits() {
    // Apply default colors to planets
    this.applyPlanetColors(this.defaultColors);
    
    // Set sun color with pink styling
    const sun = this.element.querySelector('.sun');
    if (sun) {
      sun.style.backgroundColor = this.defaultSunColor;
      sun.style.boxShadow = `0 0 30px rgba(255, 182, 212, 0.6)`;
    }
  }

  /**
   * Apply colors to planets
   * @param {Array} colors Array of color strings
   */
  applyPlanetColors(colors) {
    this.planets.forEach((planet, index) => {
      if (colors[index]) {
        planet.style.backgroundColor = colors[index];
        planet.style.boxShadow = `0 0 10px ${colors[index]}40`; // Add glow effect
      }
    });
  }

  /**
   * Update colors with new random theme palette
   * @param {Object} colorPalette Color palette object from ThemeManager
   */
  updateColors(colorPalette) {
    // Generate a variety of colors based on the palette
    const planetColors = this.generatePlanetColors(colorPalette);
    this.applyPlanetColors(planetColors);
    
    // Update sun color
    const sun = this.element.querySelector('.sun');
    if (sun) {
      sun.style.backgroundColor = colorPalette.accent1 || colorPalette.foreground;
      sun.style.boxShadow = `0 0 30px ${colorPalette.accent1 || colorPalette.foreground}60`;
    }
    
    // Update orbit colors
    const orbits = this.element.querySelectorAll('.orbit');
    orbits.forEach((orbit, index) => {
      const orbitColor = planetColors[index] || colorPalette.accent2 || colorPalette.track;
      orbit.style.borderColor = `${orbitColor}40`; // 40% opacity
    });
  }

  /**
   * Generate planet colors from the theme palette
   * @param {Object} colorPalette Color palette object
   * @returns {Array} Array of planet colors
   */
  generatePlanetColors(colorPalette) {
    // Create variations of the theme colors for planets
    const variations = [
      colorPalette.accent1,
      colorPalette.accent2,
      colorPalette.accent3,
      colorPalette.thumb,
      colorPalette.track,
      colorPalette.foreground,
      colorPalette.background,
      colorPalette.panel,
      colorPalette.accent1 // Repeat for 9th planet
    ];
    
    // Add some randomization to make each planet slightly different
    return variations.map(color => {
      if (!color) return this.defaultColors[0]; // Fallback
      
      // Parse HSL and add slight variations
      const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const hue = parseInt(hslMatch[1]);
        const sat = parseInt(hslMatch[2]);
        const light = parseInt(hslMatch[3]);
        
        // Add small random variations
        const hueVariation = Math.floor(Math.random() * 20) - 10; // ±10 degrees
        const satVariation = Math.floor(Math.random() * 15) - 7;  // ±7%
        const lightVariation = Math.floor(Math.random() * 20) - 10; // ±10%
        
        const newHue = (hue + hueVariation + 360) % 360;
        const newSat = Math.max(60, Math.min(100, sat + satVariation));
        const newLight = Math.max(20, Math.min(70, light + lightVariation));
        
        return `hsl(${newHue}, ${newSat}%, ${newLight}%)`;
      }
      
      return color;
    });
  }

  /**
   * Reset colors to default OMNIVOID theme
   */
  resetColors() {
    this.applyPlanetColors(this.defaultColors);
    
    // Reset sun color
    const sun = this.element.querySelector('.sun');
    if (sun) {
      sun.style.backgroundColor = this.defaultSunColor;
      sun.style.boxShadow = `0 0 30px rgba(153, 204, 255, 0.6)`;
    }
    
    // Reset orbit colors
    const orbits = this.element.querySelectorAll('.orbit');
    orbits.forEach(orbit => {
      orbit.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    });
  }

  /**
   * Set the orbital animation speed
   * @param {number} speed Animation duration in seconds
   */
  setOrbitSpeed(speed) {
    document.documentElement.style.setProperty('--radial-duration', speed + 's');
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the system is now visible
   */
  onVisibilityChange(visible) {
    this.element.style.display = visible ? 'block' : 'none';
    this.isVisible = visible;
  }

  /**
   * Set visibility of the solar system
   * @param {boolean} visible Whether to show or hide the system
   */
  setVisibility(visible) {
    this.onVisibilityChange(visible);
  }

  /**
   * Show the solar system
   */
  show() {
    this.setVisibility(true);
  }

  /**
   * Hide the solar system
   */
  hide() {
    this.setVisibility(false);
  }

  /**
   * Clean up the solar system element.
   */
  destroy() {
    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.planets = [];
  }
}
