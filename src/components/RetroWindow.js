import { Component } from './Base.js';

/**
 * RetroWindow - OMNIVOID-styled floating window component
 * Dark theme with blue aesthetic
 */
export class RetroWindow extends Component {
  constructor(id, title, content = '') {
    super();
    this.id = id;
    this.title = title;
    this.content = content;
    this.isVisible = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    
    this.createElement();
    this.addEventListeners();
  }

  /**
   * Create the retro window element with OMNIVOID styling
   */
  createElement() {
    // Create window container
    this.element = document.createElement('div');
    this.element.className = 'retro-window';
    this.element.id = this.id;
    this.element.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 480px;
      max-width: 90vw;
      height: 360px;
      max-height: 80vh;
      background-color: #111111;
      border: 1px solid #333333;
      box-shadow: 
        0 0 20px rgba(153, 204, 255, 0.2),
        4px 4px 8px rgba(0, 0, 0, 0.5);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 12px;
      z-index: 9999;
      display: none;
      opacity: 0;
      transition: opacity 0.2s ease;
      color: #99ccff;
    `;

    // Create title bar
    this.titleBar = document.createElement('div');
    this.titleBar.className = 'retro-window-titlebar';
    this.titleBar.style.cssText = `
      height: 32px;
      background: linear-gradient(90deg, #000000 0%, #333333 100%);
      border-bottom: 1px solid #333333;
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
      color: #99ccff;
      font-weight: bold;
      font-size: 14px;
      text-shadow: 0 0 5px rgba(153, 204, 255, 0.5);
      flex-grow: 1;
      padding-left: 4px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    // Create close button
    this.closeButton = document.createElement('button');
    this.closeButton.innerHTML = '×';
    this.closeButton.className = 'retro-window-close';
    this.closeButton.style.cssText = `
      width: 24px;
      height: 24px;
      background-color: transparent;
      color: #99ccff;
      border: 1px solid #99ccff;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;
      font-family: monospace;
      border-radius: 0;
      transition: background-color 0.2s, color 0.2s;
    `;

    // Create window body
    this.body = document.createElement('div');
    this.body.className = 'retro-window-body';
    this.body.style.cssText = `
      height: calc(100% - 34px);
      background-color: #000000;
      border: 1px solid #333333;
      margin: 1px;
      overflow: auto;
      padding: 15px;
      color: #99ccff;
      line-height: 1.4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;

    // Set initial content
    this.body.innerHTML = this.content || this.getDefaultContent();

    // Assemble window
    this.titleBar.appendChild(this.titleText);
    this.titleBar.appendChild(this.closeButton);
    this.element.appendChild(this.titleBar);
    this.element.appendChild(this.body);

    // Add to document
    document.body.appendChild(this.element);
  }

  /**
   * Get default placeholder content with OMNIVOID styling
   */
  getDefaultContent() {
    return `
      <div class="container" style="background-color: #111111; border: 1px solid #333333; padding: 20px; margin-bottom: 15px;">
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #99ccff;">OMNIVOID CONUNDRUM</h3>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #99ccff;">
          Welcome to the OMNIVOID experience. This dark interface brings you into the depths of digital consciousness while delivering cutting-edge audio-visual artistry.
        </p>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #99ccff;">
          Navigate through our immersive soundscapes and discover the hidden layers of reality that lie beneath the surface of perception.
        </p>
        <hr style="border: none; border-top: 1px solid #333333; margin: 12px 0;">
        <p style="margin: 0; font-size: 12px; color: #99ccff;">
          <strong>System Status:</strong> All systems operational<br>
          <strong>Audio Engine:</strong> Web Audio API v2.0<br>
          <strong>Visual Processing:</strong> Canvas 2D + WebGL<br>
          <strong>Particle Systems:</strong> Active
        </p>
      </div>
      
      <div class="container" style="background-color: #111111; border: 1px solid #333333; padding: 20px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #99ccff;">Recent Activity</h4>
        <div style="font-size: 12px; line-height: 1.4; color: #99ccff;">
          <div style="margin-bottom: 6px;">• Audio visualization initialized</div>
          <div style="margin-bottom: 6px;">• Particle system activated</div>
          <div style="margin-bottom: 6px;">• Starfield rendering enabled</div>
          <div style="margin-bottom: 6px;">• User interface loaded</div>
          <div style="margin-bottom: 6px;">• Welcome to OMNIVOID</div>
        </div>
      </div>
    `;
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

    // Close button hover effects - OMNIVOID style
    this.closeButton.addEventListener('mouseenter', () => {
      this.closeButton.style.backgroundColor = '#99ccff';
      this.closeButton.style.color = '#000000';
    });

    this.closeButton.addEventListener('mouseleave', () => {
      this.closeButton.style.backgroundColor = 'transparent';
      this.closeButton.style.color = '#99ccff';
    });

    this.closeButton.addEventListener('mousedown', () => {
      this.closeButton.style.backgroundColor = '#336699';
      this.closeButton.style.color = '#ffffff';
    });

    this.closeButton.addEventListener('mouseup', () => {
      this.closeButton.style.backgroundColor = '#99ccff';
      this.closeButton.style.color = '#000000';
    });

    // Dragging functionality
    this.titleBar.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      const rect = this.element.getBoundingClientRect();
      this.dragOffset.x = e.clientX - rect.left;
      this.dragOffset.y = e.clientY - rect.top;
      this.element.style.transform = 'none';
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.handleDragEnd);
      e.preventDefault();
    });

    // Bind drag handlers
    this.handleDrag = this.handleDrag.bind(this);
    this.handleDragEnd = this.handleDragEnd.bind(this);

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible) {
        this.hide();
      }
    });
  }

  /**
   * Handle dragging
   */
  handleDrag(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // Constrain to viewport
    const maxX = window.innerWidth - this.element.offsetWidth;
    const maxY = window.innerHeight - this.element.offsetHeight;
    
    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));

    this.element.style.left = constrainedX + 'px';
    this.element.style.top = constrainedY + 'px';
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
    this.isVisible = true;
    this.element.style.display = 'block';
    
    // Trigger reflow then animate
    this.element.offsetHeight;
    this.element.style.opacity = '1';
    
    // Bring to front
    this.element.style.zIndex = '9999';
  }

  /**
   * Hide the window
   */
  hide() {
    this.isVisible = false;
    this.element.style.opacity = '0';
    
    setTimeout(() => {
      if (!this.isVisible) {
        this.element.style.display = 'none';
        // Reset position to center
        this.element.style.left = '';
        this.element.style.top = '';
        this.element.style.transform = 'translate(-50%, -50%)';
      }
    }, 200);
  }

  /**
   * Set window content
   */
  setContent(content) {
    this.content = content;
    this.body.innerHTML = content;
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
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  }
} 