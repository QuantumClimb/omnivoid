/**
 * Base component class that all visual components extend from
 */
export class Component {
  constructor() {
    this.isVisible = true;
    this.isMobile = this.detectMobile();
  }

  /**
   * Detect if the device is mobile for performance optimization
   * @returns {boolean} True if mobile device, false otherwise
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
  }

  /**
   * Set component visibility
   * @param {boolean} visible Whether the component should be visible
   */
  setVisibility(visible) {
    this.isVisible = visible;
    this.onVisibilityChange(visible);
  }

  /**
   * Handle visibility changes
   * @param {boolean} visible Whether the component is now visible
   */
  onVisibilityChange(visible) {
    // Override in child classes
  }
} 
