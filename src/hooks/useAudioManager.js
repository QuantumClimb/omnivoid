import { useState, useEffect, useCallback, useRef } from 'react';
import { AudioManager } from '../controllers/AudioManager.js';

/**
 * React hook for accessing and controlling the AudioManager
 * Provides a React-friendly interface to the audio system
 * 
 * @returns {Object} Audio manager state and controls
 */
export function useAudioManager() {
  const audioManagerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  // Initialize audio manager on mount
  useEffect(() => {
    let isMounted = true;

    const initAudio = async () => {
      try {
        audioManagerRef.current = AudioManager.getInstance();
        
        // Wait for audio context to be initialized
        if (audioManagerRef.current.audioContext?.state === 'suspended') {
          await audioManagerRef.current.audioContext.resume();
        }

        if (isMounted) {
          setIsInitialized(true);
          
          // Set up event listeners
          const audioElement = audioManagerRef.current.audioElement;
          if (audioElement) {
            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioElement.addEventListener('play', handlePlay);
            audioElement.addEventListener('pause', handlePause);
            audioElement.addEventListener('ended', handleEnded);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    initAudio();

    return () => {
      isMounted = false;
      const audioElement = audioManagerRef.current?.audioElement;
      if (audioElement) {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (audioManagerRef.current) {
      setCurrentTime(audioManagerRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioManagerRef.current) {
      setDuration(audioManagerRef.current.duration);
    }
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  // Play control
  const play = useCallback(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.play();
    }
  }, []);

  // Pause control
  const pause = useCallback(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.pause();
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (audioManagerRef.current) {
      if (isPlaying) {
        audioManagerRef.current.pause();
      } else {
        audioManagerRef.current.play();
      }
    }
  }, [isPlaying]);

  // Seek to position
  const seek = useCallback((time) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.seek(time);
    }
  }, []);

  // Seek by percentage
  const seekToPercent = useCallback((percent) => {
    if (audioManagerRef.current && duration > 0) {
      audioManagerRef.current.seek(percent * duration);
    }
  }, [duration]);

  // Set volume
  const setVolume = useCallback((vol) => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setVolume(vol);
      setVolumeState(vol);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioManagerRef.current) {
      if (isMuted) {
        audioManagerRef.current.setVolume(volume);
        setIsMuted(false);
      } else {
        audioManagerRef.current.setVolume(0);
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  // Get frequency data for visualization
  const getFrequencyData = useCallback(() => {
    if (audioManagerRef.current?.analyser) {
      const dataArray = new Uint8Array(audioManagerRef.current.analyser.frequencyBinCount);
      audioManagerRef.current.analyser.getByteFrequencyData(dataArray);
      return dataArray;
    }
    return null;
  }, []);

  // Get time domain data for waveform
  const getTimeDomainData = useCallback(() => {
    if (audioManagerRef.current?.analyser) {
      const dataArray = new Uint8Array(audioManagerRef.current.analyser.frequencyBinCount);
      audioManagerRef.current.analyser.getByteTimeDomainData(dataArray);
      return dataArray;
    }
    return null;
  }, []);

  return {
    // State
    isInitialized,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    error,

    // Controls
    play,
    pause,
    togglePlay,
    seek,
    seekToPercent,
    setVolume,
    toggleMute,

    // Visualization data
    getFrequencyData,
    getTimeDomainData,

    // Direct access (use sparingly)
    audioManager: audioManagerRef.current,
  };
}