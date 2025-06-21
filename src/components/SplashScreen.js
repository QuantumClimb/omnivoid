import { Component } from './Base.js';

/**
 * SplashScreen component that shows loading progress
 */
export class SplashScreen extends Component {
  constructor() {
    super();
    this.createSplashScreen();
    this.logs = [];
  }

  createSplashScreen() {
    this.element = document.createElement('div');
    this.element.className = 'splash-screen';
    
    // Create title
    // Create logo element instead of text
    const logoElement = document.createElement('img');
    logoElement.src = 'public/logo.svg';
    logoElement.alt = 'OMNIVOID';
    logoElement.style.cssText = `
      max-width: 180px;
      width: 36vw;
      height: auto;
      margin-bottom: 40px;
      filter: brightness(1.2);
    `;
    
    // Fallback in case logo fails to load
    logoElement.onerror = () => {
      console.log('🔍 Logo failed, trying alternative path...');
      logoElement.src = 'logo.svg';
      
      logoElement.onerror = () => {
        console.log('🔍 Logo still failed, creating text fallback...');
        const textFallback = document.createElement('h1');
        textFallback.textContent = 'OMNIVOID 0.1';
        textFallback.style.cssText = `
          font-size: 48px;
          font-weight: bold;
          margin: 0 0 40px 0;
          color: var(--fg-color);
          letter-spacing: 4px;
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
    logEntry.textContent = message;
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
    setTimeout(() => {
      this.element.remove();
    }, 1000);
  }
} 