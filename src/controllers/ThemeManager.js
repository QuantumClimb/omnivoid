/**
 * ThemeManager controller for handling theme switching
 */
export class ThemeManager {
  /**
   * Create a new ThemeManager instance
   */
  constructor() {
    this.root = document.documentElement;
    this.currentTheme = 'dark'; // Start with dark mode
    this.themes = ['dark', 'random']; // Remove light theme
    this.currentThemeIndex = 0; // Start at dark (index 0)
    
    // Store component references for dynamic color updates
    this.solarSystem = null;
    this.agentSystem = null;
    
    // Color generation strategies for more variety
    this.colorStrategies = [
      'complementary',    // Opposite colors on color wheel
      'triadic',         // Three colors equally spaced
      'analogous',       // Adjacent colors
      'monochromatic',   // Same hue, different saturation/lightness
      'split-complementary', // Base color + two colors adjacent to its complement
      'random-spectrum'  // Completely random across full spectrum
    ];
    
    this.currentStrategy = 0;
    
    // Don't apply random theme on initialization - start with dark
  }

  /**
   * Set component references for dynamic color updates
   */
  setComponents(solarSystem, agentSystem, polygonEcho) {
    this.solarSystem = solarSystem;
    this.agentSystem = agentSystem;
    this.polygonEcho = polygonEcho;
  }

  /**
   * Cycle through themes: dark -> random -> dark...
   */
  cycleTheme() {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    this.currentTheme = this.themes[this.currentThemeIndex];
    
    if (this.currentTheme === 'random') {
      this.applyRandomTheme();
    } else {
      this.root.setAttribute('data-theme', this.currentTheme);
      // Reset component colors to default when switching away from random
      this.resetComponentColors();
    }
  }

  /**
   * Toggle between dark and random themes
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'random' : 'dark';
    if (this.currentTheme === 'random') {
      this.applyRandomTheme();
    } else {
      this.root.setAttribute('data-theme', this.currentTheme);
      this.resetComponentColors();
    }
  }

  /**
   * Apply a random color scheme with enhanced variety
   */
  applyRandomTheme() {
    // Generate a cohesive color palette based on current strategy
    const colorPalette = this.generateColorPalette();
    
    // Log the current strategy and colors for debugging
    console.log(`🎨 Applied ${this.colorStrategies[this.currentStrategy]} color strategy:`, {
      background: colorPalette.background,
      foreground: colorPalette.foreground,
      accent1: colorPalette.accent1,
      accent2: colorPalette.accent2,
      accent3: colorPalette.accent3
    });
    
    // Apply colors to CSS custom properties
    this.root.style.setProperty('--bg-color', colorPalette.background);
    this.root.style.setProperty('--fg-color', colorPalette.foreground);
    this.root.style.setProperty('--panel-bg', colorPalette.panel);
    this.root.style.setProperty('--track-color', colorPalette.track);
    this.root.style.setProperty('--thumb-color', colorPalette.thumb);
    
    // Remove data-theme attribute to use custom properties
    this.root.removeAttribute('data-theme');
    
    // Update visual components with new colors
    this.updateComponentColors(colorPalette);
  }

  /**
   * Generate a cohesive color palette using different strategies
   */
  generateColorPalette() {
    const strategy = this.colorStrategies[this.currentStrategy];
    let baseHue, colors;
    
    switch (strategy) {
      case 'complementary':
        baseHue = Math.floor(Math.random() * 360);
        colors = this.generateComplementaryColors(baseHue);
        break;
      case 'triadic':
        baseHue = Math.floor(Math.random() * 360);
        colors = this.generateTriadicColors(baseHue);
        break;
      case 'analogous':
        baseHue = Math.floor(Math.random() * 360);
        colors = this.generateAnalogousColors(baseHue);
        break;
      case 'monochromatic':
        baseHue = Math.floor(Math.random() * 360);
        colors = this.generateMonochromaticColors(baseHue);
        break;
      case 'split-complementary':
        baseHue = Math.floor(Math.random() * 360);
        colors = this.generateSplitComplementaryColors(baseHue);
        break;
      case 'random-spectrum':
      default:
        colors = this.generateRandomSpectrumColors();
        break;
    }
    
    return {
      background: colors.background,
      foreground: colors.foreground,
      panel: colors.panel,
      track: colors.track,
      thumb: colors.thumb,
      accent1: colors.accent1,
      accent2: colors.accent2,
      accent3: colors.accent3
    };
  }

  /**
   * Generate complementary colors (opposite on color wheel)
   */
  generateComplementaryColors(baseHue) {
    const sat = Math.floor(Math.random() * 30) + 70; // 70-100%
    const light = Math.floor(Math.random() * 30) + 25; // 25-55%
    
    return {
      background: `hsl(${baseHue}, ${sat}%, ${light}%)`,
      foreground: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${light > 40 ? 15 : 85}%)`,
      panel: `hsla(${baseHue}, ${sat}%, ${light + 10}%, 0.8)`,
      track: `hsl(${(baseHue + 90) % 360}, ${sat}%, ${light - 10}%)`,
      thumb: `hsl(${(baseHue + 270) % 360}, ${sat}%, ${light + 15}%)`,
      accent1: `hsl(${(baseHue + 60) % 360}, ${sat}%, ${light + 5}%)`,
      accent2: `hsl(${(baseHue + 120) % 360}, ${sat}%, ${light - 5}%)`,
      accent3: `hsl(${(baseHue + 240) % 360}, ${sat}%, ${light + 10}%)`
    };
  }

  /**
   * Generate triadic colors (three colors equally spaced)
   */
  generateTriadicColors(baseHue) {
    const sat = Math.floor(Math.random() * 25) + 75; // 75-100%
    const light = Math.floor(Math.random() * 35) + 20; // 20-55%
    
    return {
      background: `hsl(${baseHue}, ${sat}%, ${light}%)`,
      foreground: `hsl(${(baseHue + 120) % 360}, ${sat}%, ${light > 40 ? 20 : 80}%)`,
      panel: `hsla(${baseHue}, ${sat}%, ${light + 15}%, 0.8)`,
      track: `hsl(${(baseHue + 240) % 360}, ${sat}%, ${light - 5}%)`,
      thumb: `hsl(${(baseHue + 60) % 360}, ${sat}%, ${light + 10}%)`,
      accent1: `hsl(${(baseHue + 90) % 360}, ${sat}%, ${light + 5}%)`,
      accent2: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${light - 10}%)`,
      accent3: `hsl(${(baseHue + 300) % 360}, ${sat}%, ${light + 15}%)`
    };
  }

  /**
   * Generate analogous colors (adjacent on color wheel)
   */
  generateAnalogousColors(baseHue) {
    const sat = Math.floor(Math.random() * 20) + 80; // 80-100%
    const light = Math.floor(Math.random() * 30) + 25; // 25-55%
    
    return {
      background: `hsl(${baseHue}, ${sat}%, ${light}%)`,
      foreground: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${light > 40 ? 15 : 85}%)`,
      panel: `hsla(${baseHue}, ${sat}%, ${light + 10}%, 0.8)`,
      track: `hsl(${(baseHue + 30) % 360}, ${sat}%, ${light - 5}%)`,
      thumb: `hsl(${(baseHue + 330) % 360}, ${sat}%, ${light + 10}%)`,
      accent1: `hsl(${(baseHue + 15) % 360}, ${sat}%, ${light + 5}%)`,
      accent2: `hsl(${(baseHue + 45) % 360}, ${sat}%, ${light - 10}%)`,
      accent3: `hsl(${(baseHue + 315) % 360}, ${sat}%, ${light + 15}%)`
    };
  }

  /**
   * Generate monochromatic colors (same hue, different saturation/lightness)
   */
  generateMonochromaticColors(baseHue) {
    const sat = Math.floor(Math.random() * 40) + 60; // 60-100%
    const light = Math.floor(Math.random() * 30) + 20; // 20-50%
    
    return {
      background: `hsl(${baseHue}, ${sat}%, ${light}%)`,
      foreground: `hsl(${baseHue}, ${sat}%, ${light > 40 ? 15 : 85}%)`,
      panel: `hsla(${baseHue}, ${sat}%, ${light + 15}%, 0.8)`,
      track: `hsl(${baseHue}, ${sat - 20}%, ${light - 10}%)`,
      thumb: `hsl(${baseHue}, ${sat + 10}%, ${light + 20}%)`,
      accent1: `hsl(${baseHue}, ${sat + 15}%, ${light + 5}%)`,
      accent2: `hsl(${baseHue}, ${sat - 15}%, ${light - 5}%)`,
      accent3: `hsl(${baseHue}, ${sat + 20}%, ${light + 25}%)`
    };
  }

  /**
   * Generate split-complementary colors
   */
  generateSplitComplementaryColors(baseHue) {
    const sat = Math.floor(Math.random() * 25) + 75; // 75-100%
    const light = Math.floor(Math.random() * 30) + 25; // 25-55%
    
    return {
      background: `hsl(${baseHue}, ${sat}%, ${light}%)`,
      foreground: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${light > 40 ? 20 : 80}%)`,
      panel: `hsla(${baseHue}, ${sat}%, ${light + 10}%, 0.8)`,
      track: `hsl(${(baseHue + 150) % 360}, ${sat}%, ${light - 5}%)`,
      thumb: `hsl(${(baseHue + 210) % 360}, ${sat}%, ${light + 10}%)`,
      accent1: `hsl(${(baseHue + 60) % 360}, ${sat}%, ${light + 5}%)`,
      accent2: `hsl(${(baseHue + 120) % 360}, ${sat}%, ${light - 10}%)`,
      accent3: `hsl(${(baseHue + 300) % 360}, ${sat}%, ${light + 15}%)`
    };
  }

  /**
   * Generate completely random colors across the full spectrum
   */
  generateRandomSpectrumColors() {
    const hues = [
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 360)
    ];
    
    const sat = Math.floor(Math.random() * 35) + 65; // 65-100%
    const light = Math.floor(Math.random() * 35) + 20; // 20-55%
    
    return {
      background: `hsl(${hues[0]}, ${sat}%, ${light}%)`,
      foreground: `hsl(${hues[1]}, ${sat}%, ${light > 40 ? 15 : 85}%)`,
      panel: `hsla(${hues[2]}, ${sat}%, ${light + 10}%, 0.8)`,
      track: `hsl(${hues[3]}, ${sat}%, ${light - 5}%)`,
      thumb: `hsl(${hues[4]}, ${sat}%, ${light + 10}%)`,
      accent1: `hsl(${hues[5]}, ${sat}%, ${light + 5}%)`,
      accent2: `hsl(${hues[6]}, ${sat}%, ${light - 10}%)`,
      accent3: `hsl(${hues[7]}, ${sat}%, ${light + 15}%)`
    };
  }

  /**
   * Update visual components with new random colors
   */
  updateComponentColors(colorPalette) {
    // Update Solar System colors
    if (this.solarSystem) {
      this.solarSystem.updateColors(colorPalette);
    }
    
    // Update Agent System colors and randomize structure
    if (this.agentSystem) {
      this.agentSystem.updateColors(colorPalette);
      // Randomize agent count and connection distance for variety
      this.agentSystem.randomizeStructure();
    }
    
    // Update Polygon Echo colors
    if (this.polygonEcho) {
      this.polygonEcho.updateColors(colorPalette.accent1, colorPalette.accent2);
    }
  }

  /**
   * Reset component colors to default theme
   */
  resetComponentColors() {
    if (this.solarSystem) {
      this.solarSystem.resetColors();
    }
    
    if (this.agentSystem) {
      this.agentSystem.resetColors();
      // Reset agent structure to defaults
      this.agentSystem.resetStructure();
    }
    
    if (this.polygonEcho) {
      this.polygonEcho.updateColors('#ff6b9d', '#ffb6d4');
    }
  }

  /**
   * Generate a random color (legacy method - kept for compatibility)
   * @returns {string} Random HSL color
   */
  generateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 40) + 60; // 60-100%
    const lightness = Math.floor(Math.random() * 40) + 20; // 20-60%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Generate a contrasting color for text
   * @param {string} bgColor - Background color in HSL format
   * @returns {string} Contrasting color
   */
  generateContrastColor(bgColor) {
    // Extract lightness from HSL
    const lightnessMatch = bgColor.match(/,\s*(\d+)%,\s*(\d+)%/);
    if (lightnessMatch) {
      const lightness = parseInt(lightnessMatch[2]);
      return lightness > 50 ? '#000000' : '#FFFFFF';
    }
    return '#FFFFFF'; // fallback
  }

  /**
   * Generate a semi-transparent version of a color
   * @param {string} color - Base color in HSL format
   * @param {number} alpha - Alpha value (0-1)
   * @returns {string} Semi-transparent color
   */
  generateSemiTransparentColor(color, alpha) {
    // Convert HSL to HSLA
    return color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
  }

  /**
   * Get the current theme
   * @returns {string} Current theme name
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get the current color strategy
   * @returns {string} Current color strategy name
   */
  getCurrentStrategy() {
    return this.colorStrategies[this.currentStrategy];
  }

  /**
   * Reset to default theme (dark)
   */
  resetToDefault() {
    this.currentTheme = 'dark';
    this.currentThemeIndex = 0;
    this.root.setAttribute('data-theme', 'dark');
    // Clear custom properties
    this.root.style.removeProperty('--bg-color');
    this.root.style.removeProperty('--fg-color');
    this.root.style.removeProperty('--panel-bg');
    this.root.style.removeProperty('--track-color');
    this.root.style.removeProperty('--thumb-color');
    
    // Reset component colors
    this.resetComponentColors();
  }

  /**
   * Force a new random theme (only when explicitly called)
   */
  forceNewRandomTheme() {
    if (this.currentTheme === 'random') {
      // Cycle to next strategy for variety
      this.currentStrategy = (this.currentStrategy + 1) % this.colorStrategies.length;
      this.applyRandomTheme();
    }
  }

  /**
   * Get a preview of all available color strategies
   * @returns {Array} Array of strategy names with descriptions
   */
  getColorStrategyInfo() {
    return this.colorStrategies.map((strategy, index) => {
      const descriptions = {
        'complementary': 'Opposite colors on color wheel for high contrast',
        'triadic': 'Three colors equally spaced for balanced harmony',
        'analogous': 'Adjacent colors for smooth transitions',
        'monochromatic': 'Same hue with varying saturation/lightness',
        'split-complementary': 'Base color + two colors adjacent to its complement',
        'random-spectrum': 'Completely random colors across full spectrum'
      };
      
      return {
        name: strategy,
        description: descriptions[strategy] || 'No description available',
        isCurrent: index === this.currentStrategy
      };
    });
  }

  /**
   * Preview a specific color strategy without applying it
   * @param {string} strategyName Name of the strategy to preview
   * @returns {Object} Color palette for the strategy
   */
  previewColorStrategy(strategyName) {
    const strategyIndex = this.colorStrategies.indexOf(strategyName);
    if (strategyIndex === -1) {
      console.warn(`Unknown color strategy: ${strategyName}`);
      return null;
    }
    
    // Temporarily set the strategy and generate colors
    const originalStrategy = this.currentStrategy;
    this.currentStrategy = strategyIndex;
    const colorPalette = this.generateColorPalette();
    this.currentStrategy = originalStrategy;
    
    return colorPalette;
  }
} 
