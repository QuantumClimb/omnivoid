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
    // Planet colors in OMNIVOID blue theme
    const planetColors = [
      '#4d79a4', // Mercury - darker blue
      '#5c8bb8', // Venus - medium blue
      '#6b9dcc', // Earth - lighter blue
      '#7aaee0', // Mars - bright blue
      '#89c0f4', // Jupiter - very bright blue
      '#99ccff', // Saturn - main OMNIVOID blue
      '#a8d6ff', // Uranus - lighter than main
      '#b7e0ff', // Neptune - very light blue
      '#c6eaff'  // Pluto - lightest blue
    ];

    // Apply colors to planets
    this.planets.forEach((planet, index) => {
      planet.style.backgroundColor = planetColors[index];
      planet.style.boxShadow = `0 0 10px ${planetColors[index]}40`; // Add glow effect
    });

    // Set sun color with OMNIVOID styling
    const sun = this.element.querySelector('.sun');
    if (sun) {
      sun.style.backgroundColor = '#99ccff';
      sun.style.boxShadow = '0 0 30px rgba(153, 204, 255, 0.6)';
    }
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
} 