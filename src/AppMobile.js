import { AgentSystem } from './components/AgentSystem.js';
import { Logo } from './components/Logo.js';
import { AudioManager } from './controllers/AudioManager.js';
import { ThemeManager } from './controllers/ThemeManager.js';
import { SplashScreen } from './components/SplashScreen.js';
import { RetroWindow } from './components/RetroWindow.js';
import { GOOGLE_DRIVE_CONFIG, readPublicFile } from './config/googleDrive.js';

// Import all other components but keep them hidden initially
import { Grid } from './components/Grid.js';
import { SolarSystem } from './components/SolarSystem.js';
import { Starfield } from './components/Starfield.js';
import { VectorGrid } from './components/VectorGrid.js';
import { ASCIITunnel } from './components/ASCIITunnel.js';
import { Cylinder3D } from './components/Cylinder3D.js';
import { Headline } from './components/Headline.js';
import { AnimationController } from './controllers/AnimationController.js';
import { ControlPanel } from './controllers/ControlPanel.js';

/**
 * Main App class for OMNIVOID - minimal experience with agents and logo
 */
export class App {
  constructor() {
    console.log('🚀 OMNIVOID Mobile App initializing...');
    
    // Make this instance globally accessible for the radio file explorer
    window.omnivoidApp = this;
    
    // Initialize theme manager first
    this.themeManager = new ThemeManager();
    
    // Initialize audio manager
    this.audioManager = new AudioManager();
    
    // Google Drive integration
    this.googleDriveConfig = GOOGLE_DRIVE_CONFIG;
    this.googleDriveConfig.log('AppMobile initialized with Google Drive integration');
    
    // Mixcloud integration properties
    this.googleDriveConfig.log('Mixcloud integration ready');
    this.googleDriveConfig.log('Available folders:', this.googleDriveConfig.FOLDERS);
    
    // Initialize splash screen
    this.splashScreen = new SplashScreen();
    this.splashScreen.log('Initializing OMNIVOID...', 10);
    
    // Initialize components in sequence
    this.initializeComponents();

    console.log('📱 Mobile App initialized');
  }

  /**
   * Initialize the OMNIVOID application
   */
  async initializeComponents() {
    try {
      // Initialize core managers
      this.splashScreen.log('📦 Loading core systems...', 15);
      this.animationController = new AnimationController();
      
      // Initialize audio system
      this.splashScreen.log('🎵 Initializing audio...', 25);
      await this.audioManager.initializeAudioContext();
      
      // Audio system ready for Mixcloud integration
      this.splashScreen.log('📥 Audio system ready...', 35);
      this.googleDriveConfig.log('Audio system ready for Mixcloud integration');
      
      this.splashScreen.log('✅ Audio ready', 45);
      this.googleDriveConfig.log('Audio system initialized for external audio sources');

      // Initialize visible components (AgentSystem, Logo only)
      this.splashScreen.log('✨ Loading visual elements...', 55);
      this.agentSystem = new AgentSystem(this.audioManager);
      this.logo = new Logo(this.audioManager);
      
      // Initialize all other components but keep them hidden (for future use)
      this.splashScreen.log('🔧 Loading components...', 65);
      this.controlPanel = new ControlPanel('control-panels');
      this.starfield = new Starfield();
      this.vectorGrid = new VectorGrid();
      this.asciiTunnel = new ASCIITunnel();
      this.cylinder3D = new Cylinder3D();
      this.grid = new Grid();
      this.solarSystem = new SolarSystem();
      this.headline = new Headline(this.audioManager);
      
      // Hide advanced visual layers but keep starfield visible
      this.hideAdvancedLayers();
      
      // Set up responsive controls based on device
      this.splashScreen.log('📱 Setting up responsive controls...', 85);
      
      // Complete initialization
      this.splashScreen.log('🌌 Welcome to OMNIVOID', 100);
      
      // Test Google Drive integration
      this.testGoogleDriveIntegration();
      
      // Initialize responsive mode based on screen size
      this.initializeResponsiveMode();
      
      // Add window resize listener for responsive controls
      window.addEventListener('resize', () => this.handleWindowResize());
      
      // Hide splash screen
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
      
    } catch (error) {
      this.splashScreen.log(`❌ Error: ${error.message}`, 100);
      console.error('Initialization error:', error);
    }
  }

