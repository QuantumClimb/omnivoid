import React, { useEffect, useRef, useCallback, useState } from 'react';
import { RetroWindow as RetroWindowComponent } from '../components/RetroWindow.js';
import { AsciiWindow as AsciiWindowComponent } from '../components/AsciiWindow.js';

/**
 * React wrapper component for vanilla JS window components (RetroWindow, AsciiWindow)
 * Handles mounting, updating, and unmounting of window components
 * 
 * @param {Object} props
 * @param {Function} props.createWindow - Function that creates the window instance
 * @param {Object} props.windowProps - Props to pass to the window (id, title, content, etc.)
 * @param {boolean} props.isVisible - Whether the window is visible
 * @param {Function} props.onClose - Callback when window is closed
 * @param {Function} props.onMount - Callback when window is mounted
 * @param {Function} props.onUnmount - Callback when window is unmounted
 */
export function WindowSystem({
  createWindow,
  windowProps = {},
  isVisible = false,
  onClose,
  onMount,
  onUnmount,
}) {
  const containerRef = useRef(null);
  const windowRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Mount window
  useEffect(() => {
    let mounted = true;

    const mount = () => {
      try {
        // Create window instance
        const { id, title, content, onClose: windowOnClose } = windowProps;
        const window = createWindow({
          id,
          title,
          content,
          onClose: (id) => {
            if (onClose) onClose(id);
            if (windowOnClose) windowOnClose(id);
          },
        });
        windowRef.current = window;

        // Show/hide based on isVisible
        if (isVisible && window.show) {
          window.show();
        }

        if (mounted && onMount) {
          onMount(window);
        }

        setIsMounted(true);
      } catch (error) {
        console.error('WindowSystem mount error:', error);
      }
    };

    mount();

    return () => {
      mounted = false;
      
      // Unmount window
      if (windowRef.current) {
        if (windowRef.current.destroy) {
          windowRef.current.destroy();
        }
        
        if (onUnmount) {
          onUnmount(windowRef.current);
        }
        
        windowRef.current = null;
        setIsMounted(false);
      }
    };
  }, [createWindow, onMount, onUnmount, onClose]);

  // Update visibility
  useEffect(() => {
    if (windowRef.current) {
      if (isVisible) {
        if (windowRef.current.show) {
          windowRef.current.show();
        }
      } else {
        if (windowRef.current.hide) {
          windowRef.current.hide();
        }
      }
    }
  }, [isVisible]);

  // Update content
  useEffect(() => {
    if (windowRef.current && windowRef.current.setContent) {
      windowRef.current.setContent(windowProps.content);
    }
  }, [windowProps.content]);

  // Expose imperative methods
  const show = useCallback(() => {
    if (windowRef.current?.show) {
      windowRef.current.show();
    }
  }, []);

  const hide = useCallback(() => {
    if (windowRef.current?.hide) {
      windowRef.current.hide();
    }
  }, []);

  const toggle = useCallback(() => {
    if (windowRef.current?.toggle) {
      windowRef.current.toggle();
    }
  }, []);

  const setContent = useCallback((content) => {
    if (windowRef.current?.setContent) {
      windowRef.current.setContent(content);
    }
  }, []);

  return null; // Window manages its own DOM
}

/**
 * Pre-configured window components
 */

// RetroWindow component
export function RetroWindow({ id, title, content, isVisible, onClose, ...props }) {
  return (
    <WindowSystem
      createWindow={({ id, title, content, onClose }) => {
        return new RetroWindowComponent(id, title, content, onClose);
      }}
      windowProps={{ id, title, content }}
      isVisible={isVisible}
      onClose={onClose}
      {...props}
    />
  );
}

// AsciiWindow component
export function AsciiWindow({ 
  id = 'ascii-window', 
  title = 'ASCIIVOID', 
  url = 'https://asciivoid.pages.dev/', 
  isVisible, 
  onClose, 
  ...props 
}) {
  return (
    <WindowSystem
      createWindow={({ id, title, url, onClose }) => {
        return new AsciiWindowComponent(id, title, url, onClose);
      }}
      windowProps={{ id, title, url }}
      isVisible={isVisible}
      onClose={onClose}
      {...props}
    />
  );
}

/**
 * Hook for managing multiple windows
 */
export function useWindowManager() {
  const [windows, setWindows] = useState({});

  const openWindow = useCallback((id, config) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...config, isVisible: true },
    }));
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isVisible: false },
    }));
  }, []);

  const toggleWindow = useCallback((id) => {
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isVisible: !prev[id]?.isVisible },
    }));
  }, []);

  const isWindowOpen = useCallback((id) => {
    return windows[id]?.isVisible === true;
  }, [windows]);

  return {
    windows,
    openWindow,
    closeWindow,
    toggleWindow,
    isWindowOpen,
  };
}