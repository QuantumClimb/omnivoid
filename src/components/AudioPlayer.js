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
    this.createPlayerUI();
    this.setupEventListeners();
  }

  /**
   * Create the player UI
   */
  createPlayerUI() {
    this.element = document.createElement('div');
    this.element.className = 'audio-player';
    
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
    this.playButton.addEventListener('click', () => this.playAudio());
    
    // Progress bar
    this.progressBar.addEventListener('click', (e) => {
      if (!this.isAudioLoaded) return;
      const rect = this.progressBar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      this.audioManager.seek(pos * this.audioManager.duration);
      this.updateProgress(pos);
    });
    
    // Volume control
    this.volumeControl.addEventListener('input', () => {
      this.audioManager.setVolume(this.volumeControl.value);
    });
    
    // Update progress
    setInterval(() => {
      if (this.audioManager.isPlaying) {
        const progress = this.audioManager.currentTime / this.audioManager.duration;
        this.updateProgress(progress);
        this.updateTimeDisplay();
      }
    }, 100);
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
} 