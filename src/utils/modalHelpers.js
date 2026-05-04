/**
 * Modal Helper Utilities
 * Common functions for creating and managing modal dialogs and popups
 */

/**
 * Create a standard popup overlay
 * @param {string} className - Optional class name for the overlay
 * @returns {HTMLElement} - Popup overlay element
 */
export const createPopupOverlay = (className = 'popup-overlay') => {
  const popup = document.createElement('div');
  popup.className = className;
  popup.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
    animation: fadeIn 0.3s ease;
  `;
  return popup;
};

/**
 * Create popup content container
 * @param {string} className - Optional class name for the content
 * @returns {HTMLElement} - Popup content element
 */
export const createPopupContent = (className = 'popup-content') => {
  const content = document.createElement('div');
  content.className = className;
  content.style.cssText = `
    background: #111111;
    border: 2px solid #99ccff;
    border-radius: 8px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 
      0 0 30px rgba(153, 204, 255, 0.3),
      0 0 60px rgba(153, 204, 255, 0.1);
    animation: popupSlideIn 0.3s ease;
    z-index: 10000;
  `;
  return content;
};

/**
 * Create modal header with title and close button
 * @param {string} titleText - Title text for the header
 * @returns {Object} - Object containing header, title, and closeButton elements
 */
export const createModalHeader = (titleText) => {
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #333333;
    background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  `;

  const title = document.createElement('h3');
  title.textContent = titleText;
  title.style.cssText = `
    margin: 0;
    color: #99ccff;
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    font-weight: bold;
  `;

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '✕';
  closeButton.style.cssText = `
    background: transparent;
    border: 1px solid #99ccff;
    color: #99ccff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    font-family: 'Space Mono', monospace;
  `;

  // Close button hover effects
  closeButton.addEventListener('mouseenter', () => {
    closeButton.style.backgroundColor = "#99ccff";
    closeButton.style.color = '#000000';
  });

  closeButton.addEventListener('mouseleave', () => {
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.color = "#99ccff";
  });

  header.appendChild(title);
  header.appendChild(closeButton);

  return { header, title, closeButton };
};

/**
 * Create an isolated modal with maximum isolation from parent transforms
 * Useful for modals that need to be completely independent
 * @returns {HTMLElement} - Isolated modal element
 */
export const createIsolatedModal = () => {
  const modal = document.createElement('div');
  
  modal.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.9) !important;
    z-index: 10000 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    backdrop-filter: blur(10px) !important;
    transform: none !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    transform-origin: 0 0 !important;
    will-change: transform !important;
    contain: layout style paint !important;
  `;
  
  // Remove inherited positioning properties
  modal.style.removeProperty('right');
  modal.style.removeProperty('bottom');
  modal.style.removeProperty('transform');
  modal.style.removeProperty('transform-origin');
  
  return modal;
};

/**
 * Force modal to be independent of any parent positioning
 * @param {HTMLElement} modal - Modal element to enforce independence on
 */
export const forceModalIndependence = (modal) => {
  // Ensure modal is in body, not nested
  if (modal.parentElement !== document.body) {
    console.log('🔄 Moving modal to document body for independence');
    document.body.appendChild(modal);
  }
  
  // Force absolute positioning that ignores parent context
  modal.style.position = 'fixed';
  modal.style.top = '0px';
  modal.style.left = '0px';
  modal.style.transform = 'none';
  modal.style.zIndex = '10000';
  
  // Remove inherited positioning
  modal.style.removeProperty('right');
  modal.style.removeProperty('bottom');
  modal.style.removeProperty('margin');
  modal.style.removeProperty('padding');
  
  // Force viewport-based positioning
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  
  console.log('🔒 Modal independence enforced');
};

/**
 * Remove existing popup by class name
 * @param {string} className - Class name of popup to remove
 */
export const removeExistingPopup = (className) => {
  const existingPopup = document.querySelector(`.${className}`);
  if (existingPopup) {
    existingPopup.remove();
  }
};
