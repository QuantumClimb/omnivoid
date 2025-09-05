import { AgentSystem } from './components/AgentSystem.js';
import { Logo } from './components/Logo.js';
import { AudioManager } from './controllers/AudioManager.js';
import { ThemeManager } from './controllers/ThemeManager.js';
import { SplashScreen } from './components/SplashScreen.js';
import { RetroWindow } from './components/RetroWindow.js';
import { GOOGLE_DRIVE_CONFIG, readPublicFile, fetchGoogleDriveTextFile } from './config/googleDrive.js';

// Import all other components but keep them hidden initially
import { Grid } from './components/Grid.js';
import { SolarSystem } from './components/SolarSystem.js';
import { Starfield } from './components/Starfield.js';
import { VectorGrid } from './components/VectorGrid.js';
import { ASCIITunnel } from './components/ASCIITunnel.js';
import { Cylinder3D } from './components/Cylinder3D.js';
import { Headline } from './components/Headline.js';
import { PolygonEcho } from './components/PolygonEcho.js';
import { AnimationController } from './controllers/AnimationController.js';
import { ControlPanel } from './controllers/ControlPanel.js';

/**
 * Main App class for OMNIVOID - Desktop version
 */
export class App {
  constructor() {
    console.log('🚀 OMNIVOID Desktop App initializing...');
    
    // Make this instance globally accessible for the radio file explorer
    window.omnivoidApp = this;
    
    // Initialize theme manager first
    this.themeManager = new ThemeManager();
    
    // Initialize audio manager
    this.audioManager = new AudioManager();
    
    // Google Drive integration
    this.googleDriveConfig = GOOGLE_DRIVE_CONFIG;
    this.googleDriveConfig.log('App initialized with Google Drive integration');
    
    // Mixcloud integration properties
    this.googleDriveConfig.log('Mixcloud integration ready');
    this.googleDriveConfig.log('Available folders:', this.googleDriveConfig.FOLDERS);
    
    // Initialize splash screen
    this.splashScreen = new SplashScreen();
    this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Initializing OMNIVOID...', 10);
    
    // Initialize components in sequence
    this.initializeComponents();

    console.log('🖥️ Desktop App initialized');
  }

