/**
 * OMNIVOID React Adapter Layer
 * 
 * This module exports all React hooks and wrapper components for integrating
 * the vanilla JavaScript OMNIVOID codebase with React applications.
 * 
 * @module hooks
 */

// State management hooks
export { useAppState } from './useAppState.js';

// Manager hooks
export { useAudioManager } from './useAudioManager.js';
export { useThemeManager } from './useThemeManager.js';

// Component wrappers
export { 
  CanvasComponent, 
  StarfieldCanvas, 
  ASCIITunnelCanvas, 
  AgentSystemCanvas, 
  PolygonEchoCanvas 
} from './CanvasComponent.js';

export { 
  WindowSystem, 
  RetroWindow, 
  AsciiWindow, 
  useWindowManager 
} from './WindowSystem.js';

/**
 * @typedef {Object} AudioManagerState
 * @property {boolean} isInitialized - Whether the audio manager is initialized
 * @property {boolean} isPlaying - Whether audio is currently playing
 * @property {number} currentTime - Current playback time in seconds
 * @property {number} duration - Total duration of the audio in seconds
 * @property {number} volume - Current volume (0-1)
 * @property {boolean} isMuted - Whether audio is muted
 * @property {string|null} error - Error message if any
 */

/**
 * @typedef {Object} ThemeManagerState
 * @property {boolean} isInitialized - Whether the theme manager is initialized
 * @property {string} currentTheme - Current theme name ('dark' or 'light')
 * @property {Object} colors - Current color palette
 * @property {string|null} error - Error message if any
 */

/**
 * @typedef {Object} AppState
 * @property {Object} state - Full state snapshot
 * @property {boolean} isInitialized - Whether the app state is initialized
 * @property {string|null} error - Error message if any
 * @property {Function} get - Get value by path
 * @property {Function} set - Set value by path
 * @property {Function} update - Update value by path
 * @property {Function} getSnapshot - Get full state snapshot
 */

/**
 * @typedef {Object} CanvasComponentProps
 * @property {Function} createComponent - Function that creates the component instance
 * @property {Object} componentProps - Props to pass to the component
 * @property {string} [canvasId] - ID for the canvas element
 * @property {Object} [canvasStyle] - CSS styles for the canvas
 * @property {Function} [onMount] - Callback when component is mounted
 * @property {Function} [onUpdate] - Callback when component is updated
 * @property {Function} [onUnmount] - Callback when component is unmounted
 */

/**
 * @typedef {Object} WindowSystemProps
 * @property {Function} createWindow - Function that creates the window instance
 * @property {Object} windowProps - Props to pass to the window
 * @property {boolean} [isVisible] - Whether the window is visible
 * @property {Function} [onClose] - Callback when window is closed
 * @property {Function} [onMount] - Callback when window is mounted
 * @property {Function} [onUnmount] - Callback when window is unmounted
 */