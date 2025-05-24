import { Grid } from './components/Grid.js';
import { SolarSystem } from './components/SolarSystem.js';
import { AgentSystem } from './components/AgentSystem.js';
import { Headline } from './components/Headline.js';
import { Starfield } from './components/Starfield.js';
import { VectorGrid } from './components/VectorGrid.js';
import { ASCIITunnel } from './components/ASCIITunnel.js';
import { AudioManager } from './controllers/AudioManager.js';
import { AudioPlayer } from './components/AudioPlayer.js';
import { ThemeManager } from './controllers/ThemeManager.js';
import { AnimationController } from './controllers/AnimationController.js';
import { ControlPanel } from './controllers/ControlPanel.js';
import { SplashScreen } from './components/SplashScreen.js';

/**
 * Main App class that coordinates all components and controllers
 */
export class App {
  /**
   * Create a new App instance
   */
  constructor() {
    this.initializeApp();
  }

  /**
   * Initialize the application with splash screen and preloading
   */
  async initializeApp() {
    // Create and show splash screen
    this.splashScreen = new SplashScreen();
    this.splashScreen.log('🚀 Initializing bruno 0.1...', 5);

    try {
      // Initialize core managers
      this.splashScreen.log('📦 Loading core managers...', 15);
      this.themeManager = new ThemeManager();
      this.audioManager = new AudioManager();
      this.animationController = new AnimationController();
      
      // Initialize audio system
      this.splashScreen.log('🎵 Initializing audio system...', 25);
      await this.audioManager.initializeAudioContext();
      
      // Set up audio player
      this.splashScreen.log('🎧 Setting up audio player...', 35);
      this.audioPlayer = new AudioPlayer(this.audioManager);
      document.body.appendChild(this.audioPlayer.element);
      
      // Preload audio
      this.splashScreen.log('📥 Loading audio assets...', 45);
      const audioLoaded = await this.audioManager.loadAudio('/public/audio/Music/song1.mp3');
      if (!audioLoaded) {
        this.splashScreen.log('⚠️ Audio loading failed, continuing without audio...', 50);
      } else {
        this.splashScreen.log('✅ Audio assets loaded', 55);
        this.audioPlayer.onAudioLoaded();
      }

      // Initialize visual components
      this.splashScreen.log('🎨 Loading visual components...', 65);
      this.controlPanel = new ControlPanel('control-panels');
      this.starfield = new Starfield();
      this.vectorGrid = new VectorGrid();
      this.asciiTunnel = new ASCIITunnel();
      this.grid = new Grid();
      this.solarSystem = new SolarSystem();
      this.agentSystem = new AgentSystem();
      this.headline = new Headline(this.audioManager);
      
      // Set up controls
      this.splashScreen.log('🎛️ Initializing controls...', 85);
      this.setupControls();
      
      // Complete initialization
      this.splashScreen.log('✨ Initialization complete - Click anywhere to start audio', 100);
      
      // Hide splash screen after a short delay
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
      
    } catch (error) {
      this.splashScreen.log(`❌ Error during initialization: ${error.message}`, 100);
      console.error('Initialization error:', error);
    }
  }

  /**
   * Set up all UI controls
   */
  setupControls() {
    // Theme Controls
    this.controlPanel.addHeading('Theme');
    this.controlPanel.addThemeSwitch(
      checked => {
        this.themeManager.toggleTheme();
      }
    );
    this.controlPanel.addSeparator();

    // Animation Controls
    this.controlPanel.addHeading('Animation Presets');
    
    // Grid Animation
    this.controlPanel.addAnimationSelect(
      'gridAnimation',
      'Grid Effect',
      this.animationController.getAnimationList(),
      value => this.grid.element.querySelectorAll('div').forEach(div => 
        this.animationController.applyAnimation(div, value))
    );
    
    // Solar System Animation
    this.controlPanel.addAnimationSelect(
      'solarAnimation',
      'Solar System Effect',
      this.animationController.getAnimationList(),
      value => {
        this.animationController.applyAnimation(this.solarSystem.element, value);
        this.solarSystem.element.querySelectorAll('.planet').forEach(planet => 
          this.animationController.applyAnimation(planet, value));
      }
    );
    
    // Headline Animation
    this.controlPanel.addAnimationSelect(
      'headlineAnimation',
      'Text Effect',
      this.animationController.getAnimationList(),
      value => this.animationController.applyAnimation(this.headline.element, value)
    );
    
    this.controlPanel.addSeparator();

    // Grid Controls
    this.controlPanel.addHeading('Grid Controls');
    this.controlPanel.addSlider('gridSize', 'Grid Size', 5, 40, 20, 1, 
      value => this.grid.setSize(parseInt(value)));
    this.controlPanel.addSlider('cubeSpeed', 'Cube Speed', 1, 10, 3, 0.1,
      value => this.grid.setCubeSpeed(value));
    
    // Solar System Controls
    this.controlPanel.addSeparator();
    this.controlPanel.addHeading('Solar System Controls');
    this.controlPanel.addSlider('radialSpeed', 'Orbit Speed', 1, 60, 20, 1,
      value => this.solarSystem.setOrbitSpeed(value));
    
    // Agent Controls
    this.controlPanel.addSeparator();
    this.controlPanel.addHeading('Agent Controls');
    this.controlPanel.addSlider('agentCount', 'Agents', 10, 200, 60, 1,
      value => this.agentSystem.setAgentCount(parseInt(value)));
    this.controlPanel.addSlider('connectDist', 'Connect Distance', 10, 300, 100, 1,
      value => this.agentSystem.setConnectDistance(parseInt(value)));
    
    // Visibility Controls
    this.controlPanel.addSeparator();
    this.controlPanel.addHeading('Layer Visibility');
    this.controlPanel.addCheckbox('toggleStarfield', 'Show Starfield', true,
      visible => this.starfield.setVisibility(visible));
    this.controlPanel.addSlider('starfieldOpacity', 'Starfield Opacity', 0, 1, 1, 0.1,
      value => this.starfield.setOpacity(value));
    this.controlPanel.addCheckbox('toggleVectorGrid', 'Show Vector Grid', true,
      visible => this.vectorGrid.setVisibility(visible));
    this.controlPanel.addSlider('vectorGridOpacity', 'Vector Grid Opacity', 0, 1, 0.5, 0.1,
      value => this.vectorGrid.setOpacity(value));
    this.controlPanel.addCheckbox('toggleASCIITunnel', 'Show ASCII Tunnel', true,
      visible => this.asciiTunnel.setVisibility(visible));
    this.controlPanel.addSlider('asciiTunnelOpacity', 'ASCII Tunnel Opacity', 0, 1, 0.3, 0.1,
      value => this.asciiTunnel.setOpacity(value));
    this.controlPanel.addCheckbox('toggleGrid', 'Show Grid', true,
      visible => this.grid.setVisibility(visible));
    this.controlPanel.addCheckbox('toggleSolar', 'Show Solar System', true,
      visible => this.solarSystem.setVisibility(visible));
    this.controlPanel.addCheckbox('toggleAgents', 'Show Agents', true,
      visible => this.agentSystem.setVisibility(visible));
    this.controlPanel.addCheckbox('toggleText', 'Show Text', true,
      visible => this.headline.setVisibility(visible));
    
    // Text Control
    this.controlPanel.addSeparator();
    this.controlPanel.addHeading('Text Control');
    this.controlPanel.addTextInput('headlineInput', 'Headline Text', 'OMNIVOID',
      text => this.headline.setText(text));
  }
} 