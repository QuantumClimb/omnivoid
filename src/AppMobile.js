import { AgentSystem } from './components/AgentSystem.js';
import { Logo } from './components/Logo.js';
import { AudioManager } from './controllers/AudioManager.js';
import { ThemeManager } from './controllers/ThemeManager.js';
import { SplashScreen } from './components/SplashScreen.js';
import { RetroWindow } from './components/RetroWindow.js';

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
    
    // Radio/Music properties
    this.currentPlaylistIndex = 0;
    this.isPlaylistMode = false;
    this.isShuffleMode = false;
    this.progressInterval = null;
    this.playlist = [
      'Tradition.mp3',
      'Shadow Pulse.mp3',
      'Shifting Echoes.mp3',
      'Ritual of the Void.mp3',
      'Ritual Echoes.mp3',
      'Infinite Emptiness.mp3',
      'Fractured Echoes.mp3',
      'Ethereal Echoes.mp3',
      'Euphoria Within.mp3',
      'Etherea.mp3',
      'Echoes of Tradition.mp3',
      'Electric Shadows.mp3',
      'Endless Night.mp3',
      'Echoes of the Unknown.mp3',
      'Echoes of Reality.mp3',
      'Echoes of the Afterparty.mp3',
      'Cosmic Shadows.mp3',
      'Echoes in the Abyss.mp3',
      'Cosmic Reverie.mp3',
      'Binary Shadows.mp3',
      'Choes Ethereal.mp3',
      'song1.mp3'
    ];
    
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
      
      // Preload audio
      this.splashScreen.log('📥 Loading audio assets...', 35);
      const audioLoaded = await this.audioManager.loadAudio('./public/audio/Music/song1.mp3');
      if (!audioLoaded) {
        this.splashScreen.log('⚠️ Audio loading failed, continuing...', 40);
      } else {
        this.splashScreen.log('✅ Audio ready', 45);
      }

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
      
      // Set up minimal controls only
      this.splashScreen.log('📱 Setting up controls...', 85);
      this.createMinimalControls();
      
      // Complete initialization
      this.splashScreen.log('🌌 Welcome to OMNIVOID', 100);
      
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
    
    // Play/Pause button
    const playBtn = document.createElement('button');
    playBtn.className = 'minimal-control-btn play-btn';
    playBtn.innerHTML = '▶';
    playBtn.title = 'Play/Pause';
    playBtn.style.cssText = `
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
    
    // Add hover effects for play button
    playBtn.addEventListener('mouseenter', () => {
      playBtn.style.backgroundColor = '#99ccff';
      playBtn.style.color = '#000000';
    });
    
    playBtn.addEventListener('mouseleave', () => {
      if (!playBtn.classList.contains('active')) {
        playBtn.style.backgroundColor = 'transparent';
        playBtn.style.color = '#99ccff';
      }
    });
    
    playBtn.addEventListener('click', () => {
      this.togglePlayPause();
    });
    
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
    
    controlsContainer.appendChild(playBtn);
    controlsContainer.appendChild(starfieldBtn);
    controlsContainer.appendChild(asciiBtn);
    controlsContainer.appendChild(solarBtn);
    
    document.body.appendChild(controlsContainer);
    this.minimalControls = controlsContainer;
    
    // Create separate containers for volume and agent controls
    this.createVolumeContainer();
    this.createAgentControlsContainer();
    
    // Create floating menu system
    this.createFloatingMenu();
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

    // Menu items with icons
    const menuItems = [
      { text: 'Conundrum', icon: '🧩', window: 'conundrum' },
      { text: 'Releases', icon: '📚', window: 'releases' },
      { text: 'Radio', icon: '📻', window: 'radio' },
      { text: 'Gallery', icon: '🖼️', window: 'gallery' },
      { text: 'Contact', icon: '📧', window: 'contact' },
      { text: 'About', icon: 'ℹ️', window: 'about' }
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
      
      // Always show only icons as circular buttons
      menuItem.innerHTML = `<span class="menu-icon">${item.icon}</span>`;
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
      `;

      // Add click handler to open retro window
      menuItem.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`🔘 Menu item clicked: ${item.text} (${item.window})`);
        console.log(`🪟 RetroWindow exists: ${!!this.retroWindows[item.window]}`);
        
        if (this.retroWindows[item.window]) {
          // For radio window, update content dynamically
          if (item.window === 'radio') {
            console.log('🎵 Updating radio window content dynamically');
            const radioContent = this.getWindowContent('radio');
            console.log('🎵 Radio content length:', radioContent.length);
            this.retroWindows[item.window].setContent(radioContent);
          }
          console.log(`🔓 Showing window: ${item.window}`);
          this.retroWindows[item.window].show();
          
          // Hide dropdown menu after selection
          hideDropdown();
        } else {
          console.error(`❌ RetroWindow not found for: ${item.window}`);
        }
      });

      // Add hover effects matching hamburger button
      menuItem.addEventListener('mouseenter', () => {
        menuItem.style.backgroundColor = '#99ccff';
        menuItem.style.color = '#000000';
        menuItem.style.boxShadow = '0 0 25px rgba(153, 204, 255, 0.4), 2px 2px 4px rgba(0, 0, 0, 0.5)';
      });

      menuItem.addEventListener('mouseleave', () => {
        menuItem.style.backgroundColor = '#111111';
        menuItem.style.color = '#99ccff';
        menuItem.style.boxShadow = '0 0 15px rgba(153, 204, 255, 0.2), 2px 2px 4px rgba(0, 0, 0, 0.5)';
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
    
    this.hamburgerBtn = hamburgerBtn;
    this.dropdownMenu = dropdownMenu;
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
        return this.createReleasesContent();

      case 'radio':
        console.log('🎵 Radio case hit - calling createRadioFileExplorer');
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

      case 'about':
        return `
          <div style="border: 1px inset #333333; padding: 12px; margin-bottom: 12px; background: #0a0a0a; color: #99ccff;">
            <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">ABOUT OMNIVOID</h3>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              OMNIVOID is an experimental audio-visual platform that explores the intersection of sound, code, and consciousness.
            </p>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
              Built with vanilla JavaScript and Web Audio API, it represents a modern approach to digital art and interactive experiences.
            </p>
            <hr style="border: none; border-top: 1px inset #333333; margin: 8px 0;">
            <div style="font-size: 10px; color: #66aaff;">
              <div><strong>Version:</strong> 0.1.0</div>
              <div><strong>Platform:</strong> Web Audio API</div>
              <div><strong>License:</strong> MIT</div>
            </div>
          </div>`;

      default:
        return '<p style="font-size: 11px; padding: 12px; color: #99ccff; background: #0a0a0a;">Content loading...</p>';
    }
  }

  /**
   * Create radio file explorer content
   */
  createRadioFileExplorer() {
    console.log('🎵 Creating radio file explorer...');
    
    // Music playlist management
    this.currentPlaylistIndex = 0;
    this.isPlaylistMode = false;
    this.playlist = [
      'Tradition.mp3',
      'Shadow Pulse.mp3',
      'Shifting Echoes.mp3',
      'Ritual of the Void.mp3',
      'Ritual Echoes.mp3',
      'Infinite Emptiness.mp3',
      'Fractured Echoes.mp3',
      'Ethereal Echoes.mp3',
      'Euphoria Within.mp3',
      'Etherea.mp3',
      'Echoes of Tradition.mp3',
      'Electric Shadows.mp3',
      'Endless Night.mp3',
      'Echoes of the Unknown.mp3',
      'Echoes of Reality.mp3',
      'Echoes of the Afterparty.mp3',
      'Cosmic Shadows.mp3',
      'Echoes in the Abyss.mp3',
      'Cosmic Reverie.mp3',
      'Binary Shadows.mp3',
      'Choes Ethereal.mp3',
      'song1.mp3'
    ];

    console.log(`🎵 Found ${this.playlist.length} music files`);

    const fileListHTML = this.playlist.map((file, index) => {
      const fileName = file.replace('.mp3', '');
      const isCurrentSong = this.isPlaylistMode && index === this.currentPlaylistIndex;
      const highlightStyle = isCurrentSong ? 'background: #0a246a; color: white;' : '';
      
      return `
        <div class="file-item" style="
          padding: 4px 8px;
          margin: 1px 0;
          background: ${isCurrentSong ? '#0a246a' : 'white'};
          color: ${isCurrentSong ? 'white' : 'black'};
          border: 1px solid #c0c0c0;
          cursor: pointer;
          font-size: 10px;
          display: flex;
          align-items: center;
          transition: background-color 0.1s;
        " onmouseover="if(!${isCurrentSong}) { this.style.background='#0a246a'; this.style.color='white'; }" 
           onmouseout="if(!${isCurrentSong}) { this.style.background='white'; this.style.color='black'; }"
           onclick="window.omnivoidApp.playSpecificSong(${index})">
          <span style="margin-right: 8px;">${isCurrentSong ? '▶' : '🎵'}</span>
          <span>${fileName}</span>
          ${isCurrentSong ? '<span style="margin-left: auto; font-size: 8px;">PLAYING</span>' : ''}
        </div>
      `;
    }).join('');

    const currentTrackName = this.isPlaylistMode && this.playlist[this.currentPlaylistIndex] 
      ? this.playlist[this.currentPlaylistIndex].replace('.mp3', '')
      : 'None';

    const content = `
      <div style="border: 1px inset #333333; padding: 8px; margin-bottom: 8px; background: #0a0a0a; color: #99ccff;">
        <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #99ccff;">OMNIVOID RADIO</h3>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #99ccff;">
          ${this.isPlaylistMode ? 'Playlist Mode Active - Songs will play automatically in sequence.' : 'Click the play button to start playlist mode, or select any track to play.'}
        </p>
        <div id="now-playing" style="border: 1px inset #333333; padding: 6px; margin: 8px 0; background: #1a1a1a; font-size: 10px; color: #99ccff;">
          <strong>Now Playing:</strong> <span id="current-track">${currentTrackName}</span>
          ${this.isPlaylistMode ? `<span style="margin-left: 10px; color: #66aaff;">(${this.currentPlaylistIndex + 1}/${this.playlist.length})</span>` : ''}
          <div id="track-progress" style="margin-top: 4px; height: 4px; background: #333; border: 1px inset #666; display: ${this.isPlaylistMode ? 'block' : 'none'};">
            <div id="progress-bar" style="height: 100%; background: #99ccff; width: 0%; transition: width 0.1s;"></div>
          </div>
        </div>
        
        <!-- Enhanced Track Controls -->
        <div style="display: flex; justify-content: center; gap: 8px; margin: 8px 0; ${this.isPlaylistMode ? '' : 'display: none;'}" id="track-controls">
          <button onclick="window.omnivoidApp.previousTrack()" style="
            background: #1a1a1a;
            border: 1px outset #666;
            color: #99ccff;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
          " title="Previous Track">⏮</button>
          
          <button onclick="window.omnivoidApp.togglePlayPause()" style="
            background: #1a1a1a;
            border: 1px outset #666;
            color: #99ccff;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
          " title="Play/Pause" id="radio-play-btn">${this.audioManager && this.audioManager.isPlaying ? '⏸' : '▶'}</button>
          
          <button onclick="window.omnivoidApp.nextTrack()" style="
            background: #1a1a1a;
            border: 1px outset #666;
            color: #99ccff;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
          " title="Next Track">⏭</button>
          
          <button onclick="window.omnivoidApp.toggleShuffle()" style="
            background: ${this.isShuffleMode ? '#99ccff' : '#1a1a1a'};
            color: ${this.isShuffleMode ? '#000' : '#99ccff'};
            border: 1px outset #666;
            padding: 4px 8px;
            font-size: 10px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
          " title="Shuffle Mode" id="shuffle-btn">🔀</button>
        </div>
      </div>
      
      <div style="border: 1px inset #333333; padding: 4px; background: #0a0a0a; height: 200px; overflow-y: auto;">
        <div style="background: #99ccff; color: #000; padding: 2px 4px; font-size: 10px; font-weight: bold; margin-bottom: 2px;">
          Music Library (${this.playlist.length} tracks) ${this.isPlaylistMode ? '- PLAYLIST MODE' : ''}
        </div>
        ${fileListHTML}
      </div>
      
      <div style="border: 1px inset #333333; padding: 6px; margin-top: 8px; background: #1a1a1a; font-size: 10px; color: #99ccff;">
        <strong>Controls:</strong> Use track controls above or main player controls. ${this.isPlaylistMode ? 'Songs will auto-advance when finished.' : 'Press play button to start playlist mode.'}
        <div id="radio-status" style="margin-top: 4px; color: #66aaff; font-size: 9px;">
          Status: ${this.audioManager && this.audioManager.isPlaying ? 'Playing' : 'Stopped'}
        </div>
      </div>
    `;

    console.log('🎵 Radio file explorer content generated');
    return content;
  }

  /**
   * Start playlist mode - opens radio window and begins playing first song
   */
  async startPlaylistMode() {
    console.log('🎵 Starting playlist mode...');
    
    // Open the radio window
    if (this.retroWindows && this.retroWindows.radio) {
      console.log('🪟 Opening radio window...');
      this.retroWindows.radio.show();
    }
    
    // Start playing the first song in the playlist
    this.isPlaylistMode = true;
    this.currentPlaylistIndex = 0;
    await this.playCurrentSong();
    
    // Set up audio ended event listener for auto-progression
    this.setupAutoProgression();
  }

  /**
   * Play the current song in the playlist
   */
  async playCurrentSong() {
    if (this.currentPlaylistIndex >= this.playlist.length) {
      // Loop back to the beginning
      this.currentPlaylistIndex = 0;
    }
    
    const currentSong = this.playlist[this.currentPlaylistIndex];
    console.log(`🎵 Playing song ${this.currentPlaylistIndex + 1}/${this.playlist.length}: ${currentSong}`);
    
    await this.playMusicFile(currentSong);
  }

  /**
   * Set up automatic song progression when current song ends
   */
  setupAutoProgression() {
    if (this.audioManager && this.audioManager.audioElement) {
      // Remove any existing event listeners to avoid duplicates
      this.audioManager.audioElement.removeEventListener('ended', this.onSongEnded);
      
      // Add new event listener
      this.audioManager.audioElement.addEventListener('ended', this.onSongEnded);
      console.log('🎵 Auto-progression listener set up');
    }
  }

  /**
   * Handle when a song ends - automatically play next song
   */
  onSongEnded = async () => {
    if (this.isPlaylistMode) {
      console.log('🎵 Song ended, moving to next track...');
      this.currentPlaylistIndex++;
      
      // Add a small delay before playing next song
      setTimeout(async () => {
        await this.playCurrentSong();
      }, 1000); // 1 second delay between songs
    }
  }

  /**
   * Stop playlist mode
   */
  stopPlaylistMode() {
    console.log('🎵 Stopping playlist mode...');
    this.isPlaylistMode = false;
    
    // Remove auto-progression listener
    if (this.audioManager && this.audioManager.audioElement) {
      this.audioManager.audioElement.removeEventListener('ended', this.onSongEnded);
    }
  }

  /**
   * Play a specific song by index in the playlist
   */
  async playSpecificSong(index) {
    console.log(`🎵 Playing specific song at index: ${index}`);
    
    // Enable playlist mode and set the index
    this.isPlaylistMode = true;
    this.currentPlaylistIndex = index;
    
    // Play the selected song
    await this.playCurrentSong();
    
    // Set up auto-progression
    this.setupAutoProgression();
    
    // Update the radio window content to reflect the change
    if (this.retroWindows && this.retroWindows.radio) {
      const newContent = this.createRadioFileExplorer();
      this.retroWindows.radio.setContent(newContent);
    }
  }

  /**
   * Play a selected music file (legacy method, now integrates with playlist)
   */
  async playMusicFile(fileName) {
    try {
      console.log(`🎵 Loading music file: ${fileName}`);
      
      // Update now playing display
      const currentTrackElement = document.getElementById('current-track');
      if (currentTrackElement) {
        currentTrackElement.textContent = fileName.replace('.mp3', '');
      }
      
      // Clear the current audio buffer to force reload of new file
      this.audioManager.audioBuffer = null;
      
      // Load and play the selected file
      const audioUrl = `public/audio/Music/${fileName}`;
      const loaded = await this.audioManager.loadAudio(audioUrl);
      
      if (loaded) {
        this.audioManager.play();
        console.log(`✅ Now playing: ${fileName}`);
        
        // Update the main play button to show playing state
        this.syncPlayButtonState(true);
        
        // Set up auto-progression if not already set up
        this.setupAutoProgression();
        
        // Start progress tracking
        this.startProgressTracking();
      } else {
        console.error(`❌ Failed to load: ${fileName}`);
        if (currentTrackElement) {
          currentTrackElement.textContent = 'Error loading track';
        }
        this.updateRadioStatus('Error loading track');
      }
    } catch (error) {
      console.error('❌ Error playing music file:', error);
      this.updateRadioStatus('Playback error');
    }
  }

  /**
   * Synchronize play button states across main controls and radio
   */
  syncPlayButtonState(isPlaying) {
    // Update main play button
    const playBtns = document.querySelectorAll('.minimal-control-btn');
    playBtns.forEach(btn => {
      if (btn.textContent === '▶' || btn.textContent === '⏸') {
        btn.textContent = isPlaying ? '⏸' : '▶';
        if (isPlaying) {
          btn.classList.add('active');
          btn.style.backgroundColor = '#99ccff';
          btn.style.color = '#000000';
        } else {
          btn.classList.remove('active');
          btn.style.backgroundColor = 'transparent';
          btn.style.color = '#99ccff';
        }
      }
    });
    
    // Update radio play button
    const radioPlayBtn = document.getElementById('radio-play-btn');
    if (radioPlayBtn) {
      radioPlayBtn.textContent = isPlaying ? '⏸' : '▶';
    }
    
    // Update radio status
    this.updateRadioStatus(isPlaying ? 'Playing' : 'Paused');
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
   * Toggle play/pause from radio controls
   */
  togglePlayPause() {
    if (this.audioManager.isPlaying) {
      this.audioManager.pause();
      this.syncPlayButtonState(false);
    } else {
      if (!this.isPlaylistMode) {
        this.startPlaylistMode();
      } else {
        this.audioManager.play();
        this.syncPlayButtonState(true);
        this.startProgressTracking();
      }
    }
  }

  /**
   * Play next track in playlist
   */
  async nextTrack() {
    if (!this.isPlaylistMode) return;
    
    if (this.isShuffleMode) {
      // Random next track
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * this.playlist.length);
      } while (nextIndex === this.currentPlaylistIndex && this.playlist.length > 1);
      this.currentPlaylistIndex = nextIndex;
    } else {
      // Sequential next track
      this.currentPlaylistIndex = (this.currentPlaylistIndex + 1) % this.playlist.length;
    }
    
    await this.playCurrentSong();
    this.updateRadioWindow();
  }

  /**
   * Play previous track in playlist
   */
  async previousTrack() {
    if (!this.isPlaylistMode) return;
    
    if (this.isShuffleMode) {
      // Random previous track
      let prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * this.playlist.length);
      } while (prevIndex === this.currentPlaylistIndex && this.playlist.length > 1);
      this.currentPlaylistIndex = prevIndex;
    } else {
      // Sequential previous track
      this.currentPlaylistIndex = this.currentPlaylistIndex === 0 
        ? this.playlist.length - 1 
        : this.currentPlaylistIndex - 1;
    }
    
    await this.playCurrentSong();
    this.updateRadioWindow();
  }

  /**
   * Toggle shuffle mode
   */
  toggleShuffle() {
    this.isShuffleMode = !this.isShuffleMode;
    console.log(`🔀 Shuffle mode: ${this.isShuffleMode ? 'ON' : 'OFF'}`);
    
    // Update shuffle button appearance
    const shuffleBtn = document.getElementById('shuffle-btn');
    if (shuffleBtn) {
      shuffleBtn.style.background = this.isShuffleMode ? '#99ccff' : '#1a1a1a';
      shuffleBtn.style.color = this.isShuffleMode ? '#000' : '#99ccff';
    }
    
    this.updateRadioStatus(`Shuffle ${this.isShuffleMode ? 'ON' : 'OFF'}`);
  }

  /**
   * Start progress tracking for current track
   */
  startProgressTracking() {
    // Clear existing interval
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
    }
    
    this.progressInterval = setInterval(() => {
      if (this.audioManager && this.audioManager.isPlaying && this.audioManager.audioBuffer) {
        const currentTime = this.audioManager.audioContext.currentTime - this.audioManager.startTime;
        const duration = this.audioManager.audioBuffer.duration;
        const progress = Math.min((currentTime / duration) * 100, 100);
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
          progressBar.style.width = `${progress}%`;
        }
        
        // Update time display if available
        const timeDisplay = document.getElementById('time-display');
        if (timeDisplay) {
          const currentMinutes = Math.floor(currentTime / 60);
          const currentSeconds = Math.floor(currentTime % 60);
          const totalMinutes = Math.floor(duration / 60);
          const totalSeconds = Math.floor(duration % 60);
          
          timeDisplay.textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        }
      }
    }, 1000); // Update every second
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
   * Enhanced song ended handler with better error handling
   */
  onSongEnded = async () => {
    if (this.isPlaylistMode) {
      console.log('🎵 Song ended, moving to next track...');
      
      // Clear progress tracking
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
      }
      
      // Reset progress bar
      const progressBar = document.getElementById('progress-bar');
      if (progressBar) {
        progressBar.style.width = '0%';
      }
      
      // Move to next track
      this.currentPlaylistIndex++;
      
      // Add a small delay before playing next song
      setTimeout(async () => {
        try {
          await this.playCurrentSong();
        } catch (error) {
          console.error('❌ Error auto-advancing to next track:', error);
          this.updateRadioStatus('Auto-advance error');
          this.syncPlayButtonState(false);
        }
      }, 1000); // 1 second delay between songs
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
} 