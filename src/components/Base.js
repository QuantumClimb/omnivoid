/**
 * Base component class that all visual components extend from
 */
export class Component {
  constructor(props = {}) {
    this.props = props;
    this.container = null;
    this.isMounted = false;
    this.isVisible = true;
    this.isMobile = this.detectMobile();
  }

  /**
   * Mount component into a container.
   * Existing components may still create their DOM in constructors; this method
   * provides a standard API for React adapters and future refactors.
   * @param {HTMLElement} container Parent container
   * @returns {Component} This component instance
   */
  mount(container = document.body) {
    this.container = container;
    this.isMounted = true;
    return this;
  }

  /**
   * Update component props.
   * @param {Object} props New props to merge into current props
   * @returns {Component} This component instance
   */
  update(props = {}) {
    this.props = { ...this.props, ...props };
    return this;
  }

  /**
   * Unmount component and release resources.
   */
  unmount() {
    this.destroy();
    this.container = null;
    this.isMounted = false;
  }

  /**
   * Clean up component resources. Override in child classes.
   */
  destroy() {
    // Override in child classes
  }

  /**
   * Detect if the device is mobile for performance optimization
   * @returns {boolean} True if mobile device, false otherwise
   */
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (globalThis.innerWidth <= 768) ||
           ('ontouchstart' in globalThis) ||
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
