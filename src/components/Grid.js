import { Component } from './Base.js';

/**
 * Grid component that creates an interactive grid with cube animations
 */
export class Grid extends Component {
  /**
   * Create a new Grid instance
   */
  constructor() {
    super();
    this.element = document.querySelector('.grid');
    
    // Create the grid element if it doesn't exist
    if (!this.element) {
      this.element = document.createElement('div');
      this.element.className = 'grid';
      document.body.appendChild(this.element);
    }
    
    this.size = 20;
    this.setupGrid();
  }

  /**
   * Set up the grid with cells
   */
  setupGrid() {
    this.element.innerHTML = '';
    this.element.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    this.element.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    
    for (let i = 0; i < this.size * this.size; i++) {
      const cell = document.createElement('div');
      if (Math.random() < 0.5) {
        const inner = document.createElement('div');
        cell.appendChild(inner);
      }
      this.element.appendChild(cell);
    }
  }

  /**
   * Set the grid size
   * @param {number} size Number of cells per side
   */
  setSize(size) {
    this.size = size;
    this.setupGrid();
  }

  /**
   * Set the cube animation speed
   * @param {number} speed Animation duration in seconds
   */
  setCubeSpeed(speed) {
    document.documentElement.style.setProperty('--cube-duration', speed + 's');
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the grid is now visible
   */
  onVisibilityChange(visible) {
    this.element.style.display = visible ? 'grid' : 'none';
  }
} 