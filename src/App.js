import { AgentSystem } from './components/AgentSystem.js';
import { Logo } from './components/Logo.js';
import { AudioManager } from './controllers/AudioManager.js';
import { ThemeManager } from './controllers/ThemeManager.js';
import { SplashScreen } from './components/SplashScreen.js';
import { RetroWindow } from './components/RetroWindow.js';
import { AsciiWindow } from './components/AsciiWindow.js';
import { GOOGLE_DRIVE_CONFIG, readPublicFile, fetchGoogleDriveTextFile } from './config/googleDrive.js';

// Import all other components but keep them hidden initially
import { SolarSystem } from './components/SolarSystem.js';
import { Starfield } from './components/Starfield.js';
import { ASCIITunnel } from './components/ASCIITunnel.js';
import { PolygonEcho } from './components/PolygonEcho.js';
import { AnimationController } from './controllers/AnimationController.js';
import { ControlPanel } from './controllers/ControlPanel.js';

/**
 * Main App class for OMNIVOID - Desktop version with full mobile functionality
 */
export class App {
  constructor() {
    console.log('🖥️ OMNIVOID Desktop App initializing...');
    
    // Global cleanup to remove any existing buttons from other app versions
    this.globalCleanup();
    
    // Make this instance globally accessible for the radio file explorer
    window.omnivoidApp = this;
    
    // Initialize theme manager first
    this.themeManager = new ThemeManager();
    
    // Initialize audio manager (singleton)
    this.audioManager = AudioManager.getInstance();
    
    // Google Drive integration
    this.googleDriveConfig = GOOGLE_DRIVE_CONFIG;
    this.googleDriveConfig.log('Desktop App initialized with Google Drive integration');
    
    // Mixcloud integration properties
    this.googleDriveConfig.log('Mixcloud integration ready');
    this.googleDriveConfig.log('Available folders:', this.googleDriveConfig.FOLDERS);
    
    // Initialize splash screen
    this.splashScreen = new SplashScreen();
    this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Initializing OMNIVOID...', 10);
    
    // Initialize components in sequence
    this.initializeComponents();

    console.log('🖥️ Desktop App initialized');
    
    // Add keyboard controls
    document.addEventListener('keydown', (event) => {
      this.handleKeyPress(event);
    });
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
   * Get mobile detection status
   * @returns {boolean} True if mobile device, false otherwise
   */
  get isMobile() {
    return this.detectMobile();
  }

  /**
   * Initialize the OMNIVOID application
   */
  async initializeComponents() {
    try {
      // Initialize core managers
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading core systems...', 15);
      this.animationController = new AnimationController();
      
      // Initialize audio system
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Initializing audio...', 25);
      await this.audioManager.initializeAudioContext();
      
      // Audio system ready for Mixcloud integration
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Audio system ready...', 35);
      this.googleDriveConfig.log('Audio system ready for Mixcloud integration');
      
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Audio ready', 45);
      this.googleDriveConfig.log('Audio system initialized for external audio sources');

      // Load conundrum content immediately at startup
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading conundrum content...', 50);
      await this.loadConundrumContent();

      // Initialize visible components (AgentSystem, Logo only)
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading visual elements...', 55);
      this.agentSystem = AgentSystem.getInstance();
      this.logo = new Logo();
      
      // Initialize music player
      this.currentMusic = null;
      this.currentMusicIndex = 0;
      this.isMusicPlaying = false;
      this.musicFiles = [
        'public/audio/Cinematic Nightscape.mp3',
        'public/audio/Dive into this Dreamscape.mp3',
        'public/audio/Echo Trails.mp3',
        'public/audio/Echoes in the Groove.mp3',
        'public/audio/Echoes of Tomorrow.mp3',
        'public/audio/Electric Shadows.mp3',
        'public/audio/Glitch in the Groove.mp3',
        'public/audio/Hypnotic Groove.mp3',
        'public/audio/Late Night Echoes.mp3',
        'public/audio/Melodic Echoes.mp3',
        'public/audio/Neon Echoes.mp3',
        'public/audio/Saturated Reverie.mp3',
        'public/audio/Shimmering Trails.mp3',
        'public/audio/Tension in the Air.mp3'
      ];
      
      // Initialize all other components but keep them hidden (for future use)
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Loading components...', 65);
      this.controlPanel = new ControlPanel('control-panels');
      this.starfield = new Starfield();
      this.asciiTunnel = new ASCIITunnel();
      this.solarSystem = new SolarSystem();
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
      
      // Initialize mobile mode
      this.initializeMobileMode();
      
      // Add window resize listener for responsive controls
      window.addEventListener('resize', () => this.handleWindowResize());
      
      // Hide splash screen
      setTimeout(() => {
        this.splashScreen.hide();
        // Add permanent footer after splash screen is hidden
        this.addPermanentFooter();
      }, 2000);
      
    } catch (error) {
      this.splashScreen.log(`<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Error: ${error.message}`, 100);
      console.error('Initialization error:', error);
    }
  }

  /**
   * Add permanent footer with debug message and copyright info
   */
  addPermanentFooter() {
    // Footer with copyright and powered by
    const footer = document.createElement('div');
    footer.className = 'permanent-footer';
    footer.style.cssText = `
      position: fixed;
      bottom: 0px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      font-size: 10px;
      color: #99ccff;
      font-family: 'Space Mono', monospace;
      opacity: 0.8;
      z-index: 1001;
    `;
    
    // Copyright text
    const copyright = document.createElement('div');
    copyright.textContent = '© 2025 OMNIVOID LABS';
    copyright.style.cssText = `
      font-size: 10px;
      color: #99ccff;
    `;
    
    // Powered by QC logo
    const poweredBy = document.createElement('div');
    poweredBy.style.cssText = `
      display: flex;
      align-items: center;
      gap: 5px;
    `;
    
    const poweredByText = document.createElement('span');
    poweredByText.textContent = 'Powered by';
    poweredByText.style.cssText = `
      font-size: 10px;
      color: #99ccff;
    `;
    
    const qcLogo = document.createElement('img');
    qcLogo.src = 'public/qc.png';
    qcLogo.alt = 'Quantum Climb';
    qcLogo.style.cssText = `
      width: 54px;
      height: 54px;
      object-fit: contain;
      cursor: pointer;
    `;
    
    // Add click handler to open Quantum Climb website
    qcLogo.addEventListener('click', () => {
      window.open('https://www.quantum-climb.com/', '_blank');
    });
    
    // Fallback if logo fails to load
    qcLogo.onerror = () => {
      qcLogo.style.display = 'none';
      poweredByText.textContent = 'Powered by Quantum Climb';
    };
    
    poweredBy.appendChild(poweredByText);
    poweredBy.appendChild(qcLogo);
    
    // Mobile: stack vertically
    if (this.detectMobile()) {
      footer.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        font-size: 10px;
        color: #99ccff;
        font-family: 'Space Mono', monospace;
        opacity: 0.8;
        z-index: 1001;
        pointer-events: none;
        text-align: center;
      `;
    }
    
    footer.appendChild(copyright);
    footer.appendChild(poweredBy);
    document.body.appendChild(footer);
  }

  /**
   * Hide advanced visual layers but keep starfield visible for minimal experience
   */
  hideAdvancedLayers() {
    // Keep starfield visible - it's part of the minimal experience
    this.starfield.setVisibility(true);
    
    // Hide other advanced layers
    this.asciiTunnel.setVisibility(false);
    this.solarSystem.setVisibility(false);
    this.polygonEcho.setVisibility(false);
    
    // Hide the control panel
    const controlsDiv = document.getElementById('controls');
    if (controlsDiv) {
      controlsDiv.style.display = 'none';
    }
  }

  /**
   * Create minimal audio controls only
   */
  createMinimalControls() {
    // Check if controls already exist in DOM to prevent duplicates
    const existingControls = document.querySelector('.minimal-controls');
    if (existingControls) {
      console.log('📱 Minimal controls already exist in DOM, skipping creation');
      return;
    }
    
    // Add mobile-responsive CSS styles
    this.addMobileStyles();
    
    // Latest Gig button will be created separately
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'minimal-controls';
    controlsContainer.style.cssText = `
      position: fixed;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 9px;
      z-index: 1001;
      background: #111111;
      backdrop-filter: blur(10px);
      padding: 9px 14px;
      border-radius: 23px;
      border: 1px solid #333333;
      box-shadow: 
        0 0 23px rgba(153, 204, 255, 0.2),
        5px 5px 9px rgba(0, 0, 0, 0.5);
      max-width: 95vw;
    `;
    

    
    // Starfield toggle button
    const starfieldBtn = document.createElement('button');
    starfieldBtn.className = 'minimal-control-btn active';
    starfieldBtn.innerHTML = '✦';
    starfieldBtn.title = 'Toggle Starfield';
    starfieldBtn.style.cssText = `
      background: #99ccff;
      border: 1px solid #99ccff;
      color: #000000;
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    `;
    
    starfieldBtn.addEventListener('mouseenter', () => {
      if (starfieldBtn.classList.contains('active')) {
        starfieldBtn.style.backgroundColor = '#336699';
        starfieldBtn.style.color = '#ffffff';
      } else {
        starfieldBtn.style.backgroundColor = '#99ccff';
        starfieldBtn.style.color = '#000000';
      }
    });
    
    starfieldBtn.addEventListener('mouseleave', () => {
      if (starfieldBtn.classList.contains('active')) {
        starfieldBtn.style.backgroundColor = '#99ccff';
        starfieldBtn.style.color = '#000000';
      } else {
        starfieldBtn.style.backgroundColor = 'transparent';
        starfieldBtn.style.color = '#99ccff';
      }
    });
    
    starfieldBtn.addEventListener('click', () => {
      const isVisible = this.starfield.isVisible;
      this.starfield.setVisibility(!isVisible);
      if (!isVisible) {
        starfieldBtn.classList.add('active');
        starfieldBtn.innerHTML = '✦';
        starfieldBtn.style.backgroundColor = '#99ccff';
        starfieldBtn.style.color = '#000000';
      } else {
        starfieldBtn.classList.remove('active');
        starfieldBtn.innerHTML = '☆';
        starfieldBtn.style.backgroundColor = 'transparent';
        starfieldBtn.style.color = '#99ccff';
      }
    });

    // ASCII Tunnel toggle button
    const asciiBtn = document.createElement('button');
    asciiBtn.className = 'minimal-control-btn';
    asciiBtn.innerHTML = 'Ω';
    asciiBtn.title = 'Toggle ASCII Tunnel';
    asciiBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    `;
    
    asciiBtn.addEventListener('mouseenter', () => {
      if (asciiBtn.classList.contains('active')) {
        asciiBtn.style.backgroundColor = '#336699';
        asciiBtn.style.color = '#ffffff';
      } else {
        asciiBtn.style.backgroundColor = '#99ccff';
        asciiBtn.style.color = '#000000';
      }
    });
    
    asciiBtn.addEventListener('mouseleave', () => {
      if (asciiBtn.classList.contains('active')) {
        asciiBtn.style.backgroundColor = '#99ccff';
        asciiBtn.style.color = '#000000';
      } else {
        asciiBtn.style.backgroundColor = 'transparent';
        asciiBtn.style.color = '#99ccff';
      }
    });
    
    asciiBtn.addEventListener('click', () => {
      const isVisible = this.asciiTunnel.isVisible;
      this.asciiTunnel.setVisibility(!isVisible);
      if (!isVisible) {
        asciiBtn.classList.add('active');
        asciiBtn.innerHTML = 'Ω';
        asciiBtn.style.backgroundColor = '#99ccff';
        asciiBtn.style.color = '#000000';
      } else {
        asciiBtn.classList.remove('active');
        asciiBtn.innerHTML = 'Ω';
        asciiBtn.style.backgroundColor = 'transparent';
        asciiBtn.style.color = '#99ccff';
      }
    });

    // Solar System toggle button
    const solarBtn = document.createElement('button');
    solarBtn.className = 'minimal-control-btn';
    solarBtn.innerHTML = '☉';
    solarBtn.title = 'Toggle Solar System';
    solarBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    `;
    
    solarBtn.addEventListener('mouseenter', () => {
      if (solarBtn.classList.contains('active')) {
        solarBtn.style.backgroundColor = '#336699';
        solarBtn.style.color = '#ffffff';
      } else {
        solarBtn.style.backgroundColor = '#99ccff';
        solarBtn.style.color = '#000000';
      }
    });
    
    solarBtn.addEventListener('mouseleave', () => {
      if (solarBtn.classList.contains('active')) {
        solarBtn.style.backgroundColor = '#99ccff';
        solarBtn.style.color = '#000000';
      } else {
        solarBtn.style.backgroundColor = 'transparent';
        solarBtn.style.color = '#99ccff';
      }
    });
    
    solarBtn.addEventListener('click', () => {
      const isVisible = this.solarSystem.element.style.display !== 'none';
      this.solarSystem.onVisibilityChange(!isVisible);
      if (!isVisible) {
        solarBtn.classList.add('active');
        solarBtn.innerHTML = '☉';
        solarBtn.style.backgroundColor = '#99ccff';
        solarBtn.style.color = '#000000';
      } else {
        solarBtn.classList.remove('active');
        solarBtn.innerHTML = '☉';
        solarBtn.style.backgroundColor = 'transparent';
        solarBtn.style.color = '#99ccff';
      }
    });
    
    // Polygon Echo toggle button
    const polygonBtn = document.createElement('button');
    polygonBtn.className = 'minimal-control-btn';
    polygonBtn.innerHTML = '⬟';
    polygonBtn.title = 'Toggle Polygon Echo';
    polygonBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    `;
    
    polygonBtn.addEventListener('mouseenter', () => {
      if (polygonBtn.classList.contains('active')) {
        polygonBtn.style.backgroundColor = '#336699';
        polygonBtn.style.color = '#ffffff';
      } else {
        polygonBtn.style.backgroundColor = '#99ccff';
        polygonBtn.style.color = '#000000';
      }
    });
    
    polygonBtn.addEventListener('mouseleave', () => {
      if (polygonBtn.classList.contains('active')) {
        polygonBtn.style.backgroundColor = '#99ccff';
        polygonBtn.style.color = '#000000';
      } else {
        polygonBtn.style.backgroundColor = 'transparent';
        polygonBtn.style.color = '#99ccff';
      }
    });
    
    polygonBtn.addEventListener('click', () => {
      const isVisible = this.polygonEcho.isVisible;
      this.polygonEcho.setVisibility(!isVisible);
      if (!isVisible) {
        polygonBtn.classList.add('active');
        polygonBtn.innerHTML = '⬟';
        polygonBtn.style.backgroundColor = '#99ccff';
        polygonBtn.style.color = '#000000';
      } else {
        polygonBtn.classList.remove('active');
        polygonBtn.innerHTML = '⬟';
        polygonBtn.style.backgroundColor = 'transparent';
        polygonBtn.style.color = '#99ccff';
      }
    });

    // Theme toggle button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'minimal-control-btn';
    themeBtn.innerHTML = '<img src="./public/ascii/D.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" alt="Random Colors">';
    themeBtn.title = 'Dark Theme - Click for random colors';
    
    // Function to update button appearance based on current theme
    const updateButtonAppearance = () => {
      const currentTheme = this.themeManager.getCurrentTheme();
      const palette = this.themeManager.getCurrentPalette();
      const img = themeBtn.querySelector('img');
      
      if (currentTheme === 'random') {
        // Use accent1 color as background when in random theme
        themeBtn.style.background = palette.accent1;
        themeBtn.style.color = '#000000';
        themeBtn.style.border = `1px solid ${palette.accent1}`;
        themeBtn.title = `Random Theme (${this.themeManager.getCurrentStrategy()}) - Click for new colors`;
        // Update image filter for better contrast
        if (img) img.style.filter = 'brightness(0) invert(0)';
      } else {
        // Default dark theme appearance
        themeBtn.style.background = 'transparent';
        themeBtn.style.color = '#99ccff';
        themeBtn.style.border = '1px solid #99ccff';
        themeBtn.title = 'Dark Theme - Click for random colors';
        // Update image filter for better contrast
        if (img) img.style.filter = 'brightness(0) invert(1)';
      }
    };
    
    themeBtn.style.cssText = `
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    `;
    
    // Set initial appearance
    updateButtonAppearance();
    
    themeBtn.addEventListener('mouseenter', () => {
      const currentTheme = this.themeManager.getCurrentTheme();
      if (currentTheme === 'random') {
        // Darken the current color on hover
        const palette = this.themeManager.getCurrentPalette();
        themeBtn.style.backgroundColor = palette.accent2 || palette.accent3;
        // Update image filter for better contrast
        const img = themeBtn.querySelector('img');
        if (img) img.style.filter = 'brightness(0) invert(1)';
      } else {
        themeBtn.style.backgroundColor = '#99ccff';
        themeBtn.style.color = '#000000';
        // Update image filter for better contrast
        const img = themeBtn.querySelector('img');
        if (img) img.style.filter = 'brightness(0) invert(0)';
      }
    });
    
    themeBtn.addEventListener('mouseleave', () => {
      // Restore the current theme appearance
      updateButtonAppearance();
    });
    
    themeBtn.addEventListener('click', () => {
      const currentTheme = this.themeManager.getCurrentTheme();
      
      if (currentTheme === 'random') {
        // If already in random theme, generate new colors
        this.themeManager.forceNewRandomTheme();
        console.log('🎨 New random colors generated');
        
        // Also randomize polygon echo if it's visible
        if (this.polygonEcho && this.polygonEcho.isVisible) {
          this.polygonEcho.randomize();
          console.log('⬟ Polygon echo also randomized!');
        }
      } else {
        // Switch to random theme
        this.themeManager.cycleTheme();
      }
      
      // Update button appearance after theme change
      updateButtonAppearance();
    });

    // Double-click to cycle through color strategies when in random mode
    themeBtn.addEventListener('dblclick', () => {
      if (this.themeManager.getCurrentTheme() === 'random') {
        // Force a new strategy
        this.themeManager.forceNewRandomTheme();
        console.log('🎨 New color strategy: ' + this.themeManager.getCurrentStrategy());
        
        // Update button appearance after strategy change
        updateButtonAppearance();
      }
    });
    

    

    controlsContainer.appendChild(starfieldBtn);
    
    // Agent System toggle button
    const agentToggleBtn = document.createElement('button');
    agentToggleBtn.className = 'minimal-control-btn';
    agentToggleBtn.title = 'Toggle Agent System';
    agentToggleBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 41px;
      height: 41px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
      flex-shrink: 0;
    `;
    
    // Load and set A.svg as button content
    fetch('public/ascii/A.svg')
      .then(response => response.text())
      .then(svgText => {
        agentToggleBtn.innerHTML = svgText;
        // Style the SVG to match the button theme
        const svg = agentToggleBtn.querySelector('svg');
        if (svg) {
          svg.style.width = '20px';
          svg.style.height = '20px';
          svg.style.fill = 'none';
          svg.style.stroke = '#99ccff';
          svg.style.strokeWidth = '2px';
        }
      })
      .catch(error => {
        console.warn('Failed to load A.svg, using fallback text');
        agentToggleBtn.innerHTML = 'A';
      });
    
    agentToggleBtn.addEventListener('click', () => {
      const isVisible = this.agentSystem.toggleVisibility();
      agentToggleBtn.style.background = isVisible ? '#99ccff' : 'transparent';
      agentToggleBtn.style.color = isVisible ? '#000000' : '#99ccff';
      
      // Update SVG stroke color
      const svg = agentToggleBtn.querySelector('svg');
      if (svg) {
        svg.style.stroke = isVisible ? '#000000' : '#99ccff';
      }
    });
    
    controlsContainer.appendChild(agentToggleBtn);
    controlsContainer.appendChild(asciiBtn);
    controlsContainer.appendChild(solarBtn);
    controlsContainer.appendChild(polygonBtn);
    controlsContainer.appendChild(themeBtn);
    
    document.body.appendChild(controlsContainer);
    this.minimalControls = controlsContainer;
    
    // Create separate containers for QR code and agent controls
    this.createAgentControlsContainer();
  }

  /**
   * Global cleanup to remove buttons from any app version
   */
  globalCleanup() {
    console.log('🌍 Global cleanup: Removing all latest gig buttons...');
    
    // Remove all latest gig buttons from DOM regardless of which app created them
    const allButtons = document.querySelectorAll('.latest-gig-button');
    console.log(`🗑️ Found ${allButtons.length} buttons to remove globally`);
    
    allButtons.forEach((button, index) => {
      console.log(`🗑️ Globally removing button ${index + 1}:`, button);
      if (button.parentNode) {
        button.parentNode.removeChild(button);
      }
    });
    
    // Clear any global references
    if (window.omnivoidApp) {
      window.omnivoidApp.latestGigButton = null;
    }
    
    // Verify global cleanup
    const remainingButtons = document.querySelectorAll('.latest-gig-button');
    console.log(`✅ Global cleanup completed. Remaining buttons: ${remainingButtons.length}`);
  }

  /**
   * Create Latest Gig button above minimal controls
   */
  createLatestGigButton() {
    console.log('🔍 DEBUG: createLatestGigButton() called');
    console.log('🔍 DEBUG: Stack trace:', new Error().stack);
    
    // Check if button already exists in DOM to prevent duplicates
    const existingButton = document.querySelector('.latest-gig-button');
    if (existingButton) {
      console.log('🎵 Latest Gig button already exists in DOM, skipping creation');
      console.log('🔍 DEBUG: Existing button found:', existingButton);
      return;
    }
    
    // Additional check: if this.latestGigButton exists, don't create another
    if (this.latestGigButton) {
      console.log('🎵 Latest Gig button already exists in instance, skipping creation');
      return;
    }
    
    console.log('🔍 DEBUG: Creating new Latest Gig button...');
    
    const gigButton = document.createElement('button');
    gigButton.className = 'latest-gig-button';
    gigButton.innerHTML = '<img src="./public/ascii/V.svg" style="width: 20px; height: 20px; margin-right: 8px; filter: brightness(0) invert(1);" alt="Latest Rituals"> LATEST RITUALS';
    gigButton.title = 'View Latest Rituals';
    gigButton.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: -180px;
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
      gigButton.style.transform = 'translate(-50%, -50%) scale(1.05)';
      // Update image filter for better contrast on hover
      const img = gigButton.querySelector('img');
      if (img) img.style.filter = 'brightness(0) invert(0)';
    });

    gigButton.addEventListener('mouseleave', () => {
      gigButton.style.backgroundColor = '#111111';
      gigButton.style.color = '#99ccff';
      gigButton.style.transform = 'translate(-50%, -50%) scale(1)';
      // Restore image filter for normal state
      const img = gigButton.querySelector('img');
      if (img) img.style.filter = 'brightness(0) invert(1)';
    });

    // Click handler to open gigs content
    gigButton.addEventListener('click', () => {
      console.log('🎵 Latest Gig button clicked');
      
      // Create gigs content if it doesn't exist
      if (!this.retroWindows['latest-gig']) {
        this.retroWindows['latest-gig'] = new RetroWindow('latest-gig', 'LATEST RITUALS', this.createGigsContent(), null);
      }
      
      // Open the gigs window
      this.retroWindows['latest-gig'].show();
    });

    document.body.appendChild(gigButton);
    this.latestGigButton = gigButton;
    
    console.log('🔍 DEBUG: Latest Gig button created and added to DOM');
    console.log('🔍 DEBUG: Button element:', gigButton);
    console.log('🔍 DEBUG: Total buttons with class "latest-gig-button":', document.querySelectorAll('.latest-gig-button').length);
  }

  /**
   * Create agent controls container (left side)
   */
  createAgentControlsContainer() {
    const agentContainer = document.createElement('div');
    agentContainer.className = 'agent-controls-container';
    agentContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 20px;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      z-index: 1001;
      background: #111111;
      backdrop-filter: blur(10px);
      padding: 12px 8px;
      border-radius: 15px;
      border: 1px solid #333333;
      box-shadow: 
        0 0 20px rgba(153, 204, 255, 0.2),
        4px 4px 8px rgba(0, 0, 0, 0.5);
    `;

    // Agent Count Controls - Vertical Layout
    const agentCountContainer = document.createElement('div');
    agentCountContainer.className = 'dial-container';
    agentCountContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    `;
    
    const agentCountLabel = document.createElement('label');
    agentCountLabel.innerHTML = '<img src="./public/ascii/A.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" alt="Agents">';
    agentCountLabel.title = 'Agent Count';
    agentCountLabel.style.cssText = `
      font-size: 16px;
      color: #99ccff;
      font-family: 'Space Mono', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    
    const agentCountUpBtn = document.createElement('button');
    agentCountUpBtn.innerHTML = '+';
    agentCountUpBtn.className = 'agent-btn';
    agentCountUpBtn.title = 'More Agents';
    agentCountUpBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
    `;
    
    const agentCountDisplay = document.createElement('div');
    agentCountDisplay.className = 'agent-count-display';
    agentCountDisplay.style.cssText = `
      color: #99ccff;
      font-size: 12px;
      font-family: 'Space Mono', monospace;
      text-align: center;
      min-width: 28px;
    `;
    
    const agentCountDownBtn = document.createElement('button');
    agentCountDownBtn.innerHTML = '−';
    agentCountDownBtn.className = 'agent-btn';
    agentCountDownBtn.title = 'Fewer Agents';
    agentCountDownBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
    `;
    
    // Initialize agent count
    let currentAgentCount = 120;
    agentCountDisplay.textContent = currentAgentCount;
    
    // Agent count button hover effects
    [agentCountUpBtn, agentCountDownBtn].forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#99ccff';
        btn.style.color = '#000000';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#99ccff';
      });
    });
    
    // Agent count control logic
    agentCountUpBtn.addEventListener('click', () => {
      const maxAgents = this.isMobile ? 100 : 200;
      currentAgentCount = Math.min(maxAgents, currentAgentCount + 10);
      this.agentSystem.setAgentCount(currentAgentCount);
      agentCountDisplay.textContent = currentAgentCount;
    });
    
    agentCountDownBtn.addEventListener('click', () => {
      const minAgents = this.isMobile ? 20 : 50;
      currentAgentCount = Math.max(minAgents, currentAgentCount - 10);
      this.agentSystem.setAgentCount(currentAgentCount);
      agentCountDisplay.textContent = currentAgentCount;
    });
    
    // Vertical layout: Icon, +, Count, -
    agentCountContainer.appendChild(agentCountLabel);
    agentCountContainer.appendChild(agentCountUpBtn);
    agentCountContainer.appendChild(agentCountDisplay);
    agentCountContainer.appendChild(agentCountDownBtn);

    // Connection Distance Controls - Vertical Layout
    const connectionContainer = document.createElement('div');
    connectionContainer.className = 'dial-container';
    connectionContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    `;
    
    const connectionLabel = document.createElement('label');
    connectionLabel.innerHTML = '🔗';
    connectionLabel.title = 'Connection Distance';
    connectionLabel.style.cssText = `
      font-size: 16px;
      color: #99ccff;
      font-family: 'Space Mono', monospace;
    `;
    
    const connectionUpBtn = document.createElement('button');
    connectionUpBtn.innerHTML = '+';
    connectionUpBtn.className = 'agent-btn';
    connectionUpBtn.title = 'Increase Distance';
    connectionUpBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
    `;
    
    const connectionDisplay = document.createElement('div');
    connectionDisplay.className = 'connection-display';
    connectionDisplay.style.cssText = `
      color: #99ccff;
      font-size: 12px;
      font-family: 'Space Mono', monospace;
      text-align: center;
      min-width: 28px;
    `;
    
    const connectionDownBtn = document.createElement('button');
    connectionDownBtn.innerHTML = '−';
    connectionDownBtn.className = 'agent-btn';
    connectionDownBtn.title = 'Decrease Distance';
    connectionDownBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
    `;
    
    // Initialize connection distance
    let currentConnectionDistance = 200;
    connectionDisplay.textContent = currentConnectionDistance;
    
    // Connection distance button hover effects
    [connectionUpBtn, connectionDownBtn].forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#99ccff';
        btn.style.color = '#000000';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#99ccff';
      });
    });
    
    // Connection distance control logic
    connectionUpBtn.addEventListener('click', () => {
      const maxDistance = this.isMobile ? 60 : 300;
      currentConnectionDistance = Math.min(maxDistance, currentConnectionDistance + 10);
      this.agentSystem.setConnectDistance(currentConnectionDistance);
      connectionDisplay.textContent = currentConnectionDistance;
    });
    
    connectionDownBtn.addEventListener('click', () => {
      const minDistance = this.isMobile ? 20 : 100;
      currentConnectionDistance = Math.max(minDistance, currentConnectionDistance - 10);
      this.agentSystem.setConnectDistance(currentConnectionDistance);
      connectionDisplay.textContent = currentConnectionDistance;
    });
    
    // Vertical layout: Icon, +, Count, -
    connectionContainer.appendChild(connectionLabel);
    connectionContainer.appendChild(connectionUpBtn);
    connectionContainer.appendChild(connectionDisplay);
    connectionContainer.appendChild(connectionDownBtn);
    
    agentContainer.appendChild(agentCountContainer);
    agentContainer.appendChild(connectionContainer);
    
    document.body.appendChild(agentContainer);
    this.agentContainer = agentContainer;
  }

  /**
   * Add mobile-responsive CSS styles
   */
  addMobileStyles() {
    if (document.querySelector('#mobile-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'mobile-styles';
    style.textContent = `
      /* Mobile-first responsive styles */
      @media (max-width: 768px) {
        /* Minimal controls mobile layout */
        .minimal-controls {
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 6px 8px !important;
          bottom: 50px !important;
          max-width: 90vw !important;
        }
        
        .minimal-control-btn {
          width: 32px !important;
          height: 32px !important;
          font-size: 12px !important;
        }
        
        /* QR Code container mobile */
        .qr-code-container {
          bottom: 10px !important;
          right: 10px !important;
          padding: 8px 6px !important;
          gap: 6px !important;
        }
        
        .qr-code-container img {
          width: 50px !important;
          height: 50px !important;
        }
        
        /* Agent controls container mobile */
        .agent-controls-container {
          bottom: 10px !important;
          left: 10px !important;
          padding: 12px 8px !important;
          gap: 12px !important;
        }
        
        .dial-container {
          gap: 6px !important;
        }
        
        .agent-btn {
          width: 28px !important;
          height: 28px !important;
          font-size: 14px !important;
        }
        
        .agent-count-display,
        .connection-display {
          font-size: 12px !important;
          min-width: 28px !important;
        }
        
        /* Radio Controls - Small Mobile */
        .radio-control-btn {
          padding: 4px 8px !important;
          font-size: 10px !important;
          min-width: 32px !important;
        }
        
        #track-progress {
          height: 4px !important;
        }
        
        #radio-status {
          font-size: 8px !important;
        }
        
        .file-item {
          padding: 4px 3px !important;
          font-size: 8px !important;
        }
        
        /* Hamburger button mobile */
        .hamburger-toggle {
          width: 40px !important;
          height: 40px !important;
          top: 15px !important;
          right: 15px !important;
          font-size: 16px !important;
        }
        
        /* Floating menu mobile */
        .floating-menu-item {
          padding: 8px 12px !important;
          font-size: 12px !important;
          border-radius: 15px !important;
        }
        
        /* RetroWindow mobile styles - 25% smaller */
        .retro-window {
          width: 71.25vw !important; /* 95vw * 0.75 */
          max-width: 71.25vw !important;
          height: 63.75vh !important; /* 85vh * 0.75 */
          max-height: 63.75vh !important;
          top: 18.125vh !important; /* Centered vertically */
          left: 14.375vw !important; /* Centered horizontally */
          transform: none !important;
        }
        
        .retro-window .window-header {
          padding: 6px 8px !important;
          font-size: 11px !important;
        }
        
        .retro-window .window-content {
          padding: 8px !important;
          font-size: 10px !important;
          line-height: 1.3 !important;
        }
        
        .retro-window .close-btn {
          width: 20px !important;
          height: 20px !important;
          font-size: 12px !important;
        }
        
        /* Gallery mobile styles */
        #gallery-thumbnails {
          grid-template-columns: repeat(2, 1fr) !important;
          max-height: 160px !important;
        }
        
        .gallery-thumbnail {
          min-height: 50px !important;
        }
        
        .gallery-thumbnail img {
          max-height: 50px !important;
        }
        
        .gallery-thumbnail div {
          font-size: 6px !important;
          padding: 1px 2px !important;
        }
        
        /* Document thumbnails mobile */
        .doc-thumbnail {
          width: 45px !important; /* 25% smaller */
          height: 60px !important; /* 25% smaller */
          margin: 2px !important;
          padding: 2px !important;
        }
        
        .doc-thumbnail div:last-child {
          font-size: 6px !important;
        }
        
        /* Radio file explorer mobile */
        .file-item {
          padding: 6px 4px !important;
          font-size: 9px !important;
        }
        
        /* Popup mobile styles - 25% smaller */
        .gallery-popup-content,
        .document-popup-content {
          width: 71.25vw !important; /* 95vw * 0.75 */
          height: 67.5vh !important; /* 90vh * 0.75 */
          max-width: 71.25vw !important;
          border-radius: 4px !important;
        }
        
        .gallery-popup-content .retro-window .window-header,
        .document-popup-content > div:first-child {
          padding: 8px 10px !important;
          font-size: 12px !important;
        }
        
        .gallery-popup-content img {
          max-height: 37.5vh !important; /* 50vh * 0.75 */
        }
        
        .document-popup-content pre {
          font-size: 10px !important;
          line-height: 1.4 !important;
        }
        
        /* Range slider mobile styles */
        input[type="range"]::-webkit-slider-thumb {
          width: 14px !important;
          height: 14px !important;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 14px !important;
          height: 14px !important;
        }
        
        /* Radio Controls */
        .radio-controls {
          display: flex !important;
          justify-content: center !important;
          gap: 8px !important;
          margin: 8px 0 !important;
        }
        
        .radio-control-btn {
          background: #f0f0f0 !important;
          border: 1px outset #c0c0c0 !important;
          padding: 6px 10px !important;
          font-size: 12px !important;
          cursor: pointer !important;
          font-family: 'Space Mono', monospace !important;
          min-width: 40px !important;
          transition: all 0.2s !important;
          border-radius: 3px !important;
        }
        
        .radio-control-btn:hover {
          background: #e0e0e0 !important;
        }
        
        .radio-control-btn:active {
          border: 1px inset #c0c0c0 !important;
        }
        
        .shuffle-btn.active {
          background: #0a246a !important;
          color: white !important;
        }
        
        #track-progress {
          margin-top: 6px !important;
          height: 6px !important;
          background: #ddd !important;
          border: 1px inset #c0c0c0 !important;
          border-radius: 3px !important;
        }
        
        #progress-bar {
          height: 100% !important;
          background: linear-gradient(90deg, #0a246a, #336699) !important;
          border-radius: 2px !important;
          transition: width 0.3s ease !important;
        }
        
        #radio-status {
          margin-top: 6px !important;
          color: #666 !important;
          font-size: 10px !important;
          text-align: center !important;
        }

        /* File item enhancements */
        .file-item {
          transition: all 0.2s !important;
          border-radius: 2px !important;
        }
        
        .file-item:hover {
          transform: translateX(2px) !important;
          box-shadow: 2px 2px 4px rgba(0,0,0,0.1) !important;
        }
      }
      
      /* Small mobile devices */
      @media (max-width: 480px) {
        .minimal-controls {
          gap: 4px !important;
          padding: 4px 6px !important;
          max-width: 95vw !important;
        }
        
        .minimal-control-btn {
          width: 28px !important;
          height: 28px !important;
          font-size: 10px !important;
        }
        
        .qr-code-container {
          padding: 6px 4px !important;
          gap: 4px !important;
        }
        
        .qr-code-container img {
          width: 45px !important;
          height: 45px !important;
        }
        
        .agent-controls-container {
          padding: 6px 4px !important;
          gap: 6px !important;
        }
        
        .agent-btn {
          width: 20px !important;
          height: 20px !important;
          font-size: 8px !important;
        }
        
        .agent-count-display,
        .connection-display {
          font-size: 6px !important;
          min-width: 18px !important;
        }
        
        .hamburger-toggle {
          width: 35px !important;
          height: 35px !important;
          font-size: 14px !important;
        }
        
        .floating-menu-item {
          padding: 6px 10px !important;
          font-size: 11px !important;
        }
        
        /* RetroWindow small mobile - 25% smaller */
        .retro-window {
          width: 73.5vw !important; /* 98vw * 0.75 */
          height: 67.5vh !important; /* 90vh * 0.75 */
          top: 16.25vh !important;
          left: 13.25vw !important;
        }
        
        #gallery-thumbnails {
          grid-template-columns: repeat(2, 1fr) !important;
          max-height: 120px !important;
        }
        
        .gallery-thumbnail img {
          height: 25px !important;
        }
        
        .doc-thumbnail {
          width: 37.5px !important; /* 50px * 0.75 */
          height: 52.5px !important; /* 70px * 0.75 */
        }
        
        /* Popup small mobile - 25% smaller */
        .gallery-popup-content,
        .document-popup-content {
          width: 73.5vw !important;
          height: 67.5vh !important;
        }
        
        .gallery-popup-content img {
          max-height: 30vh !important;
        }
      }
      
      /* Touch-friendly interactions */
      @media (hover: none) and (pointer: coarse) {
        .minimal-control-btn,
        .hamburger-toggle,
        .floating-menu-item,
        .gallery-thumbnail,
        .doc-thumbnail,
        .file-item,
        .qr-code-container,
        .agent-controls-container {
          touch-action: manipulation;
        }
        
        /* Remove hover effects on touch devices */
        .minimal-control-btn:hover,
        .hamburger-toggle:hover,
        .floating-menu-item:hover {
          background: inherit !important;
          color: inherit !important;
          transform: none !important;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Create ASCIIVOID button positioned in top-left corner
   */
  createAsciiVoidButton() {
    // Check if button already exists
    if (this.asciiVoidButton) {
      console.log('🎨 ASCIIVOID button already exists');
      return;
    }

    console.log('🎨 Creating ASCIIVOID button...');

    // Create the button element
    this.asciiVoidButton = document.createElement('button');
    this.asciiVoidButton.className = 'asciivoid-button';
    this.asciiVoidButton.textContent = 'ASCIIVOID';
    
    // Top-left positioning - safe from all other elements
    this.asciiVoidButton.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: #00FF22;
      color: #000000;
      border: 2px solid #00FF22;
      padding: 10px 18px;
      font-size: 12px;
      font-weight: bold;
      font-family: 'Space Mono', monospace;
      cursor: pointer;
      z-index: 1002;
      border-radius: 4px;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
      box-shadow: 
        0 0 20px rgba(0, 255, 34, 0.3),
        4px 4px 8px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    `;

    // Add hover effects
    this.asciiVoidButton.addEventListener('mouseenter', () => {
      this.asciiVoidButton.style.backgroundColor = '#00CC1B';
      this.asciiVoidButton.style.borderColor = '#00CC1B';
      this.asciiVoidButton.style.transform = 'scale(1.05)';
      this.asciiVoidButton.style.boxShadow = `
        0 0 30px rgba(0, 255, 34, 0.5),
        6px 6px 12px rgba(0, 0, 0, 0.6)
      `;
    });

    this.asciiVoidButton.addEventListener('mouseleave', () => {
      this.asciiVoidButton.style.backgroundColor = '#00FF22';
      this.asciiVoidButton.style.borderColor = '#00FF22';
      this.asciiVoidButton.style.transform = 'scale(1)';
      this.asciiVoidButton.style.boxShadow = `
        0 0 20px rgba(0, 255, 34, 0.3),
        4px 4px 8px rgba(0, 0, 0, 0.5)
      `;
    });

    // Add click handler
    this.asciiVoidButton.addEventListener('click', () => {
      console.log('🎨 ASCIIVOID button clicked');
      if (!this.asciiWindow) {
        this.asciiWindow = new AsciiWindow();
      }
      this.asciiWindow.toggle();
    });

    // Add to document
    document.body.appendChild(this.asciiVoidButton);
    
    console.log('✅ ASCIIVOID button created in top-left corner');
  }

  /**
   * Position ASCIIVOID button between logo bottom and minimal controls top
   */
  positionAsciiVoidButton() {
    if (!this.asciiVoidButton) return;

    // Wait for elements to be rendered
    requestAnimationFrame(() => {
      const logoContainer = document.querySelector('.logo-container');
      const minimalControls = document.querySelector('.minimal-controls');
      
      if (logoContainer && minimalControls) {
        const logoRect = logoContainer.getBoundingClientRect();
        const controlsRect = minimalControls.getBoundingClientRect();
        
        // Calculate position halfway between logo bottom and controls top
        const logoBottom = logoRect.bottom;
        const controlsTop = controlsRect.top;
        const buttonTop = logoBottom + ((controlsTop - logoBottom) / 2) - 20; // -20 for button height/2
        
        this.asciiVoidButton.style.top = `${buttonTop}px`;
        
        console.log(`🎨 ASCIIVOID button positioned at ${buttonTop}px (logo bottom: ${logoBottom}, controls top: ${controlsTop})`);
      } else {
        // Fallback positioning if elements not ready
        this.asciiVoidButton.style.top = '60%';
        console.log('🎨 ASCIIVOID button positioned at fallback 60%');
      }
    });
  }

  /**
   * Create floating menu system with hamburger toggle
   */
  createFloatingMenu() {
    // Create hamburger toggle button
    const hamburgerBtn = document.createElement('button');
    hamburgerBtn.className = 'hamburger-toggle';
    hamburgerBtn.innerHTML = '☰'; // Hamburger icon
    hamburgerBtn.title = 'Toggle Menu';
    hamburgerBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 45px;
      height: 45px;
      background: #111111;
      border: 1px solid #99ccff;
      border-radius: 50%;
      color: #99ccff;
      font-size: 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: all 0.3s ease;
      
      font-family: 'Space Mono', monospace;
      box-shadow: 
        0 0 15px rgba(153, 204, 255, 0.2),
        2px 2px 4px rgba(0, 0, 0, 0.5);
    `;

    // Add hover effects for hamburger button
    hamburgerBtn.addEventListener('mouseenter', () => {
      hamburgerBtn.style.backgroundColor = '#99ccff';
      hamburgerBtn.style.color = '#000000';
      hamburgerBtn.style.boxShadow = '0 0 25px rgba(153, 204, 255, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.5)';
    });

    hamburgerBtn.addEventListener('mouseleave', () => {
      hamburgerBtn.style.backgroundColor = '#111111';
      hamburgerBtn.style.color = '#99ccff';
      hamburgerBtn.style.boxShadow = '0 0 15px rgba(153, 204, 255, 0.2), 2px 2px 4px rgba(0, 0, 0, 0.5)';
    });

    // Create dropdown menu container
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.style.cssText = `
      position: fixed;
      top: 80px;
      right: 30px;
      width: 70px;
      background: transparent;
      border: none;
      border-radius: 10px;
      z-index: 1002;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      padding: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // Menu items with custom icons
    const menuItems = [
      { text: 'Conundrum', icon: './public/menuicons/conundrum.png', window: 'conundrum', isImage: true },
      { text: 'Live Transmissions', icon: './public/menuicons/livetransmissions.png', window: 'live', isImage: true },
      { text: 'Labs', icon: './public/ascii/WORM.svg', window: 'labs', isImage: true },
      { text: 'Radio', icon: './public/menuicons/radio.png', window: 'radio', isImage: true },
      { text: 'Research Papers', icon: './public/menuicons/research.png', window: 'releases', isImage: true },
      { text: 'Archives', icon: './public/menuicons/gallery.png', window: 'gallery', isImage: true },
      { text: 'Contact', icon: './public/menuicons/contact.png', window: 'contact', isImage: true },
    ];

    // Create retro windows for each menu item
    this.retroWindows = {};
    menuItems.forEach(item => {
      console.log(`🪟 Creating RetroWindow for: ${item.text} (${item.window})`);
      const windowContent = this.getWindowContent(item.window);
      console.log(`📄 Content length for ${item.window}: ${windowContent.length}`);
      
      // Create onClose callback for radio window
      const onCloseCallback = item.window === 'radio' ? (windowId) => {
        console.log(`🎵 Radio window closed: ${windowId}`);
        this.stopMixcloudAudio();
      } : null;

      this.retroWindows[item.window] = new RetroWindow(
        `${item.window}-window`,
        `${item.text.toUpperCase()}`,
        windowContent,
        onCloseCallback
      );
      
      console.log(`✅ RetroWindow created for: ${item.window}`);
    });

    // Create dropdown menu items
    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'dropdown-menu-item';
      
      // Check if desktop
      const isDesktop = window.innerWidth >= 768;
      
      // Show custom icons or fallback to text
      if (item.isImage) {
        const iconImg = document.createElement('img');
        iconImg.src = item.icon;
        iconImg.alt = item.text;
        iconImg.style.cssText = `
          width: 24px;
          height: 24px;
          object-fit: contain;
        `;
        menuItem.appendChild(iconImg);
      } else {
        menuItem.innerHTML = `<span class="menu-icon">${item.icon}</span>`;
      }
      
      // Add tooltip on hover for all platforms
      menuItem.title = item.text;
      
      menuItem.style.cssText = `
        width: 45px;
        height: 45px;
        background: #111111;
        border: 1px solid #99ccff;
        border-radius: 50%;
        color: #99ccff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.3s ease;
        margin-bottom: 8px;
        
        font-family: 'Space Mono', monospace;
        box-shadow: 
          0 0 15px rgba(153, 204, 255, 0.2),
          2px 2px 4px rgba(0, 0, 0, 0.5);
        position: relative;
      `;

      // Add click handler to open retro window
      menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`🔘 Menu item clicked: ${item.text} (${item.window})`);
        console.log(`🪟 RetroWindow exists: ${!!this.retroWindows[item.window]}`);
        
        if (this.retroWindows[item.window]) {
          // Reset modal state to prevent positioning issues
          this.resetModalState();
          
          // Remove active state from all menu items
          document.querySelectorAll('.dropdown-menu-item').forEach(menuItemEl => {
            menuItemEl.classList.remove('active');
            menuItemEl.style.backgroundColor = '#111111';
            menuItemEl.style.color = '#99ccff';
          });
          
          // Add active state to clicked menu item
          menuItem.classList.add('active');
          menuItem.style.backgroundColor = '#99ccff';
          menuItem.style.color = '#000000';
          
          // For radio window, update content dynamically
          if (item.window === 'radio') {
            console.log('🎵 Updating radio window content dynamically');
            
            // Close any open YouTube modals before switching content
            this.closeAllYouTubeModals();
            
            const radioContent = this.getWindowContent('radio');
            console.log('🎵 Radio content length:', radioContent.length);
            this.retroWindows[item.window].setContent(radioContent);
            
            // Recreate Mixcloud iframe after content is set
            setTimeout(() => {
              this.recreateMixcloudIframe();
            }, 100);
          }
          
          // For live transmissions window, load content dynamically
          if (item.window === 'live') {
            console.log('📡 Updating live transmissions window content dynamically');
            
            // Close any open YouTube modals before switching content
            this.closeAllYouTubeModals();
            
            const liveContent = this.getWindowContent('live');
            this.retroWindows[item.window].setContent(liveContent);
            
            // Load live transmissions after a short delay to ensure DOM is ready
            setTimeout(() => {
              this.loadLiveTransmissions();
            }, 100);
          }
          
          console.log(`🔓 Showing window: ${item.window}`);
          this.retroWindows[item.window].show();
          
          // Keep dropdown menu visible for easy navigation
          // hideDropdown(); // Removed this line to keep menu open
        } else {
          console.error(`❌ RetroWindow not found for: ${item.window}`);
        }
      });

      // Add hover effects matching hamburger button
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#99ccff';
        menuItem.style.color = '#000000';
        menuItem.style.boxShadow = '0 0 25px rgba(153, 204, 255, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.5)';
        
        // Show custom tooltip
        this.showTooltip(menuItem, item.text);
      });

      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = '#111111';
        menuItem.style.color = '#99ccff';
        menuItem.style.boxShadow = '0 0 15px rgba(153, 204, 255, 0.2), 2px 2px 4px rgba(0, 0, 0, 0.5)';
        
        // Hide custom tooltip
        this.hideTooltip();
      });

      dropdownMenu.appendChild(menuItem);
    });

    // Dropdown toggle functions
    const showDropdown = () => {
      dropdownMenu.style.opacity = '1';
      dropdownMenu.style.visibility = 'visible';
      dropdownMenu.style.transform = 'translateY(0)';
    };

    const hideDropdown = () => {
      dropdownMenu.style.opacity = '0';
      dropdownMenu.style.visibility = 'hidden';
      dropdownMenu.style.transform = 'translateY(-10px)';
    };

    // Toggle functionality
    let isMenuVisible = false;
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isMenuVisible = !isMenuVisible;
      console.log(`🍔 Hamburger clicked, menu visible: ${isMenuVisible}`);
      
      if (isMenuVisible) {
        showDropdown();
        hamburgerBtn.innerHTML = '✕'; // X icon
        hamburgerBtn.style.transform = 'rotate(90deg)';
      } else {
        hideDropdown();
        hamburgerBtn.innerHTML = '☰'; // Hamburger icon
        hamburgerBtn.style.transform = 'rotate(0deg)';
      }
    });
    
    // Store the menu state for external access
    this.isMenuVisible = isMenuVisible;
    this.toggleMenu = () => {
      isMenuVisible = !isMenuVisible;
      if (isMenuVisible) {
        showDropdown();
        hamburgerBtn.innerHTML = '✕';
        hamburgerBtn.style.transform = 'rotate(90deg)';
      } else {
        hideDropdown();
        hamburgerBtn.innerHTML = '☰';
        hamburgerBtn.style.transform = 'rotate(0deg)';
      }
      this.isMenuVisible = isMenuVisible;
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        if (isMenuVisible) {
          isMenuVisible = false;
          hideDropdown();
          hamburgerBtn.innerHTML = '☰';
          hamburgerBtn.style.transform = 'rotate(0deg)';
        }
      }
    });

    document.body.appendChild(hamburgerBtn);
    document.body.appendChild(dropdownMenu);
    
    // Store references for responsive management
    this.hamburgerBtn = hamburgerBtn;
    this.dropdownMenu = dropdownMenu;
    this.floatingMenu = dropdownMenu; // Store for responsive management
    
    console.log('🍔 Floating menu created successfully:', {
      hamburgerBtn: this.hamburgerBtn,
      dropdownMenu: this.dropdownMenu,
      floatingMenu: this.floatingMenu
    });
    
    // Verify elements are in the DOM
    console.log('🍔 DOM verification:', {
      hamburgerBtnInDOM: document.body.contains(hamburgerBtn),
      dropdownMenuInDOM: document.body.contains(dropdownMenu),
      hamburgerBtnVisible: hamburgerBtn.offsetParent !== null,
      hamburgerBtnStyle: window.getComputedStyle(hamburgerBtn).display
    });
  }

  /**
   * Show custom tooltip for menu items
   */
  showTooltip(element, text) {
    // Remove existing tooltip if any
    this.hideTooltip();
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: #99ccff;
      padding: 8px 12px;
      border-radius: 6px;
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      white-space: nowrap;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease;
      border: 1px solid #99ccff;
      backdrop-filter: blur(10px);
    `;
    
    // Position tooltip to the left of the menu item
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left - 10) + 'px';
    tooltip.style.top = (rect.top + rect.height / 2) + 'px';
    tooltip.style.transform = 'translateX(-100%) translateY(-50%)';
    
    // Add to body
    document.body.appendChild(tooltip);
    
    // Animate in
    setTimeout(() => {
      tooltip.style.opacity = '1';
      tooltip.style.transform = 'translateX(-100%) translateY(-50%) translateY(0)';
    }, 10);
    
    // Store reference
    this.currentTooltip = tooltip;
  }

  /**
   * Hide custom tooltip
   */
  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  /**
   * Load live transmissions from the public folder and display YouTube videos
   */
  async loadLiveTransmissions() {
    try {
      console.log('📡 Loading live transmissions from public folder...');
      
      // Read the live_transmissions.txt file from the public/links folder
      const fileContent = await readPublicFile('./public/links/live_transmissions.txt?t=' + Date.now());
      
      if (!fileContent) {
        console.error('❌ Could not read live_transmissions.txt from public folder');
        this.updateLiveTransmissionsContainer('Error: Could not load transmissions file');
        return;
      }

      console.log('📡 File content loaded:', fileContent.substring(0, 100) + '...');

      // Parse YouTube URLs from the file
      const youtubeUrls = this.parseYouTubeUrls(fileContent);
      console.log(`📡 Found ${youtubeUrls.length} YouTube URLs`);

      if (youtubeUrls.length === 0) {
        this.updateLiveTransmissionsContainer('No YouTube transmissions found');
        return;
      }

      // Fetch video metadata for each URL
      const videos = await this.fetchYouTubeMetadata(youtubeUrls);
      
      // Display the videos
      this.displayLiveTransmissions(videos);
      
    } catch (error) {
      console.error('❌ Error loading live transmissions:', error);
      this.updateLiveTransmissionsContainer('Error loading transmissions');
    }
  }

  /**
   * Parse YouTube URLs from text content
   */
  parseYouTubeUrls(content) {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
    const urls = [];
    let match;
    
    while ((match = youtubeRegex.exec(content)) !== null) {
      urls.push(match[1]); // Extract video ID
    }
    
    return urls;
  }

  /**
   * Fetch YouTube video metadata using oEmbed API
   */
  async fetchYouTubeMetadata(videoIds) {
    const videos = [];
    
    for (const videoId of videoIds) {
      try {
        // Use YouTube oEmbed API to get video title
        const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
        
        const response = await fetch(oEmbedUrl);
        if (response.ok) {
          const data = await response.json();
          const video = {
            id: videoId,
            title: data.title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${videoId}`
          };
          videos.push(video);
        } else {
          // Fallback if oEmbed fails
          const video = {
            id: videoId,
            title: `Live Transmission ${videoIds.indexOf(videoId) + 1}`,
            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${videoId}`
          };
          videos.push(video);
        }
      } catch (error) {
        console.error(`❌ Error fetching metadata for video ${videoId}:`, error);
        // Fallback on error
        const video = {
          id: videoId,
          title: `Live Transmission ${videoIds.indexOf(videoId) + 1}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`
        };
        videos.push(video);
      }
    }
    
    return videos;
  }

  /**
   * Display live transmissions in the container
   */
  displayLiveTransmissions(videos) {
    const container = document.getElementById('live-transmissions-container');
    if (!container) return;

    // Sort videos by publication date (newest first)
    const sortedVideos = videos.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB - dateA; // Newest first
    });

    const videosHtml = sortedVideos.map(video => `
      <div class="transmission-item" data-video-id="${video.id}" style="
        margin-bottom: 12px;
        padding: 8px;
        border: 1px solid #333333;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${video.thumbnail}" alt="${video.title}" style="
            width: 60px;
            height: 45px;
            border-radius: 4px;
            object-fit: cover;
          ">
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-size: 10px;
              font-weight: bold;
              color: #99ccff;
              margin-bottom: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${video.title}</div>
            <div style="
              font-size: 8px;
              color: #66aaff;
            ">Click to play transmission</div>
          </div>
          <div style="
            font-size: 16px;
            color: #99ccff;
          ">▶</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = videosHtml;

    // Add click handlers for video playback
    this.addTransmissionClickHandlers();
  }

  /**
   * Update the live transmissions container with error or status message
   */
  updateLiveTransmissionsContainer(message) {
    const container = document.getElementById('live-transmissions-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; color: #ff6666; font-size: 10px;">
          ${message}
        </div>
      `;
    }
  }

  /**
   * Add click handlers for transmission items
   */
  addTransmissionClickHandlers() {
    const transmissionItems = document.querySelectorAll('.transmission-item');
    
    transmissionItems.forEach(item => {
      item.addEventListener('click', () => {
        const videoId = item.dataset.videoId;
        this.playYouTubeVideo(videoId);
      });

      // Add hover effects
      item.addEventListener('mouseenter', () => {
        item.style.borderColor = '#99ccff';
        item.style.background = 'rgba(153, 204, 255, 0.1)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.borderColor = '#333333';
        item.style.background = 'rgba(0, 0, 0, 0.3)';
      });
    });
  }

  /**
   * Play YouTube video in a modal player
   */
  playYouTubeVideo(videoId) {
    console.log(`🎬 Playing YouTube video: ${videoId}`);
    
    // Remove any existing modals first
    const existingModals = document.querySelectorAll('.youtube-modal');
    existingModals.forEach(modal => modal.remove());
    
    // CRITICAL: On desktop, we need to bypass RetroWindow positioning
    // Check if we're in a RetroWindow context and force body positioning
    const isInRetroWindow = document.querySelector('.retro-window') !== null;
    console.log(`🖥️ Desktop RetroWindow detected: ${isInRetroWindow}`);
    
    // Create modal player with completely isolated positioning
    const modal = this.createIsolatedModal();
    modal.className = 'youtube-modal';

    const playerContainer = document.createElement('div');
    playerContainer.className = 'youtube-player-container';
    // Set player container styles directly
    playerContainer.style.position = 'relative';
    playerContainer.style.width = '90%';
    playerContainer.style.maxWidth = '800px';
    playerContainer.style.background = '#000';
    playerContainer.style.borderRadius = '8px';
    playerContainer.style.overflow = 'hidden';
    playerContainer.style.boxShadow = '0 0 50px rgba(153, 204, 255, 0.3)';
    playerContainer.style.transform = 'none';
    playerContainer.style.margin = '0';
    playerContainer.style.boxSizing = 'border-box';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.className = 'youtube-close-btn';
    closeBtn.type = 'button'; // Ensure it's not a submit button
    closeBtn.title = 'Close Video'; // Add tooltip
    // Set close button styles directly with !important to ensure they work
    closeBtn.style.cssText = `
      position: absolute !important;
      top: 10px !important;
      right: 10px !important;
      width: 30px !important;
      height: 30px !important;
      background: rgba(0, 0, 0, 0.8) !important;
      border: 1px solid #99ccff !important;
      color: #99ccff !important;
      border-radius: 50% !important;
      cursor: pointer !important;
      z-index: 10001 !important;
      font-size: 14px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.2s ease !important;
      box-sizing: border-box !important;
      font-family: 'Space Mono', monospace !important;
      font-weight: bold !important;
      outline: none !important;
      user-select: none !important;
    `;

    // Close button hover effect
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.background = 'rgba(153, 204, 255, 0.2)';
      closeBtn.style.borderColor = '#99ccff';
      closeBtn.style.transform = 'scale(1.1)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.background = 'rgba(0, 0, 0, 0.8)';
      closeBtn.style.borderColor = '#99ccff';
      closeBtn.style.transform = 'scale(1)';
    });
    
    // Add double-click as backup close method
    closeBtn.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔘 Close button double-clicked');
      this.closeModal(modal);
    });

    // Close button click handler
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🔘 Close button clicked');
      this.closeModal(modal);
    });

    // YouTube iframe player
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    // Set iframe styles directly
    iframe.style.width = '100%';
    iframe.style.height = '450px';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    iframe.style.boxSizing = 'border-box';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

    // Assemble the modal
    playerContainer.appendChild(closeBtn);
    playerContainer.appendChild(iframe);
    modal.appendChild(playerContainer);
    
    // CRITICAL: Force complete independence from RetroWindow positioning
    this.forceModalIndependence(modal);
    
    // Add to document body, not inside any RetroWindow
    document.body.appendChild(modal);
    
    // Force recalculation of positioning to ensure it's centered
    modal.offsetHeight; // Trigger reflow
    
    // Verify the modal is properly positioned
    console.log('🎯 Modal positioning verification:', {
      position: modal.style.position,
      top: modal.style.top,
      left: modal.style.left,
      transform: modal.style.transform,
      parent: modal.parentElement.tagName,
      parentClass: modal.parentElement.className,
      isInRetroWindow: document.querySelector('.retro-window') !== null
    });
    
    // Double-check positioning after a brief delay
    setTimeout(() => {
      if (modal && modal.parentNode) {
        // Re-enforce independence
        this.forceModalIndependence(modal);
        
        // Ensure it's still in the body
        if (modal.parentElement !== document.body) {
          console.log('⚠️ Modal moved from body, re-appending...');
          document.body.appendChild(modal);
        }
        
        // Force viewport positioning
        modal.style.position = 'fixed';
        modal.style.top = '0px';
        modal.style.left = '0px';
        modal.style.transform = 'none';
        modal.style.margin = '0';
        modal.style.padding = '0';
      }
    }, 10);

    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        console.log('🖱️ Background clicked, closing modal');
        this.closeModal(modal);
      }
    });
    
    // Also close on right-click for additional accessibility
    modal.addEventListener('contextmenu', (e) => {
      if (e.target === modal) {
        e.preventDefault();
        console.log('🖱️ Right-click on background, closing modal');
        this.closeModal(modal);
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Add global close function for debugging
    window.closeYouTubeModal = () => {
      console.log('🌐 Global close function called');
      this.closeModal(modal);
    };
    
    console.log('🎬 YouTube modal created successfully. Use close button, click background, press Escape, or call window.closeYouTubeModal() to close.');
  }

  /**
   * Close YouTube modal with proper cleanup
   */
  closeModal(modal) {
    if (!modal) return;
    
    console.log('🔒 Closing YouTube modal...');
    
    // Fade out effect
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      try {
        // Remove the modal
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
          console.log('✅ Modal removed from DOM');
        } else if (modal && modal.remove) {
          modal.remove();
          console.log('✅ Modal removed using remove() method');
        }
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clean up any remaining event listeners
        const remainingModals = document.querySelectorAll('.youtube-modal');
        if (remainingModals.length === 0) {
          // All modals closed, ensure body scroll is restored
          document.body.style.overflow = '';
          console.log('✅ All modals closed, body scroll restored');
        }
        
        // Force a reflow to ensure cleanup
        document.body.offsetHeight;
        
      } catch (error) {
        console.error('❌ Error closing modal:', error);
        // Fallback: force remove if normal removal fails
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
        document.body.style.overflow = '';
      }
    }, 300);
  }

  /**
   * Close all YouTube modals and clean up
   */
  closeAllYouTubeModals() {
    const modals = document.querySelectorAll('.youtube-modal');
    modals.forEach(modal => {
      this.closeModal(modal);
    });
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Reset modal positioning and clean up any stray elements
   */
  resetModalState() {
    // Close all modals
    this.closeAllYouTubeModals();
    
    // Remove any stray modal elements that might have incorrect positioning
    const strayModals = document.querySelectorAll('[class*="modal"], [class*="player"]');
    strayModals.forEach(element => {
      if (element.classList.contains('youtube-modal') || 
          element.classList.contains('youtube-player-container')) {
        element.remove();
      }
    });
    
    // Ensure body scroll is restored
    document.body.style.overflow = '';
    
    // Reset any parent transforms that might be affecting positioning
    const retroWindows = document.querySelectorAll('.retro-window');
    retroWindows.forEach(window => {
      if (window.style.transform && window.style.transform !== 'none') {
        console.log('🔄 Resetting RetroWindow transform:', window.style.transform);
        window.style.transform = 'none';
      }
    });
    
    console.log('🧹 Modal state reset completed');
  }

  /**
   * Create a completely isolated modal that ignores parent positioning
   */
  createIsolatedModal() {
    // Create modal with absolute isolation
    const modal = document.createElement('div');
    
    // Force viewport positioning with maximum isolation
    modal.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.9) !important;
      z-index: 10000 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      backdrop-filter: blur(10px) !important;
      transform: none !important;
      margin: 0 !important;
      padding: 0 !important;
      box-sizing: border-box !important;
      transform-origin: 0 0 !important;
      /* Force isolation from any parent transforms */
      will-change: transform !important;
      contain: layout style paint !important;
    `;
    
    // Remove any inherited properties that might cause positioning issues
    modal.style.removeProperty('right');
    modal.style.removeProperty('bottom');
    modal.style.removeProperty('transform');
    modal.style.removeProperty('transform-origin');
    
    return modal;
  }

  /**
   * Force modal to be completely independent of RetroWindow positioning
   */
  forceModalIndependence(modal) {
    // Ensure modal is in body, not nested in any RetroWindow
    if (modal.parentElement !== document.body) {
      console.log('🔄 Moving modal to document body for independence');
      document.body.appendChild(modal);
    }
    
    // Force absolute positioning that ignores parent context
    modal.style.position = 'fixed';
    modal.style.top = '0px';
    modal.style.left = '0px';
    modal.style.transform = 'none';
    modal.style.zIndex = '10000';
    
    // Remove any inherited positioning
    modal.style.removeProperty('right');
    modal.style.removeProperty('bottom');
    modal.style.removeProperty('margin');
    modal.style.removeProperty('padding');
    
    // Force viewport-based positioning
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    
    console.log('🔒 Modal independence enforced');
  }

  /**
   * Load labs videos from the public folder and display YouTube videos
   */
  async loadLabsVideos() {
    try {
      console.log('🔬 Loading labs videos from public folder...');
      
      // Read the labs.txt file from the public/links folder
      const fileContent = await readPublicFile('./public/links/labs.txt?t=' + Date.now());
      
      if (!fileContent) {
        console.error('❌ Could not read labs.txt from public folder');
        this.updateLabsVideosContainer('Error: Could not load labs file');
        return;
      }

      console.log('🔬 File content loaded:', fileContent.substring(0, 100) + '...');

      // Parse YouTube URLs from the file
      const youtubeUrls = this.parseYouTubeUrls(fileContent);
      console.log(`🔬 Found ${youtubeUrls.length} YouTube URLs`);

      if (youtubeUrls.length === 0) {
        this.updateLabsVideosContainer('No YouTube videos found');
        return;
      }

      // Fetch video metadata for each URL
      const videos = await this.fetchYouTubeMetadata(youtubeUrls);
      
      // Display the videos
      this.displayLabsVideos(videos);
      
    } catch (error) {
      console.error('❌ Error loading labs videos:', error);
      this.updateLabsVideosContainer('Error loading videos');
    }
  }

  /**
   * Display labs videos in the container
   */
  displayLabsVideos(videos) {
    const container = document.getElementById('labs-videos-container');
    if (!container) return;

    // Sort videos by publication date (newest first)
    const sortedVideos = videos.sort((a, b) => {
      const dateA = new Date(a.publishedAt);
      const dateB = new Date(b.publishedAt);
      return dateB - dateA; // Newest first
    });

    const videosHtml = sortedVideos.map(video => `
      <div class="labs-video-item" data-video-id="${video.id}" style="
        margin-bottom: 12px;
        padding: 8px;
        border: 1px solid #333333;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <img src="${video.thumbnail}" alt="${video.title}" style="
            width: 60px;
            height: 45px;
            border-radius: 4px;
            object-fit: cover;
          ">
          <div style="flex: 1; min-width: 0;">
            <div style="
              font-size: 10px;
              font-weight: bold;
              color: #99ccff;
              margin-bottom: 2px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            ">${video.title}</div>
            <div style="
              font-size: 8px;
              color: #66aaff;
            ">Click to play video</div>
          </div>
          <div style="
            font-size: 16px;
            color: #99ccff;
          ">▶</div>
        </div>
      </div>
    `).join('');

    container.innerHTML = videosHtml;

    // Add click handlers for video playback
    this.addLabsVideoClickHandlers();
  }

  /**
   * Update the labs videos container with error or status message
   */
  updateLabsVideosContainer(message) {
    const container = document.getElementById('labs-videos-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; color: #ff6666; font-size: 10px;">
          ${message}
        </div>
      `;
    }
  }

  /**
   * Add click handlers for labs video items
   */
  addLabsVideoClickHandlers() {
    const videoItems = document.querySelectorAll('.labs-video-item');
    
    videoItems.forEach(item => {
      item.addEventListener('click', () => {
        const videoId = item.dataset.videoId;
        this.playYouTubeVideo(videoId);
      });

      // Add hover effects
      item.addEventListener('mouseenter', () => {
        item.style.borderColor = '#99ccff';
        item.style.background = 'rgba(153, 204, 255, 0.1)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.borderColor = '#333333';
        item.style.background = 'rgba(0, 0, 0, 0.3)';
      });
    });
  }

  /**
   * Get content for different window types
   */
  getWindowContent(windowType) {
    console.log(`🪟 Getting window content for: ${windowType}`);
    
    switch (windowType) {
      case 'conundrum':
        console.log('🎭 Rendering conundrum window...');
        console.log('🎭 this.conundrumContent exists:', !!this.conundrumContent);
        console.log('🎭 this.conundrumContent:', this.conundrumContent);
        
        // If content hasn't loaded yet, show loading state
        if (!this.conundrumContent) {
          console.log('🎭 Content not loaded yet, showing loading state...');
          return `
            <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
              <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">
                LOADING CONUNDRUM...
              </h3>
              <div style="font-size: 11px; color: #99ccff; line-height: 1.4;">
                <div style="text-align: center; padding: 20px;">
                  <div style="margin-bottom: 10px;">⏳</div>
                  <div>Loading mystical content...</div>
                </div>
              </div>
            </div>`;
        }
        
        console.log('🎭 Title to display:', this.conundrumContent.title);
        console.log('🎭 Content to display:', this.conundrumContent.content);
        
        return `
          <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
            <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">
              ${this.conundrumContent.title}
            </h3>
            <div style="font-size: 11px; color: #99ccff; line-height: 1.4;">
              ${this.conundrumContent.content.replace(/\n/g, '<br>')}
            </div>
          </div>`;

      case 'releases':
        // Load PDFs after a short delay to ensure DOM is ready
        setTimeout(() => {
          this.loadPDFResearchPapers();
        }, 100);
        return this.createReleasesContent();

      case 'live':
        return this.createLiveTransmissionsContent();

      case 'radio':
        console.log('🎵 Radio case hit - calling createRadioFileExplorer');
        return this.createRadioFileExplorer();

      case 'labs':
        // Load labs videos after a short delay to ensure DOM is ready
        setTimeout(() => {
          this.loadLabsVideos();
        }, 100);
        return this.createLabsContent();

      case 'gallery':
        return this.createGalleryContent();

      case 'contact':
        return this.createContactContent();

      case 'latest-gig':
        return this.createGigsContent();

      default:
        return '<p style="font-size: 11px; padding: 12px; color: #99ccff; background: #0a0a0a;">Content loading...</p>';
    }
  }

  /**
   * Create live transmissions content with YouTube videos
   */
  createLiveTransmissionsContent() {
    return `
      <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">LIVE TRANSMISSIONS</h3>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
          Experience real-time audio-visual transmissions from the OMNIVOID network. These live streams connect you directly to the digital consciousness.
        </p>
        <div id="live-transmissions-container" style="margin-top: 12px;">
          <div style="text-align: center; color: #66aaff; font-size: 10px;">
            <div class="loading-spinner">⏳</div>
            <div>Loading transmissions...</div>
          </div>
        </div>
        <hr style="border: none; border-top: 1px inset #333333; margin: 8px 0;">
        <div style="font-size: 10px; color: #66aaff;">
          <div><strong>Status:</strong> <span style="color: #66ff66;">SCANNING</span></div>
          <div><strong>Source:</strong> Google Drive</div>
          <div><strong>Format:</strong> Dynamic Content</div>
        </div>
      </div>
    `;
  }

  /**
   * Create radio file explorer content
   */
  createRadioFileExplorer() {
    console.log('🎵 Creating radio file explorer with lazy-loaded Mixcloud widget...');

    const content = `
      <!-- Full Mixcloud Widget Container -->
      <div style="border: 1px inset #333333; padding: 8px; background: #0a0a0a; margin-bottom: 8px;">
        <div id="mixcloud-widget-container" style="
          width: 100%;
          height: 400px;
          background: #1a1a1a;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div id="mixcloud-placeholder" style="
            color: #999;
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            text-align: center;
            padding: 20px;
          ">
            <div style="margin-bottom: 10px;">🎵</div>
            <div>Click to load Mixcloud player</div>
            <div style="font-size: 12px; margin-top: 5px; opacity: 0.7;">Loading will start when window opens</div>
          </div>
        </div>
      </div>
    `;

    console.log('🎵 Radio file explorer with lazy-loaded Mixcloud integration generated');
    return content;
  }

  /**
   * Initialize Mixcloud widget and audio reactivity
   */
  initializeMixcloudWidget() {
    console.log('🎵 Initializing Mixcloud widget...');
    
    // Initialize Mixcloud event tracking
    this.mixcloudEventsReceived = false;
    
    // Create the iframe dynamically
    const container = document.getElementById('mixcloud-widget-container');
    const placeholder = document.getElementById('mixcloud-placeholder');
    
    if (container && placeholder) {
      console.log('✅ Mixcloud container found, creating iframe...');
      
      // Remove placeholder
      placeholder.remove();
      
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = 'https://www.mixcloud.com/widget/iframe/?feed=%2Froydipankar8%2F&light=1&autoplay=0&classic=1';
      iframe.frameBorder = '0';
      iframe.id = 'mixcloud-player';
      iframe.style.border = 'none';
      iframe.allow = 'autoplay';
      iframe.title = 'Mixcloud Player';
      
      // Add iframe to container
      container.appendChild(iframe);
      
      // Wait for the iframe to load
      setTimeout(() => {
        const mixcloudPlayer = document.getElementById('mixcloud-player');
        if (mixcloudPlayer) {
          console.log('✅ Mixcloud player iframe created and loaded');
          
          // Set up Mixcloud widget event listeners
          this.setupMixcloudWidgetEvents();
          
          // Note: Audio reactivity removed - Mixcloud no longer connects to visual effects
          
          // Initial debug info
          setTimeout(() => {
            this.refreshDebugInfo();
          }, 2000);
          
        } else {
          console.log('⚠️ Mixcloud player iframe not found after creation, retrying...');
          // Retry after a short delay
          setTimeout(() => this.initializeMixcloudWidget(), 1000);
        }
      }, 500);
      
    } else {
      console.log('⚠️ Mixcloud container not found, retrying...');
      // Retry after a short delay
      setTimeout(() => this.initializeMixcloudWidget(), 1000);
    }
  }

  /**
   * Set up Mixcloud widget event listeners
   */
  setupMixcloudWidgetEvents() {
    console.log('🎵 Setting up Mixcloud widget events...');
    
    try {
      // Listen for messages from the Mixcloud iframe
      window.addEventListener('message', (event) => {
        // Only accept messages from Mixcloud
        if (event.origin !== 'https://www.mixcloud.com') {
          return;
        }
        
        console.log('📨 Message from Mixcloud widget:', event.data);
        
        // Handle different widget events
        if (event.data && event.data.type) {
          switch (event.data.type) {
            case 'play':
              console.log('▶️ Mixcloud track started playing');
              this.onMixcloudPlay();
              break;
            case 'pause':
              console.log('⏸️ Mixcloud track paused');
              this.onMixcloudPause();
              break;
            case 'finish':
              console.log('⏹️ Mixcloud track finished');
              this.onMixcloudFinish();
              break;
            case 'progress':
              console.log('📊 Mixcloud progress:', event.data.data);
              this.onMixcloudProgress(event.data.data);
              break;
            case 'error':
              console.log('❌ Mixcloud widget error:', event.data.data);
              this.onMixcloudError(event.data.data);
              break;
            default:
              console.log('📨 Unknown Mixcloud event:', event.data.type);
          }
        }
      });
      
      // Also listen for iframe load errors
      const mixcloudPlayer = document.getElementById('mixcloud-player');
      if (mixcloudPlayer) {
        mixcloudPlayer.addEventListener('error', (error) => {
          console.log('⚠️ Mixcloud iframe error:', error);
          this.updateReactivityStatus('Mixcloud widget error - using fallback');
        });
        
        // Listen for iframe load completion
        mixcloudPlayer.addEventListener('load', () => {
          console.log('🎵 Mixcloud iframe loaded successfully');
          // Wait a bit then check if we need to fall back
          setTimeout(() => {
            this.checkMixcloudStatus();
          }, 3000);
        });
      }
      
      console.log('✅ Mixcloud widget events configured');
      
    } catch (error) {
      console.log('❌ Error setting up Mixcloud widget events:', error);
    }
  }

  /**
   * Check Mixcloud widget status and fall back if needed
   */
  checkMixcloudStatus() {
    console.log('🔍 Checking Mixcloud widget status...');
    
    // If we haven't received any play events after 3 seconds, 
    // the widget might have issues, so fall back to test oscillator
    if (!this.mixcloudEventsReceived) {
      console.log('⚠️ No Mixcloud events received - falling back to test oscillator');
      this.updateReactivityStatus('Mixcloud not responding - using fallback');
      this.createTestOscillator();
    }
  }

  /**
   * Handle Mixcloud play event
   */
  onMixcloudPlay() {
    console.log('🎵 Mixcloud track playing - starting audio reactivity');
    
    // Mark that we've received Mixcloud events
    this.mixcloudEventsReceived = true;
    
    // Since we can't capture audio directly, use the test oscillator for visual effects
    this.createTestOscillator();
    
    // Update status
    this.updateReactivityStatus('Mixcloud playing - Visual effects active (test oscillator)');
  }

  /**
   * Handle Mixcloud pause event
   */
  onMixcloudPause() {
    console.log('⏸️ Mixcloud track paused - pausing visual effects');
    
    // Stop the test oscillator
    this.stopTestOscillator();
    
    // Update status
    this.updateReactivityStatus('Mixcloud paused - Visual effects paused');
  }

  /**
   * Handle Mixcloud finish event
   */
  onMixcloudFinish() {
    console.log('⏹️ Mixcloud track finished - stopping visual effects');
    
    // Stop the test oscillator
    this.stopTestOscillator();
    
    // Update status
    this.updateReactivityStatus('Mixcloud track finished - Visual effects stopped');
  }

  /**
   * Handle Mixcloud progress event
   */
  onMixcloudProgress(progressData) {
    // Update progress display if needed
    if (progressData && progressData.currentTime !== undefined) {
      console.log('📊 Mixcloud progress:', progressData.currentTime);
    }
  }

  /**
   * Handle Mixcloud error event
   */
  onMixcloudError(errorData) {
    console.log('❌ Mixcloud widget error:', errorData);
    
    // Update status to show error
    this.updateReactivityStatus('Mixcloud error - using fallback visual effects');
    
    // Fall back to test oscillator for visual effects
    this.createTestOscillator();
  }

  /**
   * Stop test oscillator
   */
  stopTestOscillator() {
    if (this.audioProxy.testOscillator) {
      try {
        this.audioProxy.testOscillator.stop();
        this.audioProxy.testOscillator.disconnect();
        this.audioProxy.testOscillator = null;
        
        if (this.audioProxy.testGain) {
          this.audioProxy.testGain.disconnect();
          this.audioProxy.testGain = null;
        }
        
        console.log('⏹️ Test oscillator stopped');
      } catch (error) {
        console.log('⚠️ Error stopping test oscillator:', error);
      }
    }
  }

  /**
   * Set up periodic audio proxy attempts
   */
  setupPeriodicAudioCapture() {
    console.log('🔄 Setting up periodic audio proxy attempts...');
    
    // Try to start audio proxy every 5 seconds for the first minute
    let attempts = 0;
    const maxAttempts = 12; // 1 minute
    
    const captureInterval = setInterval(() => {
      attempts++;
      console.log(`🔄 Audio proxy attempt ${attempts}/${maxAttempts}`);
      
      if (attempts >= maxAttempts) {
        clearInterval(captureInterval);
        console.log('⏰ Stopping periodic audio proxy attempts');
        return;
      }
      
      // Try to start audio proxy
      this.startAudioProxy();
      
    }, 5000); // Every 5 seconds
    
    // Also set up continuous debug monitoring
    this.setupDebugMonitoring();
  }

  /**
   * Set up continuous debug monitoring
   */
  setupDebugMonitoring() {
    console.log('🔍 Setting up continuous debug monitoring...');
    
    // Update debug info every 3 seconds
    const debugInterval = setInterval(() => {
      if (document.getElementById('debug-info')) {
        this.refreshDebugInfo();
      } else {
        // Stop monitoring if debug panel is no longer visible
        clearInterval(debugInterval);
        console.log('🔍 Debug monitoring stopped - panel not visible');
      }
    }, 3000); // Every 3 seconds
    
    // Store the interval for cleanup
    this.debugInterval = debugInterval;
  }

  /**
   * Set up audio reactivity for Mixcloud audio
   * DISABLED: Audio reactivity removed from Mixcloud component
   */
  setupMixcloudAudioReactivity() {
    console.log('🎵 Mixcloud audio reactivity disabled - no visual effects connection');
    
    // Update status to reflect no reactivity
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = 'Mixcloud mode - No visual effects connection';
    }
    
    console.log('✅ Mixcloud audio reactivity disabled');
  }

  /**
   * Capture audio from Mixcloud iframe for reactivity
   * DISABLED: Audio reactivity removed from Mixcloud component
   */
  async captureMixcloudAudio() {
    console.log('🎵 Mixcloud audio capture disabled - no visual effects connection');
    
    // Update status to reflect no reactivity
    this.updateReactivityStatus('Mixcloud mode - No visual effects connection');
  }

  /**
   * Try alternative audio capture methods
   */
  tryAlternativeAudioCapture() {
    console.log('🔄 Trying alternative audio capture methods...');
    
    // Since CORS blocks iframe access, create a test oscillator for visual effects
    this.createTestOscillator();
  }

  /**
   * Create a test oscillator for visual effects when audio capture fails
   */
  createTestOscillator() {
    console.log('🎵 Creating test oscillator for visual effects...');
    
    try {
      if (this.audioManager && this.audioManager.audioContext) {
        // Create a simple oscillator
        const oscillator = this.audioManager.audioContext.createOscillator();
        const gainNode = this.audioManager.audioContext.createGain();
        
        // Configure oscillator
        oscillator.frequency.setValueAtTime(440, this.audioManager.audioContext.currentTime); // A4 note
        oscillator.type = 'sine';
        
        // Set very low volume
        gainNode.gain.setValueAtTime(0.001, this.audioManager.audioContext.currentTime);
        
        // Connect oscillator to analyser
        oscillator.connect(gainNode);
        gainNode.connect(this.audioManager.analyser);
        
        // Start the oscillator
        oscillator.start();
        
        console.log('✅ Test oscillator created and connected');
        this.updateReactivityStatus('Test oscillator active - Visual effects working');
        
        // Store for cleanup
        this.audioProxy.testOscillator = oscillator;
        this.audioProxy.testGain = gainNode;
        
      } else {
        console.log('❌ Audio manager not available for test oscillator');
        this.updateReactivityStatus('Audio manager not available');
      }
    } catch (error) {
      console.log('❌ Error creating test oscillator:', error);
      this.updateReactivityStatus('Test oscillator failed: ' + error.message);
    }
  }



  /**
   * Update reactivity status with detailed information
   */
  updateReactivityStatus(message) {
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = message;
    }
    
    // Also log to console
    console.log(`📊 Reactivity Status: ${message}`);
  }

  /**
   * Connect iframe audio to our audio context
   */
  connectIframeAudio(audioElement) {
    try {
      console.log('🔗 Connecting iframe audio to our audio context...');
      
      if (this.audioManager && this.audioManager.audioContext) {
        // Create a media stream source from the audio element
        const stream = audioElement.captureStream();
        const source = this.audioManager.audioContext.createMediaStreamSource(stream);
        
        // Connect to our analyzer
        source.connect(this.audioManager.analyser);
        
        console.log('✅ Iframe audio connected to audio context');
        
        // Update status
        const reactivityStatus = document.getElementById('reactivity-status');
        if (reactivityStatus) {
          reactivityStatus.textContent = 'Mixcloud audio captured - Visual effects active!';
        }
      }
    } catch (error) {
      console.log('⚠️ Error connecting iframe audio:', error);
      this.fallbackAudioCapture();
    }
  }

    /**
   * Fallback method for audio capture
   */
  fallbackAudioCapture() {
    console.log('🔄 Mixcloud-only fallback mode...');
    
    // Update status to indicate Mixcloud-only mode
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = 'Mixcloud-only mode - No microphone or system audio';
    }
    
    console.log('✅ Mixcloud-only audio mode configured');
  }

  /**
   * Manual visual effects trigger
   */
  manualAudioCapture() {
    console.log('🔊 Manual visual effects trigger...');
    
    // Update status
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = 'Starting visual effects...';
    }
    
    // Start test oscillator for visual effects
    this.createTestOscillator();
    
    // Refresh debug info
    setTimeout(() => {
      this.refreshDebugInfo();
    }, 1000);
  }

  /**
   * Refresh debug information
   */
  refreshDebugInfo() {
    console.log('🔍 Refreshing debug information...');
    
    const debugInfo = document.getElementById('debug-info');
    if (!debugInfo) return;
    
    let debugText = '';
    
    // Audio Manager Status
    if (this.audioManager) {
      debugText += `✅ Audio Manager: Available<br>`;
      debugText += `🎵 Audio Context: ${this.audioManager.audioContext ? 'Active' : 'Inactive'}<br>`;
      debugText += `📊 Analyzer: ${this.audioManager.analyser ? 'Ready' : 'Missing'}<br>`;
      debugText += `🔊 Is Playing: ${this.audioManager.isPlaying ? 'Yes' : 'No'}<br>`;
    } else {
      debugText += `❌ Audio Manager: Not Available<br>`;
    }
    
    // Audio Stream Status
    if (this.currentAudioStream) {
      debugText += `🎵 Audio Stream: Active<br>`;
      debugText += `🔗 Stream ID: ${this.currentAudioStream.id || 'Unknown'}<br>`;
    } else {
      debugText += `❌ Audio Stream: Not Active<br>`;
    }
    
    // Frequency Data Test
    if (this.audioManager && this.audioManager.analyser) {
      try {
        const dataArray = new Float32Array(this.audioManager.analyser.frequencyBinCount);
        this.audioManager.analyser.getFloatFrequencyData(dataArray);
        
        const averageFreq = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const hasData = dataArray.some(value => value > -Infinity);
        
        debugText += `📊 Frequency Data: ${hasData ? 'Yes' : 'No'}<br>`;
        debugText += `📈 Avg Frequency: ${averageFreq.toFixed(2)}<br>`;
        debugText += `🔢 Data Points: ${dataArray.length}<br>`;
      } catch (error) {
        debugText += `❌ Frequency Test: Failed (${error.message})<br>`;
      }
    }
    
    // Mixcloud Widget Status
    const mixcloudPlayer = document.getElementById('mixcloud-player');
    if (mixcloudPlayer) {
      debugText += `🎵 Mixcloud Widget: Found<br>`;
      debugText += `🔗 Widget Src: ${mixcloudPlayer.src.substring(0, 50)}...<br>`;
    } else {
      debugText += `❌ Mixcloud Widget: Not Found<br>`;
    }
    
    // Audio Proxy Status
    debugText += `🎵 Audio Proxy: ${this.audioProxy.isActive ? 'Active' : 'Not Active'}<br>`;
    debugText += `🎵 Proxy Context: ${this.audioProxy.audioContext ? 'Active' : 'Not Available'}<br>`;
    debugText += `🎵 Proxy Analyser: ${this.audioProxy.analyser ? 'Active' : 'Not Available'}<br>`;
    debugText += `🎵 Proxy Audio: ${this.audioProxy.audioElement ? 'Loaded' : 'Not Loaded'}<br>`;
    debugText += `🎵 Audio Source: ${this.audioProxy.source ? 'Connected' : 'Not Connected'}<br>`;
    debugText += `🎵 Iframe Source: ${this.audioProxy.iframeSource ? 'Connected' : 'Not Connected'}<br>`;
    debugText += `🎵 Test Oscillator: ${this.audioProxy.testOscillator ? 'Active' : 'Not Active'}<br>`;
    debugText += `🎵 Main Analyser: ${this.audioManager && this.audioManager.analyser ? 'Available' : 'Not Available'}<br>`;
    
    // Mixcloud Widget Status
    debugText += `🎵 Mixcloud Events: ${this.mixcloudEventsReceived ? 'Received' : 'Not Received'}<br>`;
    debugText += `🎵 Widget Status: ${this.mixcloudEventsReceived ? 'Working' : 'May have issues'}<br>`;
    
    // Browser Capabilities
    debugText += `🎵 Web Audio API: ${window.AudioContext ? 'Supported' : 'Not Supported'}<br>`;
    debugText += `🎵 Mixcloud Only: No microphone access<br>`;
    
    debugInfo.innerHTML = debugText;
    
    console.log('✅ Debug information refreshed');
  }



  /**
   * Synchronize play button states across main controls and radio
   */
  syncPlayButtonState(isPlaying) {
    // Update Mixcloud status only
    this.updateRadioStatus(isPlaying ? 'Audio Active' : 'Audio Paused');
  }

  /**
   * Update radio status display
   */
  updateRadioStatus(status) {
    const statusElement = document.getElementById('radio-status');
    if (statusElement) {
      statusElement.innerHTML = `Status: ${status}`;
    }
  }









  /**
   * Update radio window content
   */
  updateRadioWindow() {
    if (this.retroWindows && this.retroWindows.radio) {
      const newContent = this.createRadioFileExplorer();
      this.retroWindows.radio.setContent(newContent);
    }
  }



  /**
   * Create gallery content
   */
  createGalleryContent() {
    // Gallery images list (IMG000.png through IMG019.png)
    const galleryImages = [];
    for (let i = 0; i <= 19; i++) {
      const imageNumber = i.toString().padStart(3, '0');
      galleryImages.push(`IMG${imageNumber}.png`);
    }

    // Generate image descriptions (you can customize these)
    const getImageDescription = (filename) => {
      const imageNum = filename.replace('IMG', '').replace('.png', '');
      return `OMNIVOID Visual ${parseInt(imageNum) + 1} - Digital art piece exploring the intersection of technology and consciousness through abstract visual elements.`;
    };

    // Create thumbnail grid HTML
    const thumbnailsHTML = galleryImages.map((filename, index) => {
      return `
        <div class="gallery-thumbnail" 
             style="
               border: 1px solid #333333;
               padding: 2px;
               background: #1a1a1a;
               cursor: pointer;
               transition: all 0.2s;
               position: relative;
               overflow: hidden;
               display: flex;
               align-items: center;
               justify-content: center;
               min-height: 80px;
             "
             onmouseover="this.style.border='2px solid #99ccff'; this.style.padding='1px';"
             onmouseout="this.style.border='1px solid #333333'; this.style.padding='2px';"
             onclick="window.omnivoidApp.expandGalleryImage('${filename}', '${getImageDescription(filename).replace(/'/g, '\\\'')}')"
             title="Click to view full image">
          <img src="public/gallery/${filename}" 
               alt="${filename}"
               style="
                 max-width: 100%;
                 max-height: 100%;
                 width: auto;
                 height: auto;
                 object-fit: contain;
                 display: block;
               "
               onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'padding: 20px; text-align: center; font-size: 8px; color: #99ccff;\\'>Image not found</div>'">
        </div>
      `;
    }).join('');

    return `
      <div id="gallery-container" style="background: #0a0a0a;">
        <div style="border: 1px inset #333333; padding: 8px; margin-bottom: 8px; background: #0a0a0a; color: #99ccff;">          
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
           ${galleryImages.length} images loaded
          </p>
        </div>
        
        <div id="gallery-thumbnails" style="
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 4px;
          padding: 8px;
          border: 1px inset #333333;
          background: #1a1a1a;
          max-height: 160px;
          overflow-y: auto;
        ">
          ${thumbnailsHTML}
        </div>
        
        <div style="
          border: 1px inset #333333;
          margin-top: 8px;
          background: #1a1a1a;
          padding: 8px;
          font-size: 10px;
          color: #99ccff;
        ">
          <strong>Navigation:</strong> Click any thumbnail to view full image • Press ESC or click outside popup to close • ${galleryImages.length} images total
        </div>
      </div>
    `;
  }

  /**
   * Create labs content with workshop information
   */
  createLabsContent() {
    return `
      <div id="labs-container" style="background: #0a0a0a;">
        <!-- Labs Videos Section -->
        <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
          <h4 style="margin: 0 0 12px 0; font-size: 11px; font-weight: bold; color: #99ccff;">🎬 LABS VIDEOS</h4>
          <div id="labs-videos-container" style="
            min-height: 50px;
            color: #99ccff;
            font-size: 10px;
            text-align: center;
            padding: 20px;
          ">
            Loading videos...
          </div>
        </div>
        
        <!-- Workshop Details -->
        <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
          <h4 style="margin: 0 0 12px 0; font-size: 11px; font-weight: bold; color: #99ccff;">🎛️ WORKSHOP ACTIVITIES</h4>
          
          <div style="margin-bottom: 12px; padding: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px;">
            <div style="font-size: 10px; color: #66aaff; font-weight: bold; margin-bottom: 4px;">🔧 Hardware Synthesizers</div>
            <div style="font-size: 9px; color: #99ccff; line-height: 1.3;">
              Hands-on exploration of analog and digital synthesizers, learning their unique characteristics and sound design capabilities.
            </div>
          </div>
          
          <div style="margin-bottom: 12px; padding: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px;">
            <div style="font-size: 10px; color: #66aaff; font-weight: bold; margin-bottom: 4px;">Synthesis Fundamentals</div>
            <div style="font-size: 9px; color: #99ccff; line-height: 1.3;">
              Understanding oscillators, filters, envelopes, and modulation - the building blocks of electronic sound creation.
            </div>
          </div>
          
          <div style="margin-bottom: 12px; padding: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px;">
            <div style="font-size: 10px; color: #66aaff; font-weight: bold; margin-bottom: 4px;">Group Drone Jam Session</div>
            <div style="font-size: 9px; color: #99ccff; line-height: 1.3;">
              Collaborative creation of ambient soundscapes through collective improvisation and experimental techniques.
            </div>
          </div>
          
          <div style="margin-bottom: 12px; padding: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px;">
            <div style="font-size: 10px; color: #66aaff; font-weight: bold; margin-bottom: 4px;">Creative Sampling</div>
            <div style="font-size: 9px; color: #99ccff; line-height: 1.3;">
              Techniques for capturing, manipulating, and transforming audio samples into unique musical elements.
            </div>
          </div>
          
          <div style="padding: 8px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px;">
            <div style="font-size: 10px; color: #66aaff; font-weight: bold; margin-bottom: 4px;">Producer Roulette Challenge</div>
            <div style="font-size: 9px; color: #99ccff; line-height: 1.3;">
              A special collaborative challenge featuring guest music producers, where participants work together to create tracks in real-time.
            </div>
          </div>
        </div>
        
        <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
          
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
            An immersive, hands-on session where you'll explore hardware synthesizers, Understand the Basics of Synthesis, Experience a Group Drone Jam Session, Insights into creative sampling, and a special Producer Roulette Challenge feat. guest Music Producers.
          </p>
          
          <!-- Workshop Poster -->
          <div style="text-align: center; margin: 12px 0;">
            <img src="public/gigs/workshop.png?v=${Date.now()}" alt="OMNIVOID Workshop" style="
              max-width: 100%;
              height: auto;
              border: 1px solid #333;
              border-radius: 4px;
            ">
          </div>
          
          <!-- Registration Button -->
          <div style="text-align: center; margin: 12px 0;">
            <a href="https://tinyurl.com/ayjj553x" 
               target="_blank" 
               style="
                 display: inline-block;
                 padding: 12px 24px;
                 background: #99ccff;
                 color: #000;
                 text-decoration: none;
                 border-radius: 4px;
                 font-weight: bold;
                 font-size: 11px;
                 font-family: 'Space Mono', monospace;
                 transition: all 0.2s;
                 border: 1px solid #99ccff;
               "
               onmouseover="this.style.background='#66aaff'; this.style.borderColor='#66aaff'"
               onmouseout="this.style.background='#99ccff'; this.style.borderColor='#99ccff'">
              🎛️ REGISTER FOR WORKSHOP
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Create gigs content with tabbed interface
   */
  createGigsContent() {
    return `
      <div id="gigs-container" style="background: #0a0a0a;">
        <div style="border: 1px inset #333333; padding: 8px; margin-bottom: 8px; background: #0a0a0a; color: #99ccff;">
          
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
            Experience OMNIVOID live - from electrifying performances to immersive workshops. Join us in the digital consciousness.
          </p>
        </div>
        
        <!-- Tab Navigation -->
        <div style="
          display: flex;
          margin-bottom: 8px;
          border: 1px inset #333333;
          background: #1a1a1a;
        ">
          <button id="gig-tab" onclick="window.omnivoidApp.switchGigTab('gig')" style="
            flex: 1;
            padding: 8px;
            background: #99ccff;
            color: #000;
            border: none;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            font-family: 'Space Mono', monospace;
            transition: all 0.2s;
          ">🎵 LIVE GIG</button>
          <button id="workshop-tab" onclick="window.omnivoidApp.switchGigTab('workshop')" style="
            flex: 1;
            padding: 8px;
            background: #333;
            color: #99ccff;
            border: none;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            font-family: 'Space Mono', monospace;
            transition: all 0.2s;
          ">🔬 WORKSHOP</button>
        </div>
        
        <!-- Tab Content -->
        <div id="gig-content" class="gig-tab-content" style="
          border: 1px inset #333333;
          padding: 8px;
          background: #1a1a1a;
          display: block;
        ">
          <div style="text-align: center; margin-bottom: 12px;">
            <img src="public/gigs/gig.png" alt="OMNIVOID Live Gig" style="
              max-width: 100%;
              height: auto;
              border: 1px solid #333;
              border-radius: 4px;
            ">
          </div>
          <div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">🎵 OMNIVOID LIVE PERFORMANCE</h4>
            <p style="margin: 0 0 8px 0; font-size: 10px; color: #66aaff; line-height: 1.4;">
              Experience the full spectrum of OMNIVOID's experimental electronic soundscapes and immersive visual art. 
              A journey through digital consciousness and sonic exploration.
            </p>
            <div style="font-size: 9px; color: #999; margin-bottom: 8px;">
              <div><strong>Genre:</strong> Experimental Electronic / Ambient</div>
              <div><strong>Duration:</strong> 60-90 minutes</div>
              <div><strong>Visuals:</strong> Real-time audio-reactive art</div>
            </div>
          </div>
          <a href="https://outworld.fanpit.live/events/uRMP6QGV" target="_blank" style="
            display: block;
            text-align: center;
            padding: 8px 16px;
            background: #99ccff;
            color: #000000;
            text-decoration: none;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            font-family: 'Space Mono', monospace;
            transition: all 0.2s;
            cursor: pointer;
            opacity: 1;
          " title="Get tickets on Fanpit">
            🎫 GET TICKETS - FANPIT
          </a>
        </div>
        
        <div id="workshop-content" class="gig-tab-content" style="
          border: 1px inset #333333;
          padding: 8px;
          background: #1a1a1a;
          display: none;
        ">
          <div style="text-align: center; margin-bottom: 12px;">
            <img src="public/gigs/workshop.png?v=${Date.now()}" alt="OMNIVOID Workshop" style="
              max-width: 100%;
              height: auto;
              border: 1px solid #333;
              border-radius: 4px;
            ">
          </div>
          <div style="margin-bottom: 12px;">
            <h4 style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">🔬 OMNIVOID WORKSHOP</h4>
            <p style="margin: 0 0 8px 0; font-size: 10px; color: #66aaff; line-height: 1.4;">
              Dive deep into the world of experimental electronic music production and audio-reactive visual art. 
              Learn the techniques behind OMNIVOID's unique sound and visual aesthetic.
            </p>
            <div style="font-size: 9px; color: #999; margin-bottom: 8px;">
              <div><strong>Focus:</strong> Electronic Music Production</div>
              <div><strong>Duration:</strong> 3-4 hours</div>
              <div><strong>Level:</strong> Intermediate to Advanced</div>
            </div>
          </div>
          <a href="https://tinyurl.com/ayjj553x" target="_blank" style="
            display: block;
            text-align: center;
            padding: 8px 16px;
            background: #0066cc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
            font-family: 'Space Mono', monospace;
            transition: all 0.2s;
            cursor: pointer;
          " title="Register for the workshop">
            📝 REGISTER - GOOGLE FORM
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Create contact content with Instagram and partner logos
   */
  createContactContent() {
    return `
      <div id="contact-container" style="background: #0a0a0a;">
        
        <!-- Social Media Section -->
        <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
          <h4 style="margin: 0 0 12px 0; font-size: 11px; font-weight: bold; color: #99ccff;">LABS</h4>
          
          <!-- Main Instagram Logo and Link -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/omnivoid.labs/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logo.svg?v=${Date.now()}" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   filter: brightness(0) invert(1);
                 " 
                 alt="OMNIVOID">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@omnivoid.labs</div>              
            </div>
          </div>
        </div>
        
        <!-- Lab Rats Section -->
        <div style="border: 1px inset #333333; padding: 12px; background: #0a0a0a; color: #99ccff;">
          <h4 style="margin: 0 0 12px 0; font-size: 11px; font-weight: bold; color: #99ccff;">LAB RATS</h4>
          
                   
          <!-- The Juncando -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/the_juncando/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/ascii/WORM.svg" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   filter: brightness(0) invert(1);
                 " 
                 alt="WORM">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@the_juncando</div>
            </div>
          </div>
          
          <!-- Design Stein -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/designst3in/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/ascii/WORM.svg" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   filter: brightness(0) invert(1);
                 " 
                 alt="WORM">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@designst3in</div>
            </div>
          </div>
          
          <!-- Television Dust -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/television_dust/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/ascii/WORM.svg" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   filter: brightness(0) invert(1);
                 " 
                 alt="WORM">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@television_dust</div>
            </div>
          </div>
          
          <!-- Krishnamurthy -->
          <div style="
            display: flex;
            align-items: center;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/krishnamurthy/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/ascii/WORM.svg" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   filter: brightness(0) invert(1);
                 " 
                 alt="WORM">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@krishnamurthy</div>
            </div>
          </div>
          <!-- Roy Van Winkle -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/roydvanwinkle/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/ascii/WORM.svg" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   filter: brightness(0) invert(1);
                 " 
                 alt="WORM">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@roydvanwinkle</div>
            </div>
          </div>
        </div>
        
        <!-- Partners Section -->
        <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
          <h4 style="margin: 0 0 12px 0; font-size: 11px; font-weight: bold; color: #99ccff;">PARTNERS</h4>
          
          <!-- Royville Media -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/royvillemedia.film/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logos/royville.png" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   object-fit: contain;
                 " 
                 alt="Royville Media">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@royvillemedia.film</div>
            </div>
          </div>
          
          <!-- Quantum Climb -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/quantum.climb/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logos/QuantumClimb.png" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   object-fit: contain;
                 " 
                 alt="Quantum Climb">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@quantum.climb</div>
            </div>
          </div>
          
          <!-- The Inventory -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/theinventory.in/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logos/Inventory_logo.png" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   object-fit: contain;
                 " 
                 alt="The Inventory">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@theinventory.in</div>
            </div>
          </div>
          
          <!-- Pro Musicals -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/promusicals/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logos/ProMusicals1.jpg" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   object-fit: contain;
                 " 
                 alt="Pro Musicals">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@promusicals</div>
            </div>
          </div>
          
          <!-- The Chennai Scene -->
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/stories/thechennaiscene/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logos/Chennai_Scene_Trans.png" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   object-fit: contain;
                 " 
                 alt="The Chennai Scene">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@thechennaiscene</div>
            </div>
          </div>
          
          <!-- Aura Immerse -->
          <div style="
            display: flex;
            align-items: center;
            padding: 8px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 4px;
            transition: all 0.2s;
            cursor: pointer;
          " onclick="window.open('https://www.instagram.com/auraimmerse/', '_blank')" 
             onmouseover="this.style.borderColor='#99ccff'; this.style.background='#2a2a2a'" 
             onmouseout="this.style.borderColor='#333'; this.style.background='#1a1a1a'">
            <img src="public/logos/aura logo.png" 
                 style="
                   width: 32px;
                   height: 32px;
                   margin-right: 12px;
                   object-fit: contain;
                 " 
                 alt="Aura Immerse">
            <div>
              <div style="font-size: 11px; font-weight: bold; color: #99ccff;">@auraimmerse</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Switch between gig tabs
   */
  switchGigTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.gig-tab-content');
    tabContents.forEach(content => {
      content.style.display = 'none';
    });
    
    // Reset all tab button styles
    const tabButtons = document.querySelectorAll('#gig-tab, #workshop-tab');
    tabButtons.forEach(button => {
      button.style.background = '#333';
      button.style.color = '#99ccff';
    });
    
    // Show selected tab content
    const selectedContent = document.getElementById(tabName + '-content');
    if (selectedContent) {
      selectedContent.style.display = 'block';
    }
    
    // Update selected tab button style
    const selectedButton = document.getElementById(tabName + '-tab');
    if (selectedButton) {
      selectedButton.style.background = '#99ccff';
      selectedButton.style.color = '#000';
    }
  }

  /**
   * Expand gallery image to full view in a popup window
   */
  expandGalleryImage(filename, description) {
    // Close any existing popup first
    const existingPopup = document.querySelector('.gallery-popup-overlay');
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    // Create popup overlay
    const popup = document.createElement('div');
    popup.className = 'gallery-popup-overlay';
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;

    // Create popup content container
    const popupContent = document.createElement('div');
    popupContent.className = 'gallery-popup-content';
    popupContent.style.cssText = `
      background: #111111;
      border: 2px solid #99ccff;
      border-radius: 8px;
      max-width: 90vw;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 
        0 0 30px rgba(153, 204, 255, 0.3),
        0 0 60px rgba(153, 204, 255, 0.1);
      animation: popupSlideIn 0.3s ease;
      z-index: 10000;
    `;

    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #333333;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
    `;

    const title = document.createElement('h3');
    title.textContent = filename;
    title.style.cssText = `
      margin: 0;
      color: #99ccff;
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      font-weight: bold;
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
    `;

    // Close button hover effects
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#99ccff';
      closeButton.style.color = '#000000';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
      closeButton.style.color = '#99ccff';
    });

    // Close functionality
    const closePopup = () => {
      popup.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 300);
    };

    closeButton.addEventListener('click', closePopup);

    // Close on overlay click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closePopup();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
      text-align: center;
      padding: 16px;
    `;

    const image = document.createElement('img');
    image.src = `public/gallery/${filename}`;
    image.alt = filename;
    image.style.cssText = `
      max-width: 100%;
      max-height: 60vh;
      border: 1px solid #333333;
      border-radius: 4px;
      object-fit: contain;
    `;

    // Handle image load error
    image.onerror = () => {
      imageContainer.innerHTML = `
        <div style="
          padding: 40px;
          color: #99ccff;
          font-family: 'Space Mono', monospace;
          text-align: center;
        ">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <div>Image not found</div>
          <div style="font-size: 12px; color: #666; margin-top: 8px;">${filename}</div>
        </div>
      `;
    };

    imageContainer.appendChild(image);

    // Create description container
    const descriptionContainer = document.createElement('div');
    descriptionContainer.style.cssText = `
      padding: 16px;
      border-top: 1px solid #333333;
      background: #0a0a0a;
    `;

    const descriptionText = document.createElement('p');
    descriptionText.textContent = description;
    descriptionText.style.cssText = `
      margin: 0;
      color: #99ccff;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      line-height: 1.5;
      text-align: center;
    `;

    descriptionContainer.appendChild(descriptionText);

    // Assemble popup
    popupContent.appendChild(header);
    popupContent.appendChild(imageContainer);
    popupContent.appendChild(descriptionContainer);
    popup.appendChild(popupContent);

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes popupSlideIn {
        from { 
          opacity: 0;
          transform: scale(0.8) translateY(-20px);
        }
        to { 
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    
    if (!document.querySelector('#gallery-popup-styles')) {
      style.id = 'gallery-popup-styles';
      document.head.appendChild(style);
    }

    // Add popup to DOM
    document.body.appendChild(popup);
  }

  /**
   * Collapse gallery image (legacy method - now handled by popup close)
   */
  collapseGalleryImage() {
    // This method is now handled by the popup close functionality
    // Keeping for backward compatibility
    console.log('Gallery collapse handled by popup close');
  }

  /**
   * Create releases content
   */
  createReleasesContent() {
    // Documentation articles list
    const docArticles = [
      {
        filename: '01_Resonant_Architecture.txt',
        title: 'Resonant Architecture',
        description: 'Exploring sonic signatures in abandoned structures'
      },
      {
        filename: '02_Low-Frequency_Ritual.txt',
        title: 'Low-Frequency Ritual',
        description: 'Physiological impact of continuous low-frequency tones'
      },
      {
        filename: '03_Noise_as_Memory.txt',
        title: 'Noise as Memory',
        description: 'Preserving audio artifacts as carriers of sonic identity'
      },
      {
        filename: '04_Algorithmic_Folklore.txt',
        title: 'Algorithmic Folklore',
        description: 'Emergent patterns in modular synthesizer systems'
      },
      {
        filename: '05_Field_Recording_in_Transitional_Zones.txt',
        title: 'Field Recording in Transitional Zones',
        description: 'Sonic ecology of ports, checkpoints, and borders'
      },
      {
        filename: '06_Glitch_as_Narrative.txt',
        title: 'Glitch as Narrative',
        description: 'Digital glitches as compositional elements'
      },
      {
        filename: '07_Ethereal_Dub.txt',
        title: 'Ethereal Dub',
        description: 'Reimagining classic dub techniques for immersive soundfields'
      },
      {
        filename: '08_Sonic_Camouflage.txt',
        title: 'Sonic Camouflage',
        description: 'Creating compositions that blend into ambient environments'
      },
      {
        filename: '09_The_Ritual_Drone.txt',
        title: 'The Ritual Drone',
        description: 'How sustained drones alter perceptions of time'
      },
      {
        filename: '10_Beyond_Fidelity.txt',
        title: 'Beyond Fidelity',
        description: 'The emotive power of lo-fi recording techniques'
      }
    ];

    // Create notepad-style thumbnails HTML
    const thumbnailsHTML = docArticles.map((article, index) => {
      return `
        <div class="doc-thumbnail" 
             style="
               width: 80px;
               height: 100px;
               border: 2px outset #555555;
               background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
               cursor: pointer;
               transition: all 0.2s;
               position: relative;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
               padding: 4px;
               margin: 4px;
               box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
             "
             onmouseover="this.style.borderStyle='inset'; this.style.transform='scale(1.05)'; this.style.borderColor='#99ccff';"
             onmouseout="this.style.borderStyle='outset'; this.style.transform='scale(1)'; this.style.borderColor='#555555';"
             onclick="window.omnivoidApp.openDocument('${article.filename}', '${article.title.replace(/'/g, '\\\'')}')"
             title="Click to read: ${article.title}">
          
          <!-- Notepad header lines -->
          <div style="
            border-bottom: 1px solid #333333;
            height: 8px;
            margin-bottom: 2px;
          "></div>
          <div style="
            border-bottom: 1px solid #333333;
            height: 8px;
            margin-bottom: 2px;
          "></div>
          <div style="
            border-bottom: 1px solid #333333;
            height: 8px;
            margin-bottom: 4px;
          "></div>
          
          <!-- Document preview text -->
          <div style="
            flex: 1;
            font-size: 6px;
            line-height: 1.2;
            color: #99ccff;
            overflow: hidden;
            font-family: 'Space Mono', monospace;
          ">
            ${article.title.substring(0, 40)}...
          </div>
          
          <!-- File icon and name -->
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 4px;
            font-size: 7px;
            color: #66aaff;
            font-family: 'Space Mono', monospace;
          ">
            📄 ${article.filename.substring(0, 8)}...
          </div>
        </div>
      `;
    }).join('');

    return `
      <div id="releases-container" style="background: #0a0a0a;">
        <div style="border: 1px inset #333333; padding: 8px; margin-bottom: 8px; background: #0a0a0a; color: #99ccff;">
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
            Collection of research documents through time and from around the globe, exploring the intersection of sound science, tech, subcultures, humanities, and future methodologies in art.
          </p>
          <p style="margin: 0; font-size: 10px; color: #66aaff;">
            Click any document thumbnail to open in text viewer.
          </p>
        </div>
        
        <div id="doc-thumbnails" style="
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          align-content: flex-start;
          padding: 8px;
          border: 1px inset #333333;
          background: #1a1a1a;
          max-height: 280px;
          overflow-y: auto;
          gap: 4px;
        ">
          ${thumbnailsHTML}
        </div>
        
        <div style="
          border: 1px inset #333333;
          margin-top: 8px;
          background: #1a1a1a;
          padding: 8px;
          font-size: 10px;
          color: #99ccff;
        ">
          <strong>Navigation:</strong> Click any document to read • Press ESC or close button to return • ${docArticles.length} papers available
        </div>
      </div>
    `;
  }

  /**
   * Open document in text viewer popup
   */
  async openDocument(filename, title) {
    // Close any existing document popup first
    const existingPopup = document.querySelector('.document-popup-overlay');
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    // Fetch document content
    let documentContent = '';
    try {
      const response = await fetch(`public/docs/${filename}`);
      if (response.ok) {
        documentContent = await response.text();
      } else {
        documentContent = 'Error: Document not found or could not be loaded.';
      }
    } catch (error) {
      documentContent = `Error loading document: ${error.message}`;
    }

    // Create popup overlay
    const popup = document.createElement('div');
    popup.className = 'document-popup-overlay';
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;

    // Create popup content container
    const popupContent = document.createElement('div');
    popupContent.className = 'document-popup-content';
    popupContent.style.cssText = `
      background: #111111;
      border: 2px solid #99ccff;
      border-radius: 8px;
      width: 90vw;
      max-width: 800px;
      height: 90vh;
      overflow: hidden;
      box-shadow: 
        0 0 30px rgba(153, 204, 255, 0.3),
        0 0 60px rgba(153, 204, 255, 0.1);
      animation: popupSlideIn 0.3s ease;
      display: flex;
      flex-direction: column;
      z-index: 10000;
    `;

    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #333333;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      flex-shrink: 0;
    `;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      margin: 0;
      color: #99ccff;
      font-family: 'Space Mono', monospace;
      font-size: 14px;
      font-weight: bold;
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      font-family: 'Space Mono', monospace;
    `;

    // Close button hover effects
    closeButton.addEventListener('mouseenter', () => {
      closeButton.style.backgroundColor = '#99ccff';
      closeButton.style.color = '#000000';
    });

    closeButton.addEventListener('mouseleave', () => {
      closeButton.style.backgroundColor = 'transparent';
      closeButton.style.color = '#99ccff';
    });

    // Close functionality
    const closePopup = () => {
      popup.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 300);
    };

    closeButton.addEventListener('click', closePopup);

    // Close on overlay click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        closePopup();
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closePopup();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    header.appendChild(titleElement);
    header.appendChild(closeButton);

    // Create document content area
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background: #0a0a0a;
    `;

    const contentText = document.createElement('pre');
    contentText.textContent = documentContent;
    contentText.style.cssText = `
      margin: 0;
      color: #99ccff;
              font-family: 'Space Mono', monospace;
      font-size: 12px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    `;

    contentArea.appendChild(contentText);

    // Create footer with file info
    const footer = document.createElement('div');
    footer.style.cssText = `
      padding: 12px 16px;
      border-top: 1px solid #333333;
      background: #1a1a1a;
      flex-shrink: 0;
    `;

    const fileInfo = document.createElement('p');
    fileInfo.innerHTML = `
      <span style="color: #99ccff; font-family: 'Space Mono', monospace; font-size: 10px;">
        <strong>File:</strong> ${filename} • 
        <strong>Length:</strong> ${documentContent.length} characters • 
        <strong>Type:</strong> Research Document
      </span>
    `;
    fileInfo.style.margin = '0';

    footer.appendChild(fileInfo);

    // Assemble popup
    popupContent.appendChild(header);
    popupContent.appendChild(contentArea);
    popupContent.appendChild(footer);
    popup.appendChild(popupContent);

    // Add CSS animations if not already present
    if (!document.querySelector('#document-popup-styles')) {
      const style = document.createElement('style');
      style.id = 'document-popup-styles';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes popupSlideIn {
          from { 
            opacity: 0;
            transform: scale(0.8) translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Add popup to DOM
    document.body.appendChild(popup);
  }

  /**
   * Test Google Drive integration and log results
   */
  testGoogleDriveIntegration() {
    console.log('🧪 Testing Google Drive integration...');
    
    // Test configuration
    this.googleDriveConfig.log('Testing configuration access');
    console.log('📁 Google Drive Folders:', this.googleDriveConfig.FOLDERS);
    console.log('🔗 Master Folder URL:', this.googleDriveConfig.getFolderUrl());
    
    // Test folder URLs
    Object.entries(this.googleDriveConfig.FOLDERS).forEach(([key, value]) => {
      console.log(`📂 ${key}: ${value}`);
    });
    
          // Test Mixcloud integration
      console.log('🎵 Mixcloud integration ready for audio streaming');
    
    // Conundrum content already loaded at startup
    console.log('🧩 Conundrum content ready from startup');
    
    // Log success
    this.googleDriveConfig.log('Google Drive integration test completed successfully');
    console.log('✅ Google Drive integration is ready!');
  }

  /**
   * Create desktop advanced control panel (left sidebar)
   * Only visible on desktop screens (≥ 768px)
   */
  createDesktopAdvancedControls() {
    // This method is deprecated - desktop controls are now in the mobile menu






      // Starfield toggle
      this.desktopControlPanel.addCheckbox(
        'starfield',
        'Starfield',
        true,
        (checked) => {
          console.log('✦ Starfield:', checked ? 'ON' : 'OFF');
          if (this.starfield) {
            this.starfield.setVisibility(checked);
          }
        }
      );

      // Solar System toggle
      this.desktopControlPanel.addCheckbox(
        'solarSystem',
        'Solar System',
        false,
        (checked) => {
          console.log('☉ Solar System:', checked ? 'ON' : 'OFF');
          if (this.solarSystem) {
            this.solarSystem.setVisibility(checked);
          }
        }
      );

      this.desktopControlPanel.addSeparator();

      // Add audio controls
      this.desktopControlPanel.addHeading('🎵 AUDIO');
      
      // Play/Pause button
      this.desktopControlPanel.addCheckbox(
        'playPause',
        'Play/Pause',
        false,
        (checked) => {
          console.log('▶️ Play/Pause toggle:', checked ? 'Play' : 'Pause');
          if (this.audioManager) {
            if (checked) {
              this.audioManager.play();
            } else {
              this.audioManager.pause();
            }
          }
        }
      );
      
      // Volume slider
      this.desktopControlPanel.addSlider(
        'volume',
        'Volume',
        0,
        100,
        50,
        5,
        (value) => {
          console.log('🔊 Setting volume to:', value);
          if (this.audioManager) {
            this.audioManager.setVolume(value / 100);
          }
        }
      );
      
      // Mixcloud integration info
      this.desktopControlPanel.addHeading('📻 MIXCLOUD');
      
      // Add Mixcloud info
      const mixcloudInfo = document.createElement('div');
      mixcloudInfo.className = 'control-item';
      mixcloudInfo.innerHTML = `
        <div style="color: #99ccff; font-size: 12px;">
          <div>Streaming from: <a href="https://www.mixcloud.com/roydipankar8/" target="_blank" style="color: #66aaff;">roydipankar8</a></div>
          <div style="margin-top: 4px; font-size: 10px; color: #999;">
            Audio reactivity enabled for visual effects
          </div>
        </div>
      `;
      
      // Add Mixcloud info to the control panel
      const desktopControls = document.getElementById('desktop-controls');
      if (desktopControls) {
        desktopControls.appendChild(mixcloudInfo);
      }
      
      // Set initial values
      this.updateDesktopControlValues();
      
              console.log('✅ Desktop control panel initialized');
  }



  /**
   * Handle window resize for responsive controls
   */
  handleWindowResize() {
    console.log(`📱 Mobile window resize: ${window.innerWidth}px`);
    
    // Reset modal state on resize to prevent positioning issues
    this.resetModalState();
    
    // Mobile mode - show mobile controls
    console.log('📱 Mobile mode - showing mobile controls');
    this.showMobileControls();
  }

  /**
   * Hide mobile controls (for desktop mode) - Now unused since we show mobile controls on both
   */
  hideMobileControls() {
    // This function is no longer used since we show mobile controls on both desktop and mobile
    console.log('📱 hideMobileControls called but no longer hiding controls');
    
    // Keep floating menu visible on desktop
    if (this.floatingMenu) {
      this.floatingMenu.style.display = 'block';
      console.log('🍔 Floating menu kept visible on desktop');
    }
    
    if (this.hamburgerBtn) {
      this.hamburgerBtn.style.display = 'block';
      console.log('🍔 Hamburger button kept visible on desktop');
    }
  }

  /**
   * Show mobile controls (for mobile mode)
   */
  showMobileControls() {
    // Create mobile controls if they don't exist
    if (!this.minimalControls) {
      this.createMinimalControls();
    } else {
      // Show existing mobile controls
      this.minimalControls.style.display = 'flex';
      console.log('📱 Mobile controls shown');
    }
    
    // Create ASCIIVOID button
    this.createAsciiVoidButton();
    
    // Create Latest Gig button only if it doesn't exist
    if (!this.latestGigButton) {
      this.createLatestGigButton();
    }
    
    if (this.qrContainer) {
      this.qrContainer.style.display = 'flex';
    }
    
    if (this.agentControlsContainer) {
      this.agentControlsContainer.style.display = 'flex';
    }
    
    if (this.floatingMenu) {
      this.floatingMenu.style.display = 'block';
      console.log('🍔 Floating menu shown on mobile');
    }
    
    if (this.hamburgerBtn) {
      this.hamburgerBtn.style.display = 'block';
      console.log('🍔 Hamburger button shown on mobile');
    }
  }

  /**
   * Initialize mobile mode
   */
  initializeMobileMode() {
    console.log('📱 Initializing mobile mode...');
    
    // Create floating menu for mobile
    console.log('🍔 Creating floating menu...');
    this.createFloatingMenu();
    console.log('🍔 Floating menu creation completed');
    
    // Create mobile controls
    this.showMobileControls();
  }



  
  /**
   * Emergency close function - can be called from console if needed
   */
  emergencyCloseAllModals() {
    console.log('🚨 Emergency closing all modals...');
    this.closeAllYouTubeModals();
    
    // Force remove any remaining modal elements
    const allModals = document.querySelectorAll('.youtube-modal, .youtube-player-container');
    allModals.forEach(modal => {
      try {
        if (modal && modal.parentNode) {
          modal.parentNode.removeChild(modal);
        } else if (modal && modal.remove) {
          modal.remove();
        }
      } catch (error) {
        console.error('Error removing modal:', error);
      }
    });
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    console.log('✅ Emergency close completed');
  }

  /**
   * Load PDF research papers from Google Drive
   */
  async loadPDFResearchPapers() {
    try {
      console.log('📚 Loading PDF research papers from Google Drive...');
      
      // Real PDF papers from the research folder
      const pdfPapers = [
        {
          filename: 'hampshire-topping-burbano-cifuentes-aubry.pdf',
          title: 'Hampshire Topping Burbano Cifuentes Aubry',
          description: 'Research on experimental music and sound art',
          url: 'https://drive.google.com/file/d/1_2QgRCXMR8CNq5ghbxGahtoXOJiE2ryW/view?usp=sharing',
          thumbnail: null
        },
        {
          filename: 'Post-Music Stephenie Egedy.pdf',
          title: 'Post-Music: Stephenie Egedy',
          description: 'Theoretical framework for post-musical composition',
          url: 'https://drive.google.com/file/d/1ZJF3_NeCo7JurGKkywMfeRiR8HlX67pO/view?usp=sharing',
          thumbnail: null
        },
        {
          filename: 'Shape_brochure_2022_2025_digi-1.pdf',
          title: 'Shape Brochure 2022-2025',
          description: 'Digital arts and experimental music festival documentation',
          url: 'https://drive.google.com/file/d/1PsOLCd_k7st5sUC4zInComL1xrEYSdUB/view?usp=sharing',
          thumbnail: null
        },
        {
          filename: 'SONIC WARFARE_ STEVE GOODMAN.pdf',
          title: 'Sonic Warfare: Steve Goodman',
          description: 'Critical analysis of sound as weapon and resistance',
          url: 'https://drive.google.com/file/d/1nrFQ_FQFML4TwlJOth-N8SCGsRPf9MrC/view?usp=sharing',
          thumbnail: null
        },
        {
          filename: 'Sound_system_culture_Place_space_and_identity_in_t.pdf',
          title: 'Sound System Culture: Place, Space and Identity',
          description: 'Cultural studies of sound system communities',
          url: 'https://drive.google.com/file/d/1O3u2kJYQJlRxRvl_0uA-kqphuXOxGV2f/view?usp=sharing',
          thumbnail: null
        },
        {
          filename: 'WHAT_IS_BLACK_METAL_THEORY.pdf',
          title: 'What Is Black Metal Theory?',
          description: 'Philosophical and theoretical approaches to extreme music',
          url: 'https://drive.google.com/file/d/1s-seagVZWHgQucMgu6OvItAKUvfSZ5SH/view?usp=sharing',
          thumbnail: null
        }
      ];
      
      this.pdfResearchPapers = pdfPapers;
      this.updateReleasesContent();
      
    } catch (error) {
      console.error('❌ Error loading PDF research papers:', error);
    }
  }

  /**
   * Load dynamic content from Google Drive text files
   */
  async loadDynamicContent() {
    console.log('📄 Loading dynamic content from Google Drive...');
    
    try {
      // Load Conundrum content
      await this.loadConundrumContent();
      
      // Load Contact content
      await this.loadContactContent();
      
      console.log('✅ Dynamic content loaded successfully');
    } catch (error) {
      console.log('❌ Error loading dynamic content:', error);
    }
  }

  /**
   * Load Conundrum content from local file
   */
  async loadConundrumContent() {
    try {
      console.log('🧩 Loading Conundrum content from local file...');
      console.log('📁 File path: ./public/links/conundrum.txt');
      
      // Read the conundrum.txt file from the public/links folder
      const content = await readPublicFile('./public/links/conundrum.txt');
      
      console.log('📄 Raw content received:', content ? 'YES' : 'NO');
      console.log('📄 Content length:', content ? content.length : 0);
      console.log('📄 First 100 chars:', content ? content.substring(0, 100) : 'NONE');
      
      if (content) {
        // Parse the content to extract title and body
        const lines = content.split('\n');
        console.log('📝 Total lines:', lines.length);
        console.log('📝 Line 0 (title):', lines[0]);
        console.log('📝 Line 1:', lines[1]);
        console.log('📝 Line 2:', lines[2]);
        
        const title = lines[0] || 'CONUNDRUM';
        const bodyContent = lines.slice(1).join('\n') || '';
        
        console.log('🏷️ Final title:', title);
        console.log('📖 Final body content length:', bodyContent.length);
        console.log('📖 Body preview:', bodyContent.substring(0, 100));
        
        this.conundrumContent = {
          title: title,
          content: bodyContent
        };
        console.log('🎯 this.conundrumContent set to:', this.conundrumContent);
        

      } else {
        // Fallback to placeholder content if fetch fails
        this.conundrumContent = {
          title: 'CONUNDRUM',
          content: `Welcome to the OMNIVOID experience. This retro-style interface brings you back to the golden age of computing while delivering cutting-edge audio-visual artistry.

Navigate through our immersive soundscapes and discover the hidden layers of digital consciousness that lie beneath the surface of reality.

System Status: All systems operational
Audio Engine: Web Audio API v2.0
Visual Processing: Canvas 2D + WebGL
Particle Systems: Active

The conundrum lies in the space between digital and analog, between past and future, between what is seen and what is felt.`
        };
        console.log('⚠️ Using fallback Conundrum content');
      }
    } catch (error) {
      console.log('❌ Error loading Conundrum content:', error);
      // Fallback content
      this.conundrumContent = {
        title: 'CONUNDRUM',
        content: 'Content loading failed. Please check your connection.'
      };
    }
  }



  /**
   * Load Contact content from Google Drive
   */
  async loadContactContent() {
    try {
      console.log('📧 Loading Contact content from local file...');
      
      // Read the contact.txt file from the public/links folder (same method as live_transmissions.txt)
      const content = await readPublicFile('./public/links/contact.txt');
      
      if (content) {
        // Parse the content to extract title and body
        const lines = content.split('\n').filter(line => line.trim());
        const title = lines[0] || 'CONTACT';
        const bodyContent = lines.slice(1).join('\n') || '';
        
        this.contactContent = {
          title: title,
          content: bodyContent
        };
      } else {
        // Fallback to placeholder content if fetch fails
        this.contactContent = {
          title: 'CONTACT',
          content: `Connect with the OMNIVOID collective. We're always interested in collaborations and feedback.

Email: contact@omnivoid.net
GitHub: github.com/QuantumClimb/omnivoid
Status: Available for projects

Let's create something extraordinary together.`
        };
        console.log('⚠️ Using fallback Contact content');
      }
    } catch (error) {
      console.log('❌ Error loading Contact content:', error);
      // Fallback content
      this.contactContent = {
        title: 'CONTACT OMNIVOID',
        content: 'Content loading failed. Please check your connection.'
      };
    }
  }

  /**
   * Update releases content with PDF papers
   */
  updateReleasesContent() {
    const container = document.getElementById('releases-container');
    if (!container || !this.pdfResearchPapers) return;
    
    const thumbnailsContainer = container.querySelector('#doc-thumbnails');
    if (!thumbnailsContainer) return;
    
    // Clear existing content
    thumbnailsContainer.innerHTML = '';
    
    // Add PDF thumbnails
    this.pdfResearchPapers.forEach((paper, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'pdf-thumbnail';
      thumbnail.style.cssText = `
        width: 80px;
        height: 100px;
        border: 2px outset #555555;
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px;
        margin: 4px;
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
      `;
      
      thumbnail.innerHTML = `
        <!-- Research icon -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          width: 40px;
        ">
          <img src="./public/menuicons/research.png" alt="Research" style="
            width: 32px;
            height: 32px;
            filter: invert(1) sepia(1) saturate(5) hue-rotate(200deg);
          ">
        </div>
        
        <!-- Document title -->
        <div style="
          flex: 1;
          font-size: 8px;
          line-height: 1.2;
          color: #99ccff;
          overflow: hidden;
          font-family: 'Space Mono', monospace;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          ${paper.title}
        </div>
        
        <!-- File type indicator -->
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
          font-size: 7px;
          color: #66aaff;
          font-family: 'Space Mono', monospace;
        ">
          PDF
        </div>
      `;
      
      // Add hover effects
      thumbnail.addEventListener('mouseenter', () => {
        thumbnail.style.borderStyle = 'inset';
        thumbnail.style.transform = 'scale(1.05)';
        thumbnail.style.borderColor = '#99ccff';
      });
      
      thumbnail.addEventListener('mouseleave', () => {
        thumbnail.style.borderStyle = 'outset';
        thumbnail.style.transform = 'scale(1)';
        thumbnail.style.borderColor = '#555555';
      });
      
      // Add click handler
      thumbnail.addEventListener('click', () => {
        this.openPDFDocument(paper.filename, paper.title, paper.url);
      });
      
      thumbnail.title = `Click to view: ${paper.title}`;
      thumbnailsContainer.appendChild(thumbnail);
    });
  }

  /**
   * Open PDF document in viewer
   */
  async openPDFDocument(filename, title, url) {
    console.log(`📄 Opening PDF: ${filename} - ${title}`);
    
    // Close any existing popup first
    const existingPopup = document.querySelector('.pdf-viewer-overlay');
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    // Create PDF viewer overlay
    const popup = document.createElement('div');
    popup.className = 'pdf-viewer-overlay';
    popup.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease;
    `;

    // Create PDF viewer content container
    const viewerContent = document.createElement('div');
    viewerContent.className = 'pdf-viewer-content';
    viewerContent.style.cssText = `
      background: #111111;
      border: 2px solid #99ccff;
      border-radius: 8px;
      width: 95vw;
      max-width: 1200px;
      height: 95vh;
      overflow: hidden;
      box-shadow: 
        0 0 30px rgba(153, 204, 255, 0.3),
        0 0 60px rgba(153, 204, 255, 0.1);
      animation: popupSlideIn 0.3s ease;
      display: flex;
      flex-direction: column;
      z-index: 10000;
    `;

    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #333333;
      background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
      flex-shrink: 0;
    `;

    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.cssText = `
      margin: 0;
      color: #99ccff;
      font-size: 14px;
      font-family: 'Space Mono', monospace;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
      background: #333333;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    `;

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.backgroundColor = '#99ccff';
      closeBtn.style.color = '#000000';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.backgroundColor = '#333333';
      closeBtn.style.color = '#99ccff';
    });

    closeBtn.addEventListener('click', () => {
      document.body.removeChild(popup);
    });

    header.appendChild(titleElement);
    header.appendChild(closeBtn);

    // Create PDF viewer iframe
    const pdfViewer = document.createElement('iframe');
    pdfViewer.style.cssText = `
      flex: 1;
      width: 100%;
      border: none;
      background: #ffffff;
    `;
    
    // Set PDF source - using Google Drive viewer
    if (url && !url.includes('FILE_ID_')) {
      // Convert Google Drive URL to viewer format
      const driveId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (driveId) {
        pdfViewer.src = `https://drive.google.com/file/d/${driveId}/preview`;
        console.log(`📄 Loading PDF from Google Drive: ${driveId}`);
      } else {
        pdfViewer.src = url;
        console.log(`📄 Loading PDF from URL: ${url}`);
      }
    } else {
      // Show helpful message for placeholder URLs
      pdfViewer.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #ffaa44;
          font-family: 'Space Mono', monospace;
        ">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 16px;">⚠️</div>
            <div style="font-size: 16px; margin-bottom: 12px;">PDF URL Not Configured</div>
            <div style="font-size: 12px; margin-bottom: 16px; color: #999999; max-width: 400px; line-height: 1.4;">
              This PDF needs to be configured with a proper Google Drive URL.
            </div>
            <div style="font-size: 11px; color: #66aaff; background: #1a1a1a; padding: 12px; border-radius: 4px; border: 1px solid #333333;">
              <strong>To fix:</strong><br>
              1. Right-click the PDF in Google Drive<br>
              2. Select "Get link"<br>
              3. Copy the link<br>
              4. Update the URL in the code
            </div>
          </div>
        </div>
      `;
      console.log(`⚠️ PDF URL not configured for: ${filename}`);
      return; // Don't add event listeners since we're showing a message
    }

    // Add error handling
    pdfViewer.onerror = () => {
      pdfViewer.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #ff4444;
          font-family: 'Space Mono', monospace;
        ">
          <div style="text-align: center;">
            <div style="font-size: 24px; margin-bottom: 16px;">❌</div>
            <div>Error loading PDF</div>
            <div style="font-size: 12px; margin-top: 8px; color: #999999;">
              The PDF could not be loaded. Please check the URL or try again.
            </div>
          </div>
        </div>
      `;
    };

    // Assemble the viewer
    viewerContent.appendChild(header);
    viewerContent.appendChild(pdfViewer);
    popup.appendChild(viewerContent);

    // Add to document
    document.body.appendChild(popup);

    // Close on background click
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        document.body.removeChild(popup);
      }
    });

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        document.body.removeChild(popup);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  /**
   * Audio proxy system to avoid CORS issues
   */
  audioProxy = {
    isActive: false,
    audioContext: null,
    audioElement: null,
    analyser: null,
    source: null,
    iframeSource: null,
    testOscillator: null,
    testGain: null
  };

  /**
   * Initialize audio proxy system
   */
  initializeAudioProxy() {
    console.log('🎵 Initializing audio proxy system...');
    
    try {
      // Use the main audio manager's context instead of creating a new one
      if (this.audioManager && this.audioManager.audioContext) {
        this.audioProxy.audioContext = this.audioManager.audioContext;
        this.audioProxy.analyser = this.audioManager.analyser;
        console.log('✅ Audio proxy using main audio manager context');
      } else {
        // Fallback: create new context only if main one doesn't exist
        this.audioProxy.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioProxy.analyser = this.audioProxy.audioContext.createAnalyser();
        
        // Configure analyser
        this.audioProxy.analyser.fftSize = 256;
        this.audioProxy.analyser.smoothingTimeConstant = 0.8;
        console.log('✅ Audio proxy created new audio context');
      }
      
      console.log('✅ Audio proxy system initialized');
      this.audioProxy.isActive = true;
      
    } catch (error) {
      console.log('❌ Error initializing audio proxy:', error);
      this.audioProxy.isActive = false;
    }
  }

  /**
   * Start audio proxy with Mixcloud stream
   */
  startAudioProxy() {
    if (!this.audioProxy.isActive) {
      console.log('⚠️ Audio proxy not active, initializing...');
      this.initializeAudioProxy();
    }
    
    console.log('🎵 Starting audio proxy for Mixcloud...');
    
    try {
      // Create audio element for Mixcloud stream
      this.audioProxy.audioElement = new Audio();
      this.audioProxy.audioElement.crossOrigin = 'anonymous';
      this.audioProxy.audioElement.loop = true;
      
      // Set up audio source from Mixcloud
      this.setupMixcloudAudioSource();
      
      // Connect to analyser (use the same analyser from main audio manager)
      this.audioProxy.source = this.audioProxy.audioContext.createMediaElementSource(this.audioProxy.audioElement);
      
      // Connect to the main audio manager's analyser for visual effects
      if (this.audioManager && this.audioManager.analyser) {
        this.audioProxy.source.connect(this.audioManager.analyser);
        console.log('✅ Audio proxy connected to main audio manager analyser');
      } else {
        // Fallback: connect to proxy analyser
        this.audioProxy.source.connect(this.audioProxy.analyser);
        console.log('✅ Audio proxy connected to proxy analyser');
      }
      
      console.log('✅ Audio proxy started successfully');
      this.updateReactivityStatus('Audio proxy active - Audio stream connected');
      
    } catch (error) {
      console.log('❌ Error starting audio proxy:', error);
      this.updateReactivityStatus('Audio proxy failed - ' + error.message);
    }
  }

  /**
   * Setup Mixcloud audio source through proxy
   */
  setupMixcloudAudioSource() {
    console.log('🔗 Setting up Mixcloud audio source...');
    
    const proxyAudioUrl = this.getProxyAudioUrl();
    
    if (proxyAudioUrl) {
      // Use proxy audio source
      this.audioProxy.audioElement.src = proxyAudioUrl;
      this.audioProxy.audioElement.load();
      
      // Start playing when ready
      this.audioProxy.audioElement.addEventListener('canplay', () => {
        console.log('🎵 Audio proxy ready to play');
        this.audioProxy.audioElement.play().catch(error => {
          console.log('⚠️ Auto-play blocked:', error);
          this.updateReactivityStatus('Click to start audio proxy');
        });
      });
      
    } else {
      console.log('⚠️ No proxy audio URL - falling back to iframe capture');
      this.updateReactivityStatus('Using Mixcloud iframe capture');
      
      // Try to capture audio directly from Mixcloud iframe
      this.attemptIframeCapture();
    }
  }

  /**
   * Get proxy audio URL from our proxy server
   */
  getProxyAudioUrl() {
    // Use our local proxy server to avoid CORS issues
    const proxyUrl = 'http://localhost:3001/proxy/mixcloud';
    
    // For testing, we can use a sample audio stream
    // In production, this would be a real Mixcloud stream URL
    const testStreamUrl = 'https://www.mixcloud.com/roydipankar8/';
    
    // Return the proxy URL with the Mixcloud stream
    return `${proxyUrl}?url=${encodeURIComponent(testStreamUrl)}`;
    
    // Note: This will only work if Mixcloud provides direct stream URLs
    // Most music platforms don't expose direct audio streams for security
  }

  /**
   * Stop audio proxy
   */
  stopAudioProxy() {
    if (this.audioProxy.audioElement) {
      this.audioProxy.audioElement.pause();
      this.audioProxy.audioElement.src = '';
    }
  }

  /**
   * Stop Mixcloud audio when radio window is closed
   */
  stopMixcloudAudio() {
    console.log('🎵 Stopping Mixcloud audio...');
    const mixcloudPlayer = document.getElementById('mixcloud-player');
    if (mixcloudPlayer) {
      // Remove the iframe from DOM to stop audio
      console.log('🎵 Removing Mixcloud iframe from DOM');
      mixcloudPlayer.remove();
      
      // Also try to pause via postMessage as backup
      try {
        mixcloudPlayer.contentWindow.postMessage('{"method":"pause"}', '*');
      } catch (error) {
        console.log('🎵 Could not pause Mixcloud player via postMessage:', error);
      }
    } else {
      console.log('🎵 Mixcloud player iframe not found');
    }
  }

  /**
   * Recreate Mixcloud iframe when radio window is opened
   */
  recreateMixcloudIframe() {
    console.log('🎵 Initializing Mixcloud when radio window opened...');
    this.initializeMixcloudWidget();
  }

  /**
   * Get audio data from proxy
   */
  getProxyAudioData() {
    if (!this.audioProxy.isActive || !this.audioProxy.analyser) {
      return null;
    }
    
    const dataArray = new Float32Array(this.audioProxy.analyser.frequencyBinCount);
    this.audioProxy.analyser.getFloatFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Attempt to capture audio directly from Mixcloud iframe
   */
  attemptIframeCapture() {
    console.log('🎵 Attempting iframe audio capture...');
    
    try {
      const mixcloudFrame = document.getElementById('mixcloud-player');
      if (!mixcloudFrame) {
        console.log('❌ Mixcloud iframe not found');
        this.updateReactivityStatus('Mixcloud iframe not found');
        return;
      }
      
      // Wait for iframe to be fully loaded
      setTimeout(() => {
        try {
          // Try to access iframe content
          if (mixcloudFrame.contentWindow) {
            console.log('✅ Mixcloud iframe accessible');
            
            // Look for audio elements in the iframe
            const iframeDoc = mixcloudFrame.contentWindow.document;
            if (iframeDoc) {
              const audioElements = iframeDoc.querySelectorAll('audio, video');
              console.log(`🎵 Found ${audioElements.length} audio/video elements in iframe`);
              
              if (audioElements.length > 0) {
                // Try to connect the first audio element
                this.connectIframeAudio(audioElements[0]);
              } else {
                console.log('⚠️ No audio elements found in iframe');
                this.updateReactivityStatus('No audio elements in Mixcloud iframe');
              }
            } else {
              console.log('⚠️ Cannot access iframe document (CORS restriction)');
              this.updateReactivityStatus('CORS restriction - iframe not accessible');
            }
          }
        } catch (error) {
          console.log('⚠️ CORS error accessing iframe:', error.message);
          this.updateReactivityStatus('CORS blocked - iframe not accessible');
        }
      }, 2000); // Wait 2 seconds for iframe to load
      
    } catch (error) {
      console.log('❌ Error in iframe capture:', error);
      this.updateReactivityStatus('Iframe capture failed: ' + error.message);
    }
  }

  /**
   * Connect iframe audio to our audio context
   */
  connectIframeAudio(audioElement) {
    try {
      console.log('🔗 Connecting iframe audio to audio context...');
      
      if (this.audioManager && this.audioManager.audioContext) {
        // Create a media stream source from the audio element
        const stream = audioElement.captureStream();
        const source = this.audioManager.audioContext.createMediaStreamSource(stream);
        
        // Connect to our analyser
        source.connect(this.audioManager.analyser);
        
        console.log('✅ Iframe audio connected to audio context');
        this.updateReactivityStatus('Mixcloud audio captured - Visual effects active!');
        
        // Store the source for cleanup
        this.audioProxy.iframeSource = source;
        
      } else {
        console.log('❌ Audio manager not available');
        this.updateReactivityStatus('Audio manager not available');
      }
    } catch (error) {
      console.log('⚠️ Error connecting iframe audio:', error);
      this.updateReactivityStatus('Iframe connection failed: ' + error.message);
    }
  }



  /**
   * Set up console commands for color system exploration
   */
  setupConsoleCommands() {
    // Make color system accessible from console
    window.omnivoidColors = {
      // Get current theme info
      getTheme: () => this.themeManager.getCurrentTheme(),
      
      // Get current color strategy
      getStrategy: () => this.themeManager.getCurrentStrategy(),
      
      // Get all available color strategies
      getStrategies: () => this.themeManager.getColorStrategyInfo(),
      
      // Preview a specific strategy
      previewStrategy: (strategyName) => this.themeManager.previewColorStrategy(strategyName),
      
      // Force new random colors
      newColors: () => {
        if (this.themeManager.getCurrentTheme() === 'random') {
          this.themeManager.forceNewRandomTheme();
          console.log('🎨 New random colors generated!');
          console.log('🎲 Agent structure also randomized!');
        } else {
          console.log('⚠️ Not in random theme. Switch to random theme first.');
        }
      },
      
      // Manually randomize agent structure
      randomizeAgents: () => {
        if (this.agentSystem) {
          this.agentSystem.randomizeStructure();
          console.log('🎲 Agent structure manually randomized!');
        } else {
          console.log('⚠️ Agent system not available');
        }
      },
      
      // Manually randomize polygon echo
      randomizePolygon: () => {
        if (this.polygonEcho) {
          this.polygonEcho.randomize();
          console.log('⬟ Polygon echo manually randomized!');
        } else {
          console.log('⚠️ Polygon echo not available');
        }
      },
      

      
      // Help
      help: () => {
        console.log(`
🎨 OMNIVOID Color System Console Commands:

📋 Info:
  omnivoidColors.getTheme()      - Get current theme
  omnivoidColors.getStrategy()   - Get current color strategy
  omnivoidColors.getStrategies() - List all available strategies

🎯 Actions:
  omnivoidColors.newColors()     - Generate new random colors
  omnivoidColors.randomizeAgents() - Manually randomize agent structure
  omnivoidColors.randomizePolygon() - Manually randomize polygon echo
  omnivoidColors.previewStrategy('strategy-name') - Preview a strategy

🔍 Available Strategies:
  - complementary: Opposite colors for high contrast
  - triadic: Three equally spaced colors
  - analogous: Adjacent colors for smooth transitions
  - monochromatic: Same hue variations
  - split-complementary: Base + adjacent to complement
  - random-spectrum: Full spectrum randomness

💡 Tips:
  - Click theme button to cycle themes
  - Double-click theme button in random mode for new strategy
  - Colors only change when you click - no automatic changes
  - Agent count and connection distance also randomize with colors
  - Use polygon echo toggle button (⬟) for geometric overlay effects
        `);
      }
    };
    
    console.log(`
🎨 OMNIVOID Color System loaded!
Type 'omnivoidColors.help()' to see available commands.
    `);
  }

  /**
   * Start music playback
   */
  async startMusic() {
    try {
      console.log('🎵 Starting music...');
      
      if (this.musicFiles.length === 0) {
        console.log('🎵 No music files found');
        return;
      }
      
      // Create audio element if not exists
      if (!this.currentMusic) {
        this.currentMusic = new Audio();
        this.currentMusic.loop = true;
        this.currentMusic.volume = 0.7;
        
        // Connect to audio manager for reactivity
        if (this.audioManager) {
          this.audioManager.setAudioElement(this.currentMusic);
          console.log('🎵 Connected to audio manager for reactivity');
        }
      }
      
      // Set source and play
      this.currentMusic.src = this.musicFiles[this.currentMusicIndex];
      await this.currentMusic.play();
      this.isMusicPlaying = true;
      
      // Force start audio analysis for reactivity
      if (this.audioManager && this.audioManager.forceStartAnalysis) {
        this.audioManager.forceStartAnalysis();
      }
      
      console.log(`🎵 Playing: ${this.musicFiles[this.currentMusicIndex]}`);
      
    } catch (error) {
      console.error('🎵 Failed to start music:', error);
    }
  }

  /**
   * Stop music playback
   */
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.isMusicPlaying = false;
      console.log('🎵 Music stopped');
    }
  }

  /**
   * Next track
   */
  nextTrack() {
    if (this.musicFiles.length > 0) {
      this.currentMusicIndex = (this.currentMusicIndex + 1) % this.musicFiles.length;
      if (this.isMusicPlaying) {
        this.stopMusic();
        this.startMusic();
      }
    }
  }

  /**
   * Previous track
   */
  previousTrack() {
    if (this.musicFiles.length > 0) {
      this.currentMusicIndex = (this.currentMusicIndex - 1 + this.musicFiles.length) % this.musicFiles.length;
      if (this.isMusicPlaying) {
        this.stopMusic();
        this.startMusic();
      }
    }
  }

  /**
   * Handle keyboard controls
   */
  handleKeyPress(event) {
    if (!this.isInitialized) return;
    
    switch(event.key) {
      case ' ':
        event.preventDefault();
        if (this.isMusicPlaying) {
          this.stopMusic();
        } else {
          this.startMusic();
        }
        break;
      case 'ArrowRight':
        this.nextTrack();
        break;
      case 'ArrowLeft':
        this.previousTrack();
        break;
    }
  }
}