  /**
   * Detect if the device is mobile for performance optimization
   * @returns {boolean} True if mobile device, false otherwise
   */
  detectMobile() {
    return window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  /**
   * Initialize all components in the correct sequence
   */
  async initializeComponents() {
    try {
      // Initialize audio system first
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Initializing audio system...', 20);
      await this.audioManager.initialize();
      
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Audio ready', 45);
      this.googleDriveConfig.log('Audio system initialized for external audio sources');

      // Load conundrum content immediately at startup
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading conundrum content...', 50);
      await this.loadConundrumContent();

      // Initialize visible components (AgentSystem, Logo only)
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading visual elements...', 55);
      this.agentSystem = new AgentSystem(this.audioManager);
      this.logo = new Logo(this.audioManager);
      
      // Initialize all other components but keep them hidden (for future use)
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading components...', 65);
      this.controlPanel = new ControlPanel('control-panels');
      this.starfield = new Starfield();
      this.vectorGrid = new VectorGrid();
      this.asciiTunnel = new ASCIITunnel();
      this.cylinder3D = new Cylinder3D();
      this.grid = new Grid();
      this.solarSystem = new SolarSystem();
      this.headline = new Headline(this.audioManager);
      this.polygonEcho = new PolygonEcho();
      
      // Connect ThemeManager with visual components for dynamic color updates
      this.themeManager.setComponents(this.solarSystem, this.agentSystem, this.polygonEcho);
      
      // Hide advanced visual layers but keep starfield visible
      this.hideAdvancedLayers();
      
      // Set up responsive controls based on device
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Setting up responsive controls...', 85);
      
          // Complete initialization
    this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 20px; height: 20px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Welcome to the OMNIVOID LABS Repository', 100);
    
    // Test Google Drive integration
    this.testGoogleDriveIntegration();
    
    // Add console commands for color system exploration
    this.setupConsoleCommands();
      
      // Initialize desktop mode
      this.initializeDesktopMode();
      
      // Add window resize listener for responsive controls
      window.addEventListener('resize', () => this.handleWindowResize());
      
      // Hide splash screen
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      this.splashScreen.log('❌ Initialization failed', 100);
    }
  }

  /**
   * Initialize desktop-specific mode
   */
  initializeDesktopMode() {
    console.log('🖥️ Initializing desktop mode...');
    
    // Create desktop controls
    this.createDesktopControls();
    
    // Create floating menu for desktop
    this.createFloatingMenu();
    
    // Show desktop controls
    this.showDesktopControls();
  }

  /**
   * Create desktop-specific controls
   */
  createDesktopControls() {
    // Create Latest Gig button for desktop
    this.createLatestGigButton();
    
    // Create desktop control panels
    this.createDesktopControlPanels();
  }

  /**
   * Create Latest Gig button above minimal controls
   */
  createLatestGigButton() {
    console.log('🔍 DEBUG: createLatestGigButton() called (Desktop)');
    
    // Check if button already exists in DOM to prevent duplicates
    const existingButton = document.querySelector('.latest-gig-button');
    if (existingButton) {
      console.log('🎵 Latest Gig button already exists in DOM, skipping creation');
      return;
    }
    
    // Additional check: if this.latestGigButton exists, don't create another
    if (this.latestGigButton) {
      console.log('🎵 Latest Gig button already exists in instance, skipping creation');
      return;
    }
    
    console.log('🔍 DEBUG: Creating new Latest Gig button (Desktop)...');
    
    const gigButton = document.createElement('button');
    gigButton.className = 'latest-gig-button';
    gigButton.innerHTML = '<img src="./public/ascii/V.svg" style="width: 20px; height: 20px; margin-right: 8px; filter: brightness(0) invert(1);" alt="Latest Rituals"> LATEST RITUALS';
    gigButton.title = 'View Latest Rituals';
    gigButton.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #111111;
      border: 1px solid #99ccff;
      color: #99ccff;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      z-index: 1001;
      backdrop-filter: blur(10px);
      box-shadow: 
        0 0 20px rgba(153, 204, 255, 0.2),
        4px 4px 8px rgba(0, 0, 0, 0.5);
      text-transform: uppercase;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Hover effects
    gigButton.addEventListener('mouseenter', () => {
      gigButton.style.backgroundColor = '#99ccff';
      gigButton.style.color = '#000000';
      gigButton.style.transform = 'scale(1.05)';
      const img = gigButton.querySelector('img');
      if (img) img.style.filter = 'brightness(0) invert(0)';
    });

    gigButton.addEventListener('mouseleave', () => {
      gigButton.style.backgroundColor = '#111111';
      gigButton.style.color = '#99ccff';
      gigButton.style.transform = 'scale(1)';
      const img = gigButton.querySelector('img');
      if (img) img.style.filter = 'brightness(0) invert(1)';
    });

    // Click handler to open gigs content
    gigButton.addEventListener('click', () => {
      console.log('🎵 Latest Gig button clicked (Desktop)');
      
      // Create gigs content if it doesn't exist
      if (!this.retroWindows['latest-gig']) {
        this.retroWindows['latest-gig'] = new RetroWindow('latest-gig', 'LATEST RITUALS', this.createGigsContent(), null);
      }
      
      // Open the gigs window
      this.retroWindows['latest-gig'].show();
    });

    document.body.appendChild(gigButton);
    this.latestGigButton = gigButton;
    
    console.log('🔍 DEBUG: Latest Gig button created and added to DOM (Desktop)');
  }

  /**
   * Create desktop control panels
   */
  createDesktopControlPanels() {
    // Desktop-specific control panels
    console.log('🖥️ Creating desktop control panels...');
  }

  /**
   * Show desktop controls
   */
  showDesktopControls() {
    console.log('🖥️ Showing desktop controls...');
  }

  /**
   * Handle window resize events
   */
  handleWindowResize() {
    const isDesktop = window.innerWidth >= 768;
    console.log(`📱 Window resize: ${window.innerWidth}px - ${isDesktop ? 'Desktop' : 'Mobile'} mode`);
    
    // Reset modal state on resize to prevent positioning issues
    this.resetModalState();
    
    if (isDesktop) {
      // Stay in desktop mode
      console.log('🖥️ Staying in desktop mode');
    } else {
      // Switch to mobile mode - reload the page with mobile app
      console.log('📱 Switching to mobile mode - reloading...');
      window.location.reload();
    }
  }

  // Include all other methods from AppMobile.js here...
  // (This is a simplified version - you would copy all the other methods)
}
