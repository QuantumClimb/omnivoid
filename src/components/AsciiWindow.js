import { Component } from './Base.js';

/**
 * AsciiWindow - OMNIVOID-styled window for embedding ASCIIVOID site
 * Based on RetroWindow but optimized for iframe content
 */
export class AsciiWindow extends Component {
  constructor(id = 'ascii-window', title = 'ASCIIVOID', url = 'https://asciivoid.pages.dev/', onClose = null) {
    super();
    this.id = id;
    this.title = title;
    this.url = url;
    this.onClose = onClose;
    this.isVisible = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isLoading = true;
    this.hideTimeoutId = null;
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    
    // Desktop positioning - center by default
    this.desktopPosition = { top: '50%', left: '50%' };
    
    this.createElement();
    this.addEventListeners();
  }

  /**
   * Create the ASCII window element with OMNIVOID styling
   */
  createElement() {
    // Create window container
    this.element = document.createElement('div');
    this.element.className = 'ascii-window';
    this.element.id = this.id;
    
    // Check if we're on desktop and set appropriate sizing
    const isDesktop = globalThis.innerWidth >= 768;
    
    this.element.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: ${isDesktop ? '85vw' : '95vw'};
      max-width: ${isDesktop ? '1200px' : '95vw'};
      height: ${isDesktop ? '75vh' : '80vh'};
      max-height: 85vh;
      background-color: #111111;
      border: 1px solid #00FF22;
      box-shadow: 
        0 0 20px rgba(0, 255, 34, 0.3),
        4px 4px 8px rgba(0, 0, 0, 0.5);
      font-family: 'Space Mono', monospace;
      font-size: ${isDesktop ? '12px' : '14px'};
      z-index: 10000;
      display: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      color: #00FF22;
    `;

    // Create title bar
    this.titleBar = document.createElement('div');
    this.titleBar.className = 'ascii-window-titlebar';
    this.titleBar.style.cssText = `
      height: 32px;
      background: linear-gradient(90deg, #000000 0%, #001a00 100%);
      border-bottom: 1px solid #00FF22;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 8px;
      cursor: move;
      user-select: none;
    `;

    // Create title text
    this.titleText = document.createElement('span');
    this.titleText.textContent = this.title;
    this.titleText.style.cssText = `
      color: #00FF22;
      font-weight: bold;
      font-size: 14px;
      text-shadow: 0 0 5px rgba(0, 255, 34, 0.5);
      flex-grow: 1;
      padding-left: 4px;
      font-family: 'Space Mono', monospace;
    `;

    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = '×';
    this.closeButton.className = 'ascii-window-close';
    this.closeButton.style.cssText = `
      width: 24px;
      height: 24px;
      background-color: transparent;
      color: #00FF22;
      border: 1px solid #00FF22;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;
      font-family: 'Space Mono', monospace;
      border-radius: 0;
      transition: background-color 0.2s, color 0.2s;
    `;

    // Create window body
    this.body = document.createElement('div');
    this.body.className = 'ascii-window-body';
    this.body.style.cssText = `
      height: calc(100% - 34px);
      background-color: #000000;
      border: 1px solid #00FF22;
      margin: 1px;
      overflow: hidden;
      padding: 0;
      position: relative;
    `;

    // Create loading indicator
    this.loadingIndicator = document.createElement('div');
    this.loadingIndicator.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #00FF22;
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      text-align: center;
      z-index: 1;
    `;
    this.loadingIndicator.innerHTML = `
      <div style="margin-bottom: 10px;">Loading ASCIIVOID...</div>
      <div style="font-size: 12px; opacity: 0.7;">Connecting to asciivoid.pages.dev</div>
    `;

    // Create iframe
    this.iframe = document.createElement('iframe');
    this.iframe.src = this.url;
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      background: #000000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;

    // Handle iframe loading
    this.iframe.onload = () => {
      this.isLoading = false;
      this.loadingIndicator.style.display = 'none';
      this.iframe.style.opacity = '1';
      console.log('✅ ASCIIVOID iframe loaded successfully');
    };

    this.iframe.onerror = () => {
      this.isLoading = false;
      this.loadingIndicator.innerHTML = `
        <div style="color: #ff4444; margin-bottom: 10px;">Failed to load ASCIIVOID</div>
        <div style="font-size: 12px; opacity: 0.7;">Check your internet connection</div>
        <div style="font-size: 10px; margin-top: 10px; opacity: 0.5;">${this.url}</div>
      `;
      console.error('❌ Failed to load ASCIIVOID iframe');
    };

    // Assemble window
    this.body.appendChild(this.loadingIndicator);
    this.body.appendChild(this.iframe);
    this.titleBar.appendChild(this.titleText);
    this.titleBar.appendChild(this.closeButton);
    this.element.appendChild(this.titleBar);
    this.element.appendChild(this.body);

    // Add to document
    document.body.appendChild(this.element);
  }

  /**
   * Add event listeners for window functionality
   */
  addEventListeners() {
    // Close button
    this.closeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.hide();
    });

    // Close button hover effects - Green theme
    this.closeButton.addEventListener('mouseenter', () => {
      this.closeButton.style.backgroundColor = '#00FF22';
      this.closeButton.style.color = '#000000';
    });

    this.closeButton.addEventListener('mouseleave', () => {
      this.closeButton.style.backgroundColor = 'transparent';
      this.closeButton.style.color = '#00FF22';
    });

    this.closeButton.addEventListener('mousedown', () => {
      this.closeButton.style.backgroundColor = '#006600';
      this.closeButton.style.color = '#ffffff';
    });

    this.closeButton.addEventListener('mouseup', () => {
      this.closeButton.style.backgroundColor = '#00FF22';
      this.closeButton.style.color = '#000000';
    });

    // Dragging functionality
    this.titleBar.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      const rect = this.element.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left;
      this.dragOffset.y = e.clientY - rect.top;
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleDragEnd);
      e.preventDefault();
    });

    // ESC key to close
    document.addEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Handle global key presses
   */
  handleKeyDown(e) {
    if (e.key === 'Escape' && this.isVisible) {
      this.hide();
    }
  }

  /**
   * Handle dragging
   */
  handleDrag(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // Constrain to viewport
    const maxX = globalThis.innerWidth - this.element.offsetWidth;
    const maxY = globalThis.innerHeight - this.element.offsetHeight;
    
    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));

    this.element.style.left = constrainedX + 'px';
    this.element.style.top = constrainedY + 'px';
    this.element.style.transform = 'none';
  }

  /**
   * Handle drag end
   */
  handleDragEnd() {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  }

  /**
   * Show the window
   */
  show() {
    console.log('🎨 Opening ASCIIVOID window');
    this.isVisible = true;
    this.element.style.display = 'block';
    
    // Trigger reflow then animate
    this.element.offsetHeight;
    this.element.style.opacity = '1';
    
    // Bring to front
    this.element.style.zIndex = '10000';
  }

  /**
   * Hide the window
   */
  hide() {
    console.log('🎨 Closing ASCIIVOID window');
    this.isVisible = false;
    this.element.style.opacity = '0';
    
    // Call onClose callback if provided
    if (this.onClose && typeof this.onClose === 'function') {
      this.onClose(this.id);
    }
    
    this.hideTimeoutId = setTimeout(() => {
      if (!this.isVisible) {
        this.element.style.display = 'none';
        // Reset position
        this.element.style.left = '50%';
        this.element.style.top = '50%';
        this.element.style.transform = 'translate(-50%, -50%)';
      }
      this.hideTimeoutId = null;
    }, 200);
  }

  /**
   * Toggle window visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Destroy the window
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Reload the iframe content
   */
  reload() {
    this.isLoading = true;
    this.loadingIndicator.style.display = 'block';
    this.iframe.style.opacity = '0';
    this.iframe.src = this.iframe.src; // Reload iframe
  }
}
