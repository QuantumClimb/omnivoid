import { useState, useEffect, useCallback, useRef } from 'react';
import { ThemeManager } from '../controllers/ThemeManager.js';

/**
 * React hook for accessing and controlling the ThemeManager
 * Provides a React-friendly interface to the theme/color system
 * 
 * @returns {Object} Theme manager state and controls
 */
export function useThemeManager() {
  const themeManagerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [colors, setColors] = useState({
    background: '#0a0a0a',
    foreground: '#ffffff',
    accent1: '#ff6b9d',
    accent2: '#99ccff',
    accent3: '#00ff88',
    track: '#333333',
    thumb: '#666666',
    panel: '#1a1a1a',
  });
  const [error, setError] = useState(null);

  // Initialize theme manager on mount
  useEffect(() => {
    let isMounted = true;

    const initTheme = () => {
      try {
        themeManagerRef.current = ThemeManager.getInstance();
        
        if (isMounted) {
          setIsInitialized(true);
          
          // Get current theme
          const theme = themeManagerRef.current.getCurrentTheme?.() || 'dark';
          setCurrentTheme(theme);
          
          // Get current colors
          const currentColors = themeManagerRef.current.getColors?.() || colors;
          setColors(currentColors);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    initTheme();
  }, []);

  // Set theme
  const setTheme = useCallback((theme) => {
    if (themeManagerRef.current?.setTheme) {
      themeManagerRef.current.setTheme(theme);
      setCurrentTheme(theme);
      
      // Update document theme
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [currentTheme, setTheme]);

  // Apply random theme colors
  const randomizeColors = useCallback(() => {
    if (themeManagerRef.current?.randomizeTheme) {
      const newColors = themeManagerRef.current.randomizeTheme();
      setColors(newColors);
      return newColors;
    }
    return null;
  }, []);

  // Set specific color
  const setColor = useCallback((key, value) => {
    if (themeManagerRef.current?.setColor) {
      themeManagerRef.current.setColor(key, value);
      setColors(prev => ({ ...prev, [key]: value }));
    }
  }, []);

  // Get color value
  const getColor = useCallback((key) => {
    if (themeManagerRef.current?.getColor) {
      return themeManagerRef.current.getColor(key);
    }
    return colors[key] || null;
  }, [colors]);

  // Get CSS variable value
  const getCSSVariable = useCallback((name) => {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }, []);

  // Set CSS variable
  const setCSSVariable = useCallback((name, value) => {
    document.documentElement.style.setProperty(name, value);
  }, []);

  // Subscribe to theme changes
  const subscribeToThemeChanges = useCallback((callback) => {
    if (themeManagerRef.current?.subscribe) {
      return themeManagerRef.current.subscribe(callback);
    }
    return () => {};
  }, []);

  return {
    // State
    isInitialized,
    currentTheme,
    colors,
    error,

    // Controls
    setTheme,
    toggleTheme,
    randomizeColors,
    setColor,
    getColor,
    getCSSVariable,
    setCSSVariable,
    subscribeToThemeChanges,

    // Direct access (use sparingly)
    themeManager: themeManagerRef.current,
  };
}