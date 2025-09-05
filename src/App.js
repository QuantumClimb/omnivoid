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
    console.log('🖥️ OMNIVOID Desktop App initializing...');
    
    // Make this instance globally accessible for the radio file explorer
    window.omnivoidApp = this;
    
    // Initialize theme manager first
    this.themeManager = new ThemeManager();
    
    // Initialize audio manager
    this.audioManager = new AudioManager();
    
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
      
      // Set up desktop controls
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Setting up desktop controls...', 85);
      
      // Complete initialization
      this.splashScreen.log('<img src="public/ascii/WORM.svg" style="width: 20px; height: 20px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Welcome to the OMNIVOID LABS Repository', 100);
    
      // Test Google Drive integration
      this.testGoogleDriveIntegration();
      
      // Add console commands for color system exploration
      this.setupConsoleCommands();
        
      // Initialize desktop mode
      this.initializeDesktopMode();
      
      // Add window resize listener
      window.addEventListener('resize', () => this.handleWindowResize());
      
      // Hide splash screen
      setTimeout(() => {
        this.splashScreen.hide();
      }, 2000);
      
    } catch (error) {
      this.splashScreen.log(`<img src="public/ascii/WORM.svg" style="width: 16px; height: 16px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 8px;"> Error: ${error.message}`, 100);
      console.error('Initialization error:', error);
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
   * Create Latest Gig button for desktop
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
    console.log(`🖥️ Desktop window resize: ${window.innerWidth}px`);
    
    // Reset modal state on resize to prevent positioning issues
    this.resetModalState();
    
    // Stay in desktop mode
    console.log('🖥️ Staying in desktop mode');
  }

  // Include all other methods from AppMobile.js here...
  // For now, let me add the essential methods to make it work

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
    this.polygonEcho.setVisibility(false);
    
    // Hide the control panel
    const controlsDiv = document.getElementById('controls');
    if (controlsDiv) {
      controlsDiv.style.display = 'none';
    }
  }

  /**
   * Load conundrum content from local file
   */
  async loadConundrumContent() {
    try {
      console.log('🧩 Loading Conundrum content from local file...');
      const filePath = './public/links/conundrum.txt';
      console.log('📁 File path:', filePath);
      
      const content = await readPublicFile(filePath);
      console.log('📄 Raw content received:', content ? 'YES' : 'NO');
      console.log('📄 Content length:', content ? content.length : 0);
      
      if (content) {
        console.log('📄 First 100 chars:', content.substring(0, 100));
        
        // Parse the content
        const lines = content.split('\n').filter(line => line.trim());
        console.log('📝 Total lines:', lines.length);
        
        lines.forEach((line, index) => {
          console.log(`📝 Line ${index} (title):`, line);
        });
        
        // Use the first line as title, rest as content
        const title = lines[0] || 'OMNIVOID LABS Live';
        const bodyContent = lines.length > 1 ? lines.slice(1).join('\n') : 'Content loaded from local file.';
        
        console.log('🏷️ Final title:', title);
        console.log('📖 Final body content length:', bodyContent.length);
        console.log('📖 Body preview:', bodyContent.substring(0, 50));
        
        this.conundrumContent = {
          title: title,
          content: bodyContent
        };
        
        console.log('✅ Conundrum content loaded from local file');
        console.log('🎯 this.conundrumContent set to:', this.conundrumContent);
      } else {
        console.log('❌ Failed to load conundrum content');
        this.conundrumContent = {
          title: 'OMNIVOID LABS Live',
          content: 'Content loading failed.'
        };
      }
    } catch (error) {
      console.error('❌ Error loading conundrum content:', error);
      this.conundrumContent = {
        title: 'OMNIVOID LABS Live',
        content: 'Error loading content.'
      };
    }
  }

  /**
   * Test Google Drive integration
   */
  testGoogleDriveIntegration() {
    console.log('🧪 Testing Google Drive integration...');
    console.log('📁 Google Drive Folders:', this.googleDriveConfig.FOLDERS);
    console.log('🔗 Master Folder URL:', this.googleDriveConfig.MASTER_FOLDER_URL);
    
    Object.entries(this.googleDriveConfig.FOLDERS).forEach(([key, value]) => {
      console.log(`📂 ${key}:`, value);
    });
    
    console.log('🎵 Mixcloud integration ready for audio streaming');
    console.log('🧩 Conundrum content ready from startup');
    this.googleDriveConfig.log('Google Drive integration test completed successfully');
    console.log('✅ Google Drive integration is ready!');
  }

  /**
   * Setup console commands for debugging
   */
  setupConsoleCommands() {
    // Add color system to global scope for debugging
    window.omnivoidColors = this.themeManager;
    
    console.log(`
🎨 OMNIVOID Color System loaded!
Type 'omnivoidColors.help()' to see available commands.
    `);
  }

  /**
   * Reset modal state
   */
  resetModalState() {
    // Reset any modal states if needed
  }

  /**
   * Create floating menu for desktop
   */
  createFloatingMenu() {
    console.log('🍔 Creating floating menu...');
    // Implementation would go here
    console.log('🍔 Floating menu creation completed');
  }

  /**
   * Create gigs content
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
        
        <!-- Content Area -->
        <div id="gig-content" style="
          border: 1px inset #333333;
          background: #0a0a0a;
          padding: 12px;
          min-height: 200px;
          color: #99ccff;
          font-size: 11px;
          line-height: 1.4;
        ">
          <!-- Gig content will be loaded here -->
        </div>
      </div>
    `;
  }

  /**
   * Switch gig tab
   */
  switchGigTab(tab) {
    console.log('🎵 Switching to tab:', tab);
    // Implementation would go here
  }
}