import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * React hook for accessing the centralized AppState
 * Provides a React-friendly interface to the app's state management
 * 
 * @param {Object} appInstance - The App instance (from globalThis.omnivoidApp)
 * @returns {Object} App state and utilities
 */
export function useAppState(appInstance = globalThis.omnivoidApp) {
  const [state, setState] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionRef = useRef(null);

  // Initialize app state on mount
  useEffect(() => {
    let isMounted = true;

    const initState = () => {
      try {
        const app = appInstance || globalThis.omnivoidApp;
        
        if (!app?.state) {
          throw new Error('AppState not available');
        }

        // Get initial state snapshot
        if (isMounted) {
          setState(app.state.getSnapshot());
          setIsInitialized(true);
        }

        // Subscribe to state changes
        subscriptionRef.current = app.state.subscribe((change) => {
          if (isMounted) {
            setState(app.state.getSnapshot());
          }
        });
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    initState();

    return () => {
      isMounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current();
      }
    };
  }, [appInstance]);

  // Get a value by path
  const get = useCallback((path) => {
    const app = appInstance || globalThis.omnivoidApp;
    if (app?.state) {
      return app.state.get(path);
    }
    return undefined;
  }, [appInstance]);

  // Set a value by path
  const set = useCallback((path, value) => {
    const app = appInstance || globalThis.omnivoidApp;
    if (app?.state) {
      return app.state.set(path, value);
    }
    return undefined;
  }, [appInstance]);

  // Update a value by path using an updater function
  const update = useCallback((path, updater) => {
    const app = appInstance || globalThis.omnivoidApp;
    if (app?.state) {
      return app.state.update(path, updater);
    }
    return undefined;
  }, [appInstance]);

  // Get a snapshot of the current state
  const getSnapshot = useCallback(() => {
    const app = appInstance || globalThis.omnivoidApp;
    if (app?.state) {
      return app.state.getSnapshot();
    }
    return null;
  }, [appInstance]);

  // Convenience getters for common state paths
  const isMenuVisible = get('ui.isMenuVisible');
  const activeBackground = get('ui.activeBackground');
  const showDebug = get('ui.showDebug');
  const isMobile = get('device.isMobile');
  const musicFiles = get('music.files');
  const currentMusicIndex = get('music.currentIndex');
  const isMusicPlaying = get('music.isPlaying');
  const mixcloudShows = get('mixcloud.shows');
  const currentMixcloudIndex = get('mixcloud.currentIndex');

  return {
    // State
    state,
    isInitialized,
    error,

    // Core methods
    get,
    set,
    update,
    getSnapshot,

    // Convenience getters
    isMenuVisible,
    activeBackground,
    showDebug,
    isMobile,
    musicFiles,
    currentMusicIndex,
    isMusicPlaying,
    mixcloudShows,
    currentMixcloudIndex,

    // Direct access (use sparingly)
    appState: appInstance?.state,
    app: appInstance,
  };
}