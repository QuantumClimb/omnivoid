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
    this.planets = Array.from(this.element.querySelectorAll('.planet'));
    this.setupOrbits();
  }

  /**
   * Set up the orbital system
   */
  setupOrbits() {
    // Planet colors in grayscale
    const planetColors = [
      '#989898', // Mercury
      '#A8A8A8', // Venus
      '#B8B8B8', // Earth
      '#C0C0C0', // Mars
      '#C8C8C8', // Jupiter
      '#D0D0D0', // Saturn
      '#D4D4D4', // Uranus
      '#CCCCCC', // Neptune
      '#C4C4C4'  // Pluto
    ];

    // Apply colors to planets
    this.planets.forEach((planet, index) => {
      planet.style.backgroundColor = planetColors[index];
    });

    // Set sun color
    const sun = this.element.querySelector('.sun');
    if (sun) {
      sun.style.backgroundColor = '#E0E0E0';
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
  }
} 