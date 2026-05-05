/**
 * Props interface for Base component
 */
export interface ComponentProps {
  [key: string]: unknown;
}

/**
 * Base component class that all visual components extend from
 */
export class Component {
  public props: ComponentProps;
  public container: HTMLElement | null;
  public isMounted: boolean;
  public isVisible: boolean;
  public isMobile: boolean;

  constructor(props: ComponentProps = {}) {
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
   * @param container Parent container
   * @returns This component instance
   */
  mount(container: HTMLElement = document.body): Component {
    this.container = container;
    this.isMounted = true;
    return this;
  }

  /**
   * Update component props.
   * @param props New props to merge into current props
   * @returns This component instance
   */
  update(props: ComponentProps = {}): Component {
    this.props = { ...this.props, ...props };
    return this;
  }

  /**
   * Unmount component and release resources.
   */
  unmount(): void {
    this.destroy();
    this.container = null;
    this.isMounted = false;
  }

  /**
   * Clean up component resources. Override in child classes.
   */
  destroy(): void {
    // Override in child classes
  }

  /**
   * Detect if the device is mobile for performance optimization
   * @returns True if mobile device, false otherwise
   */
  detectMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (globalThis.innerWidth <= 768) ||
           ('ontouchstart' in globalThis) ||
           (navigator.maxTouchPoints > 0);
  }

  /**
   * Set component visibility
   * @param visible Whether the component should be visible
   */
  setVisibility(visible: boolean): void {
    this.isVisible = visible;
    this.onVisibilityChange(visible);
  }

  /**
   * Handle visibility changes
   * @param visible Whether the component is now visible
   */
  onVisibilityChange(visible: boolean): void {
    // Override in child classes
  }
}