/**
 * AudioManager handles audio playback and FFT analysis with optimized performance
 */
export class AudioManager {
  constructor() {
    // Initialize audio context with optimized settings but don't create until user interaction
    this.audioContext = null;
    this.analyser = null;
    this.gainNode = null;
    this.audioWorklet = null;
    
    // Audio state
    this.isInitialized = false;
    this.source = null;
    this.bufferLength = 0;
    this.dataArray = null;
    this.duration = 0;
    this.currentTime = 0;
    this.isPlaying = false;
    this.audioBuffer = null; // Cached audio buffer
    this.pendingPlayback = false;
    
    // Performance optimization flags
    this.isProcessing = false;
    this.frameId = null;
    this.lastFrameTime = 0;
    this.minFrameInterval = 1000 / 60; // Cap at 60fps
    
    // Visualization callbacks
    this.visualizerCallbacks = new Set();

    // Add click listener for initial context resume
    document.addEventListener('click', () => this.handleFirstInteraction(), { once: true });
  }

  /**
   * Handle first user interaction to resume audio context
   */
  async handleFirstInteraction() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      console.log('👆 User interaction detected, resuming audio context...');
      await this.audioContext.resume();
      console.log('✅ Audio context resumed');
      
      if (this.pendingPlayback && this.audioBuffer) {
        this.play();
      }
    }
  }

  /**
   * Initialize the audio context and nodes
   */
  async initializeAudioContext() {
    if (this.isInitialized) {
      console.log('🔄 Audio context already initialized');
      return;
    }

    console.log('🎵 Creating audio context...');
    // Create audio context with optimized settings
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      latencyHint: 'interactive',
      sampleRate: 44100
    });

    console.log('📊 Setting up audio analyzer...');
    // Initialize analyzer with optimized settings
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024; // Reduced for better performance
    this.analyser.smoothingTimeConstant = 0.4; // Better response time
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Float32Array(this.bufferLength);

    console.log('🔊 Creating audio nodes...');
    // Create and connect gain node
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    // Load and initialize audio worklet
    try {
      console.log('🔧 Loading audio worklet...');
      await this.audioContext.audioWorklet.addModule('/src/audio-worklet/audio-processor.js');
      this.audioWorklet = new AudioWorkletNode(this.audioContext, 'audio-processor');
      this.audioWorklet.connect(this.audioContext.destination);
      console.log('✅ Audio worklet loaded and connected');
    } catch (error) {
      console.warn('⚠️ AudioWorklet not supported, falling back to manual processing:', error);
    }

    this.isInitialized = true;
    console.log('✅ Audio context initialization complete');
  }

  /**
   * Load an audio file with optimized buffering
   * @param {string} url URL of the audio file
   */
  async loadAudio(url) {
    try {
      console.log('🎵 Starting audio load process...');
      // Initialize context if not already done
      await this.initializeAudioContext();

      // Stop any existing playback
      if (this.source) {
        console.log('⏹️ Stopping existing playback...');
        this.source.stop();
        this.source.disconnect();
      }

      // Check if we already have this audio buffered
      if (!this.audioBuffer) {
        console.log(`📥 Fetching audio file from: ${url}`);
        const response = await fetch(url);
        console.log('🔄 Converting to array buffer...');
        const arrayBuffer = await response.arrayBuffer();
        console.log('🎼 Decoding audio data...');
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log('✅ Audio buffered successfully');
      } else {
        console.log('📦 Using cached audio buffer');
      }

      this.duration = this.audioBuffer.duration;
      this.currentTime = 0;
      
      console.log('✅ Audio loaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error loading audio:', error);
      return false;
    }
  }

  /**
   * Play the loaded audio
   */
  play() {
    if (!this.audioBuffer) {
      console.log('⚠️ Cannot play: No audio buffer loaded');
      return;
    }
    
    if (this.isPlaying) {
      console.log('⚠️ Already playing');
      return;
    }

    // Check if context is suspended (needs user interaction)
    if (this.audioContext.state === 'suspended') {
      console.log('⏸️ Audio context suspended, waiting for user interaction');
      this.pendingPlayback = true;
      return;
    }
    
    console.log('▶️ Starting audio playback...');
    
    // Create a new source from the cached buffer
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.gainNode);
    
    // Set up ended callback
    this.source.onended = () => {
      console.log('🏁 Audio playback ended');
      this.isPlaying = false;
      this.currentTime = 0;
      this.stopVisualization();
    };
    
    this.source.start(0, this.currentTime);
    this.isPlaying = true;
    this.pendingPlayback = false;
    this.startVisualization();
    console.log('✅ Audio playback started');
  }

  /**
   * Pause the audio
   */
  pause() {
    if (!this.isPlaying) return;
    
    this.source.stop();
    this.isPlaying = false;
    this.stopVisualization();
    
    // Store current time for resuming
    this.currentTime += this.audioContext.currentTime;
  }

  /**
   * Start the visualization loop with frame rate control
   */
  startVisualization() {
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.lastFrameTime = performance.now();
      
      const animate = () => {
        if (!this.isProcessing) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        
        if (deltaTime >= this.minFrameInterval) {
          this.analyser.getFloatFrequencyData(this.dataArray);
          
          // Calculate frequency ranges more efficiently
          const bass = this.getAverageFrequencyRange(0, 100);
          const mid = this.getAverageFrequencyRange(100, 2000);
          const treble = this.getAverageFrequencyRange(2000, 16000);
          
          // Update visualizers with normalized data
          const normalizedData = {
            bass: this.normalizeValue(bass),
            mid: this.normalizeValue(mid),
            treble: this.normalizeValue(treble),
            raw: this.dataArray
          };
          
          this.visualizerCallbacks.forEach(callback => callback(normalizedData));
          this.lastFrameTime = currentTime;
        }
        
        this.frameId = requestAnimationFrame(animate);
      };
      
      animate();
    }
  }

  /**
   * Stop the visualization loop
   */
  stopVisualization() {
    this.isProcessing = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /**
   * Get average frequency value for a specific range with optimized calculation
   * @param {number} startFreq Start frequency
   * @param {number} endFreq End frequency
   * @returns {number} Average value
   */
  getAverageFrequencyRange(startFreq, endFreq) {
    const startIndex = Math.floor(startFreq * this.bufferLength / this.audioContext.sampleRate);
    const endIndex = Math.floor(endFreq * this.bufferLength / this.audioContext.sampleRate);
    let sum = 0;
    
    for (let i = startIndex; i < endIndex; i++) {
      sum += this.dataArray[i];
    }
    
    return sum / (endIndex - startIndex);
  }

  /**
   * Normalize audio data value with improved precision
   * @param {number} value Raw audio data value
   * @returns {number} Normalized value between 0 and 1
   */
  normalizeValue(value) {
    // Convert from dB to linear scale and normalize
    return Math.max(0, Math.min(1, (value + 140) / 140));
  }

  /**
   * Set the volume with smooth transition
   * @param {number} value Volume value between 0 and 1
   */
  setVolume(value) {
    const time = this.audioContext.currentTime;
    this.gainNode.gain.setTargetAtTime(value, time, 0.01);
  }

  /**
   * Seek to a specific time with optimized buffer handling
   * @param {number} time Time in seconds
   */
  seek(time) {
    if (this.isPlaying) {
      this.pause();
    }
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    if (this.isPlaying) {
      this.play();
    }
  }

  /**
   * Add a visualizer callback
   * @param {Function} callback Callback function
   */
  addVisualizer(callback) {
    this.visualizerCallbacks.add(callback);
  }

  /**
   * Remove a visualizer callback
   * @param {Function} callback Callback function
   */
  removeVisualizer(callback) {
    this.visualizerCallbacks.delete(callback);
  }
} 