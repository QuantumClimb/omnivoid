/**
 * AnimationController for managing animation presets and transitions
 */
export class AnimationController {
  /**
   * Create a new AnimationController instance
   */
  constructor() {
    this.animations = {
      'none': { name: 'None', duration: 0 },
      // Visual Geometry
      'tunnel': { name: 'ASCII Tunnel', duration: 2 },
      'gridScroll': { name: 'Vector Grid Crawl', duration: 2 },
      'pulse': { name: 'Hex Grid Pulse', duration: 2 },
      'cubeRotate': { name: 'Wireframe Cube', duration: 3 },
      'moire': { name: 'Moiré Rings', duration: 2 },
      // 8-Bit and CRT Aesthetics
      'starMove': { name: '8-Bit Starfield', duration: 3 },
      'scanline': { name: 'CRT Scanlines', duration: 0.1 },
      'drift': { name: 'Signal Drift', duration: 0.2 },
      'hudFlicker': { name: 'Broken HUD', duration: 0.5 },
      'textRain': { name: 'DOS Command Flood', duration: 3 },
      // Particles & Physics
      'orbit': { name: 'Gravity Well', duration: 3 },
      'fireRise': { name: 'Lo-fi Fire', duration: 1 },
      'rainFall': { name: 'Rainfall', duration: 1 },
      'echoWave': { name: 'Echo Waveform', duration: 2 },
      'shardScatter': { name: 'Chunk Shards', duration: 1 },
      // Reactive / Music-Synced
      'pulseBeat': { name: 'Beat Circles', duration: 1 },
      'radarRotate': { name: 'Radar Sweep', duration: 2 },
      'flameFlicker': { name: 'Low-Res Flame Grid', duration: 0.5 },
      'spectrumBounce': { name: 'Spectrum Bars', duration: 1 },
      'bounceBeat': { name: 'Dancing Shapes', duration: 1 }
    };
  }

  /**
   * Apply an animation to an element
   * @param {HTMLElement} element Element to animate
   * @param {string} animationName Name of the animation to apply
   */
  applyAnimation(element, animationName) {
    if (!element) return;
    
    // Remove any existing animation
    element.style.animation = '';
    element.classList.remove('animated');
    
    if (animationName === 'none') return;
    
    const animation = this.animations[animationName];
    if (!animation) return;
    
    element.classList.add('animated');
    element.style.animation = `${animationName} ${animation.duration}s infinite linear`;
  }

  /**
   * Get a list of all available animations
   * @returns {Array<{id: string, name: string}>} List of animations
   */
  getAnimationList() {
    return Object.entries(this.animations).map(([key, value]) => ({
      id: key,
      name: value.name
    }));
  }
} 