  /**
   * Hide advanced visual layers but keep starfield visible for minimal experience
   */
  hideAdvancedLayers() {
    // Keep starfield visible - it's part of the minimal experience
    this.starfield.setVisibility(true);
    
    // Hide other advanced layers
    this.vectorGrid.setVisibility(false);
    this.asciiTunnel.setVisibility(false);
    this.cylinder3D.setVisibility(false);
    this.grid.setVisibility(false);
    this.solarSystem.setVisibility(false);
    this.headline.setVisibility(false);
    
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
    // Add mobile-responsive CSS styles
    this.addMobileStyles();
    
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'minimal-controls';
    controlsContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      z-index: 1001;
      background: #111111;
      backdrop-filter: blur(10px);
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #333333;
      box-shadow: 
        0 0 20px rgba(153, 204, 255, 0.2),
        4px 4px 8px rgba(0, 0, 0, 0.5);
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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
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
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
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
    
    // Theme toggle button
    const themeBtn = document.createElement('button');
    themeBtn.className = 'minimal-control-btn';
    themeBtn.innerHTML = '🌙';
    themeBtn.title = 'Toggle Theme';
    themeBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
      flex-shrink: 0;
    `;
    
    themeBtn.addEventListener('mouseenter', () => {
      themeBtn.style.backgroundColor = '#99ccff';
      themeBtn.style.color = '#000000';
    });
    
    themeBtn.addEventListener('mouseleave', () => {
      themeBtn.style.backgroundColor = 'transparent';
      themeBtn.style.color = '#99ccff';
    });
    
    themeBtn.addEventListener('click', () => {
      this.themeManager.toggleTheme();
      // Update icon based on theme
      if (document.body.classList.contains('light-theme')) {
        themeBtn.innerHTML = '☀️';
      } else {
        themeBtn.innerHTML = '🌙';
      }
    });
    

    

    controlsContainer.appendChild(starfieldBtn);
    controlsContainer.appendChild(asciiBtn);
    controlsContainer.appendChild(solarBtn);
    controlsContainer.appendChild(themeBtn);
    
    document.body.appendChild(controlsContainer);
    this.minimalControls = controlsContainer;
    
    // Create separate containers for volume and agent controls
    this.createVolumeContainer();
    this.createAgentControlsContainer();
  }

  /**
   * Create volume control container (right side)
   */
  createVolumeContainer() {
    const volumeContainer = document.createElement('div');
    volumeContainer.className = 'volume-control-container';
    volumeContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      z-index: 1001;
      background: #111111;
      backdrop-filter: blur(10px);
      padding: 12px 8px;
      border-radius: 20px;
      border: 1px solid #333333;
      box-shadow: 
        0 0 20px rgba(153, 204, 255, 0.2),
        4px 4px 8px rgba(0, 0, 0, 0.5);
    `;
    
    const volumeIcon = document.createElement('span');
    volumeIcon.innerHTML = '🔊';
    volumeIcon.style.cssText = `
      font-size: 14px;
      color: #99ccff;
    `;
    
    // Volume up button
    const volumeUpBtn = document.createElement('button');
    volumeUpBtn.innerHTML = '+';
    volumeUpBtn.className = 'volume-btn';
    volumeUpBtn.title = 'Volume Up';
    volumeUpBtn.style.cssText = `
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
      font-size: 16px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    // Volume display
    const volumeDisplay = document.createElement('div');
    volumeDisplay.className = 'volume-display';
    volumeDisplay.style.cssText = `
      color: #99ccff;
      font-size: 10px;
      font-family: 'Orbitron', sans-serif;
      text-align: center;
      min-width: 30px;
    `;
    
    // Volume down button
    const volumeDownBtn = document.createElement('button');
    volumeDownBtn.innerHTML = '−';
    volumeDownBtn.className = 'volume-btn';
    volumeDownBtn.title = 'Volume Down';
    volumeDownBtn.style.cssText = `
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
      font-size: 16px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    // Initialize volume
    let currentVolume = 0.7;
    this.audioManager.setVolume(currentVolume);
    volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    
    // Volume button hover effects
    [volumeUpBtn, volumeDownBtn].forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.backgroundColor = '#99ccff';
        btn.style.color = '#000000';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.backgroundColor = 'transparent';
        btn.style.color = '#99ccff';
      });
    });
    
    // Volume control logic
    volumeUpBtn.addEventListener('click', () => {
      currentVolume = Math.min(1.0, currentVolume + 0.1);
      this.audioManager.setVolume(currentVolume);
      volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    });
    
    volumeDownBtn.addEventListener('click', () => {
      currentVolume = Math.max(0.0, currentVolume - 0.1);
      this.audioManager.setVolume(currentVolume);
      volumeDisplay.textContent = Math.round(currentVolume * 100) + '%';
    });
    
    volumeContainer.appendChild(volumeIcon);
    volumeContainer.appendChild(volumeUpBtn);
    volumeContainer.appendChild(volumeDisplay);
    volumeContainer.appendChild(volumeDownBtn);
    
    document.body.appendChild(volumeContainer);
    this.volumeContainer = volumeContainer;
  }

  /**
   * Create agent controls container (left side)
   */
  createAgentControlsContainer() {
    const agentContainer = document.createElement('div');
    agentContainer.className = 'agent-controls-container';
    agentContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 1001;
      background: #111111;
      backdrop-filter: blur(10px);
      padding: 12px 8px;
      border-radius: 20px;
      border: 1px solid #333333;
      box-shadow: 
        0 0 20px rgba(153, 204, 255, 0.2),
        4px 4px 8px rgba(0, 0, 0, 0.5);
    `;

    // Agent Count Controls
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
    agentCountLabel.innerHTML = '👥';
    agentCountLabel.title = 'Agent Count';
    agentCountLabel.style.cssText = `
      font-size: 12px;
      color: #99ccff;
      font-family: 'Orbitron', sans-serif;
    `;
    
    // Agent count buttons container
    const agentButtonsContainer = document.createElement('div');
    agentButtonsContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    
    const agentCountUpBtn = document.createElement('button');
    agentCountUpBtn.innerHTML = '+';
    agentCountUpBtn.className = 'agent-btn';
    agentCountUpBtn.title = 'More Agents';
    agentCountUpBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    const agentCountDisplay = document.createElement('div');
    agentCountDisplay.className = 'agent-count-display';
    agentCountDisplay.style.cssText = `
      color: #99ccff;
      font-size: 9px;
      font-family: 'Orbitron', sans-serif;
      text-align: center;
      min-width: 24px;
    `;
    
    const agentCountDownBtn = document.createElement('button');
    agentCountDownBtn.innerHTML = '−';
    agentCountDownBtn.className = 'agent-btn';
    agentCountDownBtn.title = 'Fewer Agents';
    agentCountDownBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    // Initialize agent count
    let currentAgentCount = 60;
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
      currentAgentCount = Math.min(150, currentAgentCount + 10);
      this.agentSystem.setAgentCount(currentAgentCount);
      agentCountDisplay.textContent = currentAgentCount;
    });
    
    agentCountDownBtn.addEventListener('click', () => {
      currentAgentCount = Math.max(20, currentAgentCount - 10);
      this.agentSystem.setAgentCount(currentAgentCount);
      agentCountDisplay.textContent = currentAgentCount;
    });
    
    agentButtonsContainer.appendChild(agentCountDownBtn);
    agentButtonsContainer.appendChild(agentCountDisplay);
    agentButtonsContainer.appendChild(agentCountUpBtn);
    
    agentCountContainer.appendChild(agentCountLabel);
    agentCountContainer.appendChild(agentButtonsContainer);

    // Connection Distance Controls
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
      font-size: 12px;
      color: #99ccff;
      font-family: 'Orbitron', sans-serif;
    `;
    
    // Connection distance buttons container
    const connectionButtonsContainer = document.createElement('div');
    connectionButtonsContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
    `;
    
    const connectionUpBtn = document.createElement('button');
    connectionUpBtn.innerHTML = '+';
    connectionUpBtn.className = 'agent-btn';
    connectionUpBtn.title = 'Increase Distance';
    connectionUpBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    const connectionDisplay = document.createElement('div');
    connectionDisplay.className = 'connection-display';
    connectionDisplay.style.cssText = `
      color: #99ccff;
      font-size: 9px;
      font-family: 'Orbitron', sans-serif;
      text-align: center;
      min-width: 24px;
    `;
    
    const connectionDownBtn = document.createElement('button');
    connectionDownBtn.innerHTML = '−';
    connectionDownBtn.className = 'agent-btn';
    connectionDownBtn.title = 'Decrease Distance';
    connectionDownBtn.style.cssText = `
      background: transparent;
      border: 1px solid #99ccff;
      color: #99ccff;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    // Initialize connection distance
    let currentConnectionDistance = 100;
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
      currentConnectionDistance = Math.min(200, currentConnectionDistance + 10);
      this.agentSystem.setConnectDistance(currentConnectionDistance);
      connectionDisplay.textContent = currentConnectionDistance;
    });
    
    connectionDownBtn.addEventListener('click', () => {
      currentConnectionDistance = Math.max(50, currentConnectionDistance - 10);
      this.agentSystem.setConnectDistance(currentConnectionDistance);
      connectionDisplay.textContent = currentConnectionDistance;
    });
    
    connectionButtonsContainer.appendChild(connectionDownBtn);
    connectionButtonsContainer.appendChild(connectionDisplay);
    connectionButtonsContainer.appendChild(connectionUpBtn);
    
    connectionContainer.appendChild(connectionLabel);
    connectionContainer.appendChild(connectionButtonsContainer);
    
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
          flex-wrap: wrap !important;
          justify-content: center !important;
          gap: 6px !important;
          padding: 6px 8px !important;
          bottom: 10px !important;
          max-width: 60vw !important;
        }
        
        .minimal-control-btn {
          width: 32px !important;
          height: 32px !important;
          font-size: 12px !important;
        }
        
        /* Volume container mobile */
        .volume-control-container {
          bottom: 10px !important;
          right: 10px !important;
          padding: 8px 6px !important;
          gap: 6px !important;
        }
        
        .volume-btn {
          width: 24px !important;
          height: 24px !important;
          font-size: 14px !important;
        }
        
        .volume-display {
          font-size: 8px !important;
        }
        
        /* Agent controls container mobile */
        .agent-controls-container {
          bottom: 10px !important;
          left: 10px !important;
          padding: 8px 6px !important;
          gap: 8px !important;
        }
        
        .dial-container {
          gap: 2px !important;
        }
        
        .agent-btn {
          width: 20px !important;
          height: 20px !important;
          font-size: 10px !important;
        }
        
        .agent-count-display,
        .connection-display {
          font-size: 6px !important;
          min-width: 18px !important;
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
          font-family: 'Orbitron', sans-serif !important;
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
          max-width: 50vw !important;
        }
        
        .minimal-control-btn {
          width: 28px !important;
          height: 28px !important;
          font-size: 10px !important;
        }
        
        .volume-control-container {
          padding: 6px 4px !important;
          gap: 4px !important;
        }
        
        .volume-btn {
          width: 22px !important;
          height: 22px !important;
          font-size: 9px !important;
        }
        
        .volume-display {
          font-size: 8px !important;
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
        .volume-control-container,
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
      width: 50px;
      height: 50px;
      background: #111111;
      border: 1px solid #99ccff;
      border-radius: 50%;
      color: #99ccff;
      font-size: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      font-family: 'Orbitron', sans-serif;
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
      right: 20px;
      width: 70px;
      background: transparent;
      border: none;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // Menu items with custom icons
    const menuItems = [
      { text: 'Conundrum', icon: './public/menuicons/conundrum.png', window: 'conundrum', isImage: true },
              { text: 'Research', icon: './public/menuicons/research.png', window: 'releases', isImage: true },
      { text: 'Live Transmissions', icon: './public/menuicons/livetransmissions.png', window: 'live', isImage: true },
      { text: 'Radio', icon: './public/menuicons/radio.png', window: 'radio', isImage: true },
      { text: 'Gallery', icon: './public/menuicons/gallery.png', window: 'gallery', isImage: true },
      { text: 'Contact', icon: './public/menuicons/contact.png', window: 'contact', isImage: true },
      { text: 'LATEST GIG', icon: './public/menuicons/gigs.png', window: 'latest-gig', isImage: true }
    ];

    // Create retro windows for each menu item
    this.retroWindows = {};
    menuItems.forEach(item => {
      console.log(`🪟 Creating RetroWindow for: ${item.text} (${item.window})`);
      const windowContent = this.getWindowContent(item.window);
      console.log(`📄 Content length for ${item.window}: ${windowContent.length}`);
      
      this.retroWindows[item.window] = new RetroWindow(
        `${item.window}-window`,
        `OMNIVOID ${item.text.toUpperCase()}`,
        windowContent
      );
      
      console.log(`✅ RetroWindow created for: ${item.window}`);
    });

    // Create dropdown menu items
    menuItems.forEach((item, index) => {
      const menuItem = document.createElement('div');
      menuItem.className = 'dropdown-menu-item';
      
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
      menuItem.title = item.text; // Add tooltip on hover
      menuItem.style.cssText = `
        width: 50px;
        height: 50px;
        background: #111111;
        border: 1px solid #99ccff;
        border-radius: 50%;
        color: #99ccff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.3s ease;
        margin-bottom: 8px;
        backdrop-filter: blur(10px);
        font-family: 'Orbitron', sans-serif;
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
      font-family: 'Orbitron', sans-serif;
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
      const fileContent = await readPublicFile('./public/links/live_transmissions.txt');
      
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
   * Fetch YouTube video metadata using the Data API
   */
  async fetchYouTubeMetadata(videoIds) {
    const videos = [];
    
    for (const videoId of videoIds) {
      try {
        // Note: You'll need to add your YouTube Data API key to make this work
        // For now, we'll create basic metadata from the video ID
        const video = {
          id: videoId,
          title: `Live Transmission ${videoIds.indexOf(videoId) + 1}`,
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          url: `https://www.youtube.com/watch?v=${videoId}`
        };
        
        videos.push(video);
      } catch (error) {
        console.error(`❌ Error fetching metadata for video ${videoId}:`, error);
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

    const videosHtml = videos.map(video => `
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
      font-family: 'Orbitron', sans-serif !important;
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
   * Get content for different window types
   */
  getWindowContent(windowType) {
    console.log(`🪟 Getting window content for: ${windowType}`);
    
    switch (windowType) {
      case 'conundrum':
        return `
          <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
            <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">OMNIVOID CONUNDRUM</h3>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              Welcome to the OMNIVOID experience. This retro-style interface brings you back to the golden age of computing while delivering cutting-edge audio-visual artistry.
            </p>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              Navigate through our immersive soundscapes and discover the hidden layers of digital consciousness that lie beneath the surface of reality.
            </p>
            <hr style="border: none; border-top: 1px inset #333333; margin: 8px 0;">
            <p style="margin: 0; font-size: 10px; color: #66aaff;">
              <strong>System Status:</strong> All systems operational<br>
              <strong>Audio Engine:</strong> Web Audio API v2.0<br>
              <strong>Visual Processing:</strong> Canvas 2D + WebGL<br>
              <strong>Particle Systems:</strong> Active
            </p>
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
        // Initialize Mixcloud widget after a short delay to ensure DOM is ready
        setTimeout(() => {
          this.initializeMixcloudWidget();
        }, 100);
        return this.createRadioFileExplorer();

      case 'gallery':
        return this.createGalleryContent();

      case 'contact':
        return `
          <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
            <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">CONTACT OMNIVOID</h3>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              Connect with the OMNIVOID collective. We're always interested in collaborations and feedback.
            </p>
            <div style="font-size: 10px; line-height: 1.4; color: #66aaff;">
              <div style="margin-bottom: 4px;"><strong>Email:</strong> contact@omnivoid.net</div>
              <div style="margin-bottom: 4px;"><strong>GitHub:</strong> github.com/QuantumClimb/omnivoid</div>
              <div style="margin-bottom: 4px;"><strong>Status:</strong> Available for projects</div>
            </div>
          </div>`;

      case 'latest-gig':
        return `
          <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
            <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">LATEST GIG</h3>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              Check out our most recent live performance and upcoming gigs. Experience OMNIVOID in its natural habitat - the live stage.
            </p>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              From intimate club shows to festival stages, we bring our unique blend of experimental electronic music and visual art to audiences worldwide.
            </p>
            <hr style="border: none; border-top: 1px inset #333333; margin: 8px 0;">
            <div style="font-size: 10px; color: #66aaff;">
              <div><strong>Next Show:</strong> TBA</div>
              <div><strong>Last Performance:</strong> Electronic Arts Festival</div>
              <div><strong>Booking:</strong> Available for 2024</div>
            </div>
          </div>`;

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
    console.log('🎵 Creating radio file explorer with Mixcloud integration...');



    const content = `
      <div style="border: 1px inset #333333; padding: 8px; margin-bottom: 8px; background: #0a0a0a; color: #99ccff;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">OMNIVOID RADIO</h3>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
          Streaming from Mixcloud - Audio reactivity enabled for visual effects
        </p>
        <div id="now-playing" style="border: 1px inset #333333; padding: 6px; margin: 8px 0; background: #1a1a1a; font-size: 10px; color: #99ccff;">
          <strong>Source:</strong> <span id="current-track">Mixcloud Channel</span>
          <div style="margin-top: 4px; color: #66aaff; font-size: 9px;">
            Channel: <a href="https://www.mixcloud.com/roydipankar8/" target="_blank" style="color: #66aaff;">roydipankar8</a>
          </div>
        </div>
      </div>
      
      <!-- Mixcloud Widget Container -->
      <div style="border: 1px inset #333333; padding: 8px; background: #0a0a0a; margin-bottom: 8px;">
        <div style="background: #99ccff; color: #000; padding: 2px 4px; font-size: 10px; font-weight: bold; margin-bottom: 8px;">
          Live Stream
        </div>
        <div id="mixcloud-widget-container" style="
          width: 100%;
          height: 300px;
          background: #1a1a1a;
          border: 1px solid #333;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&feed=%2Froydipankar8%2F" 
            frameborder="0"
            id="mixcloud-player"
            style="border: none;"
            allow="autoplay"
          ></iframe>
        </div>
        
        <!-- Audio Capture Instructions -->
        <div style="margin-top: 8px; padding: 6px; background: #1a1a1a; border: 1px solid #333; font-size: 9px; color: #66aaff;">
          <div style="margin-bottom: 4px;"><strong>Audio Reactivity:</strong></div>
          <div style="font-size: 8px; color: #999; line-height: 1.3;">
            1. Play music in Mixcloud widget above<br>
            2. Visual effects will respond to Mixcloud stream<br>
            3. No microphone access - Mixcloud only
          </div>
          <button onclick="window.omnivoidApp.manualAudioCapture()" style="
            margin-top: 6px;
            padding: 4px 8px;
            background: #99ccff;
            color: #000;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 8px;
            font-family: 'Orbitron', sans-serif;
          ">🔊 Refresh Audio Capture</button>
          
          <!-- Debug Panel -->
          <div style="margin-top: 8px; padding: 6px; background: #000; border: 1px solid #333; font-size: 8px;">
            <div style="margin-bottom: 4px; color: #ffaa44;"><strong>🔍 DEBUG INFO:</strong></div>
            <div id="debug-info" style="color: #66aaff; line-height: 1.2; font-size: 7px;">
              Loading debug information...
            </div>
            <button onclick="window.omnivoidApp.refreshDebugInfo()" style="
              margin-top: 4px;
              padding: 2px 6px;
              background: #333;
              color: #99ccff;
              border: 1px solid #666;
              border-radius: 2px;
              cursor: pointer;
              font-size: 7px;
              font-family: 'Orbitron', sans-serif;
            ">🔄 Refresh Debug</button>
          </div>
        </div>
      </div>
      
      <!-- Audio Reactivity Status -->
      <div style="border: 1px inset #333333; padding: 6px; margin-top: 8px; background: #1a1a1a; font-size: 10px; color: #99ccff;">
        <strong>Audio Reactivity:</strong> Visual effects respond to Mixcloud stream only
        <div id="radio-status" style="margin-top: 4px; color: #66aaff; font-size: 9px;">
          Status: <span id="reactivity-status">Monitoring Mixcloud audio</span>
        </div>
        <div style="margin-top: 4px; font-size: 9px; color: #999;">
          Note: Only Mixcloud audio drives visual effects
        </div>
      </div>
    `;

    console.log('🎵 Radio file explorer with Mixcloud integration generated');
    return content;
  }

  /**
   * Initialize Mixcloud widget and audio reactivity
   */
  initializeMixcloudWidget() {
    console.log('🎵 Initializing Mixcloud widget...');
    
    // Wait for the iframe to load
    setTimeout(() => {
      const mixcloudPlayer = document.getElementById('mixcloud-player');
      if (mixcloudPlayer) {
        console.log('✅ Mixcloud player iframe found');
        
        // Set up audio reactivity monitoring
        this.setupMixcloudAudioReactivity();
        
        // Try to capture audio from the iframe
        this.captureMixcloudAudio();
        
        // Set up iframe load event listener
        mixcloudPlayer.addEventListener('load', () => {
          console.log('🎵 Mixcloud iframe loaded');
          // Try audio capture again after iframe is fully loaded
          setTimeout(() => {
            this.captureMixcloudAudio();
          }, 1000);
        });
        
        // Also try to capture audio periodically
        this.setupPeriodicAudioCapture();
        
        // Initial debug info
        setTimeout(() => {
          this.refreshDebugInfo();
        }, 2000);
        
      } else {
        console.log('⚠️ Mixcloud player iframe not found, retrying...');
        // Retry after a short delay
        setTimeout(() => this.initializeMixcloudWidget(), 1000);
      }
    }, 500);
  }

  /**
   * Set up periodic audio capture attempts
   */
  setupPeriodicAudioCapture() {
    console.log('🔄 Setting up periodic audio capture...');
    
    // Try to capture audio every 5 seconds for the first minute
    let attempts = 0;
    const maxAttempts = 12; // 1 minute
    
    const captureInterval = setInterval(() => {
      attempts++;
      console.log(`🔄 Audio capture attempt ${attempts}/${maxAttempts}`);
      
      if (attempts >= maxAttempts) {
        clearInterval(captureInterval);
        console.log('⏰ Stopping periodic audio capture attempts');
        return;
      }
      
      // Try different capture methods
      this.captureMixcloudAudio();
      
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
   */
  setupMixcloudAudioReactivity() {
    console.log('🎵 Setting up Mixcloud-only audio reactivity...');
    
    // Update status
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = 'Mixcloud-only mode - Visual effects respond to stream only';
    }
    
    console.log('✅ Mixcloud-only audio reactivity configured');
  }

  /**
   * Capture audio from Mixcloud iframe for reactivity
   */
  async captureMixcloudAudio() {
    console.log('🎵 Attempting to capture Mixcloud audio...');
    
    try {
      // Method 1: Try to get audio from the iframe's audio context
      const mixcloudPlayer = document.getElementById('mixcloud-player');
      if (mixcloudPlayer && mixcloudPlayer.contentWindow) {
        console.log('🔍 Accessing Mixcloud iframe content...');
        
        // Wait a bit more for the iframe to fully load
        setTimeout(() => {
          try {
            // Try to access the iframe's audio context
            const iframeWindow = mixcloudPlayer.contentWindow;
            if (iframeWindow && iframeWindow.document) {
              console.log('✅ Iframe document accessible');
              
              // Look for audio elements in the iframe
              const audioElements = iframeWindow.document.querySelectorAll('audio, video');
              console.log(`🎵 Found ${audioElements.length} audio/video elements in iframe`);
              
              if (audioElements.length > 0) {
                // Try to connect the first audio element to our audio context
                this.connectIframeAudio(audioElements[0]);
              } else {
                console.log('⚠️ No audio elements found in iframe, trying alternative method');
                this.tryAlternativeAudioCapture();
              }
            }
          } catch (error) {
            console.log('⚠️ Cannot access iframe content (cross-origin restriction)');
            this.tryAlternativeAudioCapture();
          }
        }, 2000);
      }
    } catch (error) {
      console.log('⚠️ Error accessing Mixcloud iframe:', error);
      this.tryAlternativeAudioCapture();
    }
  }

  /**
   * Try alternative audio capture methods
   */
  tryAlternativeAudioCapture() {
    console.log('🔄 Trying alternative Mixcloud audio capture...');
    
    // Only try to capture from Mixcloud iframe - no microphone or system audio
    console.log('🎵 Mixcloud-only mode - no alternative audio sources');
    
    // Update status
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = 'Mixcloud-only mode - No microphone access';
    }
    
    console.log('✅ Mixcloud-only audio mode configured');
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
   * Manual audio capture trigger
   */
  manualAudioCapture() {
    console.log('🔊 Manual audio capture triggered...');
    
    // Update status
    const reactivityStatus = document.getElementById('reactivity-status');
    if (reactivityStatus) {
      reactivityStatus.textContent = 'Attempting Mixcloud audio capture...';
    }
    
    // Try to capture audio from Mixcloud iframe
    this.captureMixcloudAudio();
    
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
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">OMNIVOID GALLERY</h3>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
            Visual collection featuring ${galleryImages.length} digital art pieces. Click any thumbnail to open in popup viewer.
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
      font-family: 'Orbitron', sans-serif;
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
      font-family: 'Orbitron', sans-serif;
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
          font-family: 'Orbitron', sans-serif;
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
      font-family: 'Orbitron', sans-serif;
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
            font-family: 'Courier New', monospace;
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
            font-family: 'Orbitron', sans-serif;
          ">
            📄 ${article.filename.substring(0, 8)}...
          </div>
        </div>
      `;
    }).join('');

    return `
      <div id="releases-container" style="background: #0a0a0a;">
        <div style="border: 1px inset #333333; padding: 8px; margin-bottom: 8px; background: #0a0a0a; color: #99ccff;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">OMNIVOID RESEARCH PAPERS</h3>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
            Collection of ${docArticles.length} research documents exploring the intersection of sound, technology, and consciousness.
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
      font-family: 'Orbitron', sans-serif;
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
      font-family: 'Orbitron', sans-serif;
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
      font-family: 'Courier New', monospace;
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
      <span style="color: #99ccff; font-family: 'Orbitron', sans-serif; font-size: 10px;">
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
    const isDesktop = window.innerWidth >= 768;
    
    console.log(`📱 Window resize: ${window.innerWidth}px - ${isDesktop ? 'Desktop' : 'Mobile'} mode`);
    
    // Reset modal state on resize to prevent positioning issues
    this.resetModalState();
    
    if (isDesktop) {
      // DESKTOP MODE - Use mobile menu for consistency
      console.log('🖥️ Desktop mode - using unified mobile menu');
      this.showMobileControls();
      
    } else {
      // MOBILE MODE
      console.log('📱 Mobile mode');
      this.showMobileControls();
    }
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
    
    if (this.volumeContainer) {
      this.volumeContainer.style.display = 'flex';
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
   * Initialize responsive behavior based on current screen size
   */
  initializeResponsiveMode() {
    const isDesktop = window.innerWidth >= 768;
    
    console.log(`🚀 Initializing responsive mode: ${isDesktop ? 'Desktop' : 'Mobile'}`);
    
    // Always create the floating menu regardless of screen size
    console.log('🍔 Creating floating menu...');
    this.createFloatingMenu();
    console.log('🍔 Floating menu creation completed');
    
    // Always create mobile controls for consistency
    console.log('📱 Creating mobile controls...');
    this.createMinimalControls();
    
    if (isDesktop) {
      // Start in desktop mode - using unified mobile menu
      console.log('🖥️ Desktop mode - using unified mobile menu');
    }
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
          font-family: 'Orbitron', sans-serif;
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
          font-family: 'Orbitron', sans-serif;
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
      font-family: 'Orbitron', sans-serif;
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
          font-family: 'Orbitron', sans-serif;
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
          font-family: 'Orbitron', sans-serif;
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
}