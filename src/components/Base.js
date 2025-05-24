/**
 * Base component class that all visual components extend from
 */
export class Component {
  constructor() {
    this.isVisible = true;
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