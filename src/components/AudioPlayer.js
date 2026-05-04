import { Component } from './Base.js';

/**
 * AudioPlayer component with minimal WMP-like interface
 */
export class AudioPlayer extends Component {
  /**
   * Create a new AudioPlayer instance
   * @param {AudioManager} audioManager Audio manager instance
   */
  constructor(audioManager) {
    super();
    this.audioManager = audioManager;
    this.isAudioLoaded = false;
    this.progressIntervalId = null;
    this.handlePlayClick = () => this.playAudio();
    this.handleProgressClick = (e) => this.handleProgressBarClick(e);
    this.handleVolumeInput = () => this.audioManager.setVolume(this.volumeControl.value);
    this.createPlayerUI();
    this.setupEventListeners();
  }

  /**
   * Create the player UI
   */
  createPlayerUI() {
    this.element = document.createElement('div');
    this.element.className = 'audio-player';
    
    // Mobile-specific styling
    if (this.isMobile) {
      this.element.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90vw;
        max-width: 400px;
        background: rgba(0, 0, 0, 0.8);
        border: 1px solid #333;
        border-radius: 8px;
        padding: 15px;
        z-index: 1000;
      `;
    }
    
    // Progress bar
    this.progressContainer = document.createElement('div');
    this.progressContainer.className = 'progress-container';
    
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'progress-bar';
    
    this.progressFill = document.createElement('div');
    this.progressFill.className = 'progress-fill';
    
    this.progressBar.appendChild(this.progressFill);
    this.progressContainer.appendChild(this.progressBar);
    
    // Controls
    this.controls = document.createElement('div');
    this.controls.className = 'player-controls';
    
    this.playButton = document.createElement('button');
    this.playButton.className = 'player-button play';
    this.playButton.innerHTML = '▶';
    this.playButton.disabled = true;
    
    // Mobile-specific button styling
    if (this.isMobile) {
      this.playButton.style.cssText = `
        width: 48px;
        height: 48px;
        font-size: 20px;
        border-radius: 50%;
        background: #99ccff;
        color: #000;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10px;
      `;
    }
    
    this.timeDisplay = document.createElement('div');
    this.timeDisplay.className = 'time-display';
    this.timeDisplay.textContent = '0:00 / 0:00';
    
    this.volumeControl = document.createElement('input');
    this.volumeControl.type = 'range';
    this.volumeControl.className = 'volume-control';
    this.volumeControl.min = 0;
    this.volumeControl.max = 1;
    this.volumeControl.step = 0.1;
    this.volumeControl.value = 1;
    
    // Mobile-specific volume control styling
    if (this.isMobile) {
      this.volumeControl.style.cssText = `
        width: 100px;
        height: 6px;
        background: #333;
        outline: none;
        border-radius: 3px;
        -webkit-appearance: none;
      `;
    }
    
    this.controls.appendChild(this.playButton);
    this.controls.appendChild(this.timeDisplay);
    this.controls.appendChild(this.volumeControl);
    
    this.element.appendChild(this.progressContainer);
    this.element.appendChild(this.controls);
    
    document.body.appendChild(this.element);
  }

  /**
   * Called when audio is loaded and ready to play
   */
  onAudioLoaded() {
    console.log('🎵 Audio player ready for playback');
    this.isAudioLoaded = true;
    this.playButton.disabled = false;
    this.playAudio();
  }

  /**
   * Handle play button click
   */
  playAudio() {
    if (!this.isAudioLoaded) {
      console.log('⚠️ Cannot play: Audio not loaded yet');
      return;
    }
    
    if (this.audioManager.isPlaying) {
      this.audioManager.pause();
      this.playButton.innerHTML = '▶';
    } else {
      this.audioManager.play();
      this.playButton.innerHTML = '⏸';
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Play/Pause button
    this.playButton.addEventListener('click', this.handlePlayClick);
    
    // Progress bar
    this.progressBar.addEventListener('click', this.handleProgressClick);
    
    // Volume control
    this.volumeControl.addEventListener('input', this.handleVolumeInput);
    
    // Update progress
    this.progressIntervalId = setInterval(() => {
      if (this.audioManager.isPlaying) {
        const progress = this.audioManager.currentTime / this.audioManager.duration;
        this.updateProgress(progress);
        this.updateTimeDisplay();
      }
    }, 100);
  }

  /**
   * Handle progress bar seeking
   * @param {MouseEvent} e Click event
   */
  handleProgressBarClick(e) {
    if (!this.isAudioLoaded) return;
    const rect = this.progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    this.audioManager.seek(pos * this.audioManager.duration);
    this.updateProgress(pos);
  }

  /**
   * Update progress bar
   * @param {number} progress Progress value between 0 and 1
   */
  updateProgress(progress) {
    this.progressFill.style.width = `${progress * 100}%`;
  }

  /**
   * Update time display
   */
  updateTimeDisplay() {
    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const current = formatTime(this.audioManager.currentTime);
    const total = formatTime(this.audioManager.duration);
    this.timeDisplay.textContent = `${current} / ${total}`;
  }

  /**
   * Clean up DOM listeners and progress timer.
   */
  destroy() {
    this.playButton?.removeEventListener('click', this.handlePlayClick);
    this.progressBar?.removeEventListener('click', this.handleProgressClick);
    this.volumeControl?.removeEventListener('input', this.handleVolumeInput);

    if (this.progressIntervalId) {
      clearInterval(this.progressIntervalId);
      this.progressIntervalId = null;
    }

    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
} 
