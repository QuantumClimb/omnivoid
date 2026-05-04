import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { useAudioManager } from './hooks/useAudioManager.js';
import { useThemeManager } from './hooks/useThemeManager.js';
import { useAppState } from './hooks/useAppState.js';
import { AppState } from './state/AppState.js';

/**
 * Detect if device is mobile
 */
function detectMobile() {
  return globalThis.innerWidth < 768 || 
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         ('ontouchstart' in globalThis) ||
         (navigator.maxTouchPoints > 0);
}

/**
 * React wrapper component for the OMNIVOID application
 * This provides React-based UI controls that work alongside the vanilla JS app
 * The vanilla JS app handles the main visual effects and content
 */
function OmnivoidApp() {
  const appInstanceRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appVersion, setAppVersion] = useState(null);

  // Detect device type
  const isMobile = detectMobile();

  // Initialize React hooks that bridge to vanilla JS systems
  const audioManager = useAudioManager();
  const themeManager = useThemeManager();

  // Initialize centralized state
  const [state] = useState(() => new AppState({
    device: { isMobile }
  }));

  // The vanilla JS app is loaded separately in index.html
  // This React component just provides additional UI controls
  useEffect(() => {
    console.log('⚛️ React UI components initialized');
    setIsInitialized(true);
    
    // Log which version of the app should be running
    const isMobileDevice = detectMobile();
    setAppVersion(isMobileDevice ? 'mobile' : 'desktop');
    console.log(`📱 React UI ready for ${isMobileDevice ? 'Mobile' : 'Desktop'} mode`);
    
    return () => {
      console.log('⚛️ React UI components cleaning up');
    };
  }, []);

  // Main app UI - just render the React controls, not the full app
  return (
    <>
      {/* Audio controls (React version) - positioned above everything */}
      <AudioControls 
        audioManager={audioManager}
        state={state}
      />

      {/* Theme controls (React version) */}
      <ThemeControls 
        themeManager={themeManager}
      />

      {/* Debug overlay (optional) */}
      {state.get('ui.showDebug') && (
        <DebugOverlay 
          state={state}
          audioManager={audioManager}
          themeManager={themeManager}
          appVersion={appVersion}
        />
      )}
    </>
  );
}

/**
 * Audio controls component
 */
function AudioControls({ audioManager, state }) {
  const { isPlaying, volume, isMuted, play, pause, toggleMute, setVolume } = audioManager;

  return (
    <div className="audio-controls" style={{
      position: 'fixed',
      bottom: '80px',
      right: '20px',
      display: 'flex',
      gap: '10px',
      zIndex: 1000
    }}>
      <button 
        onClick={isPlaying ? pause : play}
        style={{
          background: '#111111',
          border: '1px solid #99ccff',
          color: '#99ccff',
          padding: '10px 15px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: 'Space Mono, monospace'
        }}
      >
        {isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>
      
      <button 
        onClick={toggleMute}
        style={{
          background: isMuted ? '#99ccff' : '#111111',
          border: '1px solid #99ccff',
          color: isMuted ? '#000000' : '#99ccff',
          padding: '10px 15px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: 'Space Mono, monospace'
        }}
      >
        {isMuted ? '🔇 Unmute' : '🔊 Mute'}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        style={{
          width: '80px',
          accentColor: '#99ccff'
        }}
      />
    </div>
  );
}

/**
 * Theme controls component
 */
function ThemeControls({ themeManager }) {
  const { currentTheme, cycleTheme, getCurrentPalette } = themeManager;
  const palette = getCurrentPalette();

  return (
    <div className="theme-controls" style={{
      position: 'fixed',
      bottom: '80px',
      left: '20px',
      zIndex: 1000
    }}>
      <button
        onClick={cycleTheme}
        style={{
          background: palette.accent1,
          border: `1px solid ${palette.accent1}`,
          color: '#000000',
          padding: '10px 15px',
          borderRadius: '20px',
          cursor: 'pointer',
          fontFamily: 'Space Mono, monospace',
          fontWeight: 'bold'
        }}
      >
        🎨 Theme: {currentTheme}
      </button>
    </div>
  );
}

/**
 * Debug overlay component
 */
function DebugOverlay({ state, audioManager, themeManager }) {
  return (
    <div className="debug-overlay" style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(17, 17, 17, 0.9)',
      border: '1px solid #333333',
      padding: '15px',
      borderRadius: '8px',
      color: '#99ccff',
      fontFamily: 'Space Mono, monospace',
      fontSize: '11px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#99ccff' }}>Debug Info</h3>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Audio:</strong><br/>
        Playing: {audioManager.isPlaying ? 'Yes' : 'No'}<br/>
        Volume: {Math.round(audioManager.volume * 100)}%<br/>
        Muted: {audioManager.isMuted ? 'Yes' : 'No'}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>Theme:</strong> {themeManager.currentTheme}<br/>
        <strong>Palette:</strong><br/>
        <span style={{ color: themeManager.getCurrentPalette().accent1 }}>■ Primary</span>
        <span style={{ color: themeManager.getCurrentPalette().accent2, marginLeft: '5px' }}>■ Secondary</span>
      </div>

      <div>
        <strong>Device:</strong> {state.get('device.isMobile') ? 'Mobile' : 'Desktop'}
      </div>
    </div>
  );
}

/**
 * Initialize React app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-root') || document.body;
  
  // Create a container for React if it doesn't exist
  let reactContainer = document.getElementById('react-root');
  if (!reactContainer) {
    reactContainer = document.createElement('div');
    reactContainer.id = 'react-root';
    reactContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;';
    document.body.appendChild(reactContainer);
  }

  const root = createRoot(reactContainer);
  root.render(
    <React.StrictMode>
      <OmnivoidApp />
    </React.StrictMode>
  );
});

export default OmnivoidApp;