import { AgentSystem } from './components/AgentSystem.js';
import { Logo } from './components/Logo.js';
import { AudioManager } from './controllers/AudioManager.js';
import { ThemeManager } from './controllers/ThemeManager.js';
import { SplashScreen } from './components/SplashScreen.js';

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
    this.initializeApp();
  }

  /**
   * Initialize the OMNIVOID application
   */
  async initializeApp() {
    // Create and show splash screen
    this.splashScreen = new SplashScreen();
    this.splashScreen.log('🚀 Initializing OMNIVOID...', 5);

    try {
      // Initialize core managers
      this.splashScreen.log('📦 Loading core systems...', 15);
      this.themeManager = new ThemeManager();
      this.audioManager = new AudioManager();
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
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'minimal-controls';
    controlsContainer.style.cssText = `
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
      z-index: 1001;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      padding: 12px 24px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    // Play/Pause button
    const playBtn = document.createElement('button');
    playBtn.className = 'minimal-control-btn';
    playBtn.textContent = '▶';
    playBtn.style.cssText = `
      background: none;
      border: 1px solid var(--fg-color);
      color: var(--fg-color);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    playBtn.addEventListener('click', () => {
      if (this.audioManager.isPlaying) {
        this.audioManager.pause();
        playBtn.textContent = '▶';
        playBtn.classList.remove('active');
      } else {
        this.audioManager.play();
        playBtn.textContent = '⏸';
        playBtn.classList.add('active');
      }
    });
    
    // Volume control
    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '1';
    volumeSlider.step = '0.1';
    volumeSlider.value = '0.7';
    volumeSlider.style.cssText = `
      width: 80px;
      height: 4px;
      -webkit-appearance: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      outline: none;
    `;
    
    volumeSlider.addEventListener('input', (e) => {
      this.audioManager.setVolume(parseFloat(e.target.value));
    });
    
    // Starfield toggle button
    const starfieldBtn = document.createElement('button');
    starfieldBtn.className = 'minimal-control-btn active';
    starfieldBtn.innerHTML = '✦'; // Star icon
    starfieldBtn.title = 'Toggle Starfield';
    starfieldBtn.style.cssText = `
      background: none;
      border: 1px solid var(--fg-color);
      color: var(--fg-color);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      transition: all 0.2s;
      font-family: 'Orbitron', sans-serif;
    `;
    
    starfieldBtn.addEventListener('click', () => {
      const isVisible = this.starfield.isVisible;
      this.starfield.setVisibility(!isVisible);
      if (!isVisible) {
        starfieldBtn.classList.add('active');
        starfieldBtn.innerHTML = '✦';
        starfieldBtn.style.background = 'var(--fg-color)';
        starfieldBtn.style.color = 'var(--bg-color)';
      } else {
        starfieldBtn.classList.remove('active');
        starfieldBtn.innerHTML = '☆';
        starfieldBtn.style.background = 'none';
        starfieldBtn.style.color = 'var(--fg-color)';
      }
    });
    
    controlsContainer.appendChild(playBtn);
    controlsContainer.appendChild(starfieldBtn);
    controlsContainer.appendChild(volumeSlider);
    
    document.body.appendChild(controlsContainer);
    this.minimalControls = controlsContainer;
  }
} 