/**
 * ThemeManager controller for handling theme switching
 */
export class ThemeManager {
  /**
   * Create a new ThemeManager instance
   */
  constructor() {
    this.root = document.documentElement;
    this.currentTheme = 'dark';
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.root.setAttribute('data-theme', this.currentTheme);
  }

  /**
   * Get the current theme
   * @returns {string} Current theme name ('dark' or 'light')
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
} 