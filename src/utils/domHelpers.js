/**
 * DOM Helper Utilities
 * Shared functions for DOM manipulation across App.js and AppMobile.js
 */

/**
 * Close a popup with fade-out animation
 * @param {HTMLElement} popup - The popup element to close
 * @param {Function} onClose - Optional callback to run after closing
 */
export const closePopup = (popup, onClose) => {
  if (!popup) return;
  
  popup.style.animation = 'fadeOut 0.3s ease';
  setTimeout(() => {
    if (document.body.contains(popup)) {
      popup.remove();
    }
    onClose?.();
  }, 300);
};

/**
 * Create an escape key handler for closing popups
 * @param {Function} closeCallback - Callback to execute when Escape is pressed
 * @returns {Function} - The event handler function (for removal later)
 */
export const createEscapeHandler = (closeCallback) => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeCallback();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  return handleEscape;
};

/**
 * Attach escape key listener to document
 * @param {Function} closeCallback - Callback to execute when Escape is pressed
 */
export const attachEscapeListener = (closeCallback) => {
  const handler = createEscapeHandler(closeCallback);
  document.addEventListener('keydown', handler);
  return handler;
};

/**
 * Force browser reflow (for animation triggering)
 * @param {HTMLElement} element - Element to force reflow on
 * @returns {number} - The offsetHeight value (unused but required for reflow)
 */
export const forceReflow = (element) => {
  return element.offsetHeight;
};

/**
 * Setup standard popup close handlers (click, overlay, escape)
 * @param {HTMLElement} popup - The popup element
 * @param {HTMLElement} closeButton - The close button element
 * @param {Function} closeCallback - Callback to execute on close
 */
export const setupPopupCloseHandlers = (popup, closeButton, closeCallback) => {
  // Close button click
  closeButton.addEventListener('click', closeCallback);
  
  // Close on overlay click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closeCallback();
    }
  });
  
  // Close on Escape key
  attachEscapeListener(closeCallback);
};
