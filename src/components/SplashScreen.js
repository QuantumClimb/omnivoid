import { Component } from './Base.js';

/**
 * SplashScreen component that shows loading progress
 */
export class SplashScreen extends Component {
  constructor() {
    super();
    this.hideTimeoutId = null;
    this.createSplashScreen();
    this.logs = [];
  }

  createSplashScreen() {
    this.element = document.createElement('div');
    this.element.className = 'splash-screen';
    
    // Create title
    // Create logo element instead of text
    const logoElement = document.createElement('img');
    logoElement.src = '/logo.svg?v=' + Date.now();
    logoElement.alt = 'OMNIVOID';
    logoElement.style.cssText = `
      max-width: ${this.isMobile ? '140px' : '180px'};
      width: ${this.isMobile ? '28vw' : '36vw'};
      height: auto;
      margin-bottom: ${this.isMobile ? '30px' : '40px'};
      filter: brightness(1.2);
    `;
    
    // Fallback in case logo fails to load
    logoElement.onerror = () => {
      console.log('🔍 Logo failed, trying stacked version...');
      logoElement.src = '/stacked — labs.svg?v=' + Date.now();
      
      logoElement.onerror = () => {
        console.log('🔍 Logo still failed, creating text fallback...');
        const textFallback = document.createElement('h1');
        textFallback.textContent = 'OMNIVOID 0.1';
        textFallback.style.cssText = `
          font-size: ${this.isMobile ? '36px' : '48px'};
          font-weight: bold;
          margin: 0 0 ${this.isMobile ? '30px' : '40px'} 0;
          color: var(--fg-color);
          letter-spacing: ${this.isMobile ? '2px' : '4px'};
          text-transform: uppercase;
        `;
        this.element.replaceChild(textFallback, logoElement);
      };
    };
    
    this.element.appendChild(logoElement);
    
    // Create log container
    this.logContainer = document.createElement('div');
    this.logContainer.className = 'splash-logs';
    this.element.appendChild(this.logContainer);
    
    // Create progress bar
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'splash-progress';
    this.progressFill = document.createElement('div');
    this.progressFill.className = 'splash-progress-fill';
    this.progressBar.appendChild(this.progressFill);
    this.element.appendChild(this.progressBar);
    
    document.body.appendChild(this.element);
  }

  /**
   * Add a log message to the splash screen
   * @param {string} message Log message
   * @param {number} progress Progress percentage (0-100)
   */
  log(message, progress) {
    const logEntry = document.createElement('div');
    logEntry.className = 'splash-log';
    logEntry.innerHTML = message;
    this.logContainer.appendChild(logEntry);
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
    
    if (progress !== undefined) {
      this.progressFill.style.width = `${progress}%`;
    }
    
    // Keep only last 5 logs visible
    this.logs.push(logEntry);
    if (this.logs.length > 5) {
      const oldLog = this.logs.shift();
      oldLog.remove();
    }
  }

  /**
   * Hide the splash screen with a fade out animation
   */
  hide() {
    this.element.classList.add('fade-out');
    this.hideTimeoutId = setTimeout(() => {
      this.element.remove();
      this.hideTimeoutId = null;
    }, 1000);
  }

  /**
   * Clean up the splash screen and pending hide timer.
   */
  destroy() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }

    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
} 
