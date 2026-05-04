/**
 * Mixcloud Helper Utilities
 * Functions for managing Mixcloud iframe player and navigation
 */

/**
 * Convert Mixcloud URL to feed path for widget iframe
 * @param {string} mixcloudUrl - Full Mixcloud URL
 * @returns {string} - Feed path for iframe src
 */
export const convertToFeedPath = (mixcloudUrl) => {
  return mixcloudUrl
    .replace('https://www.mixcloud.com', '')
    .replaceAll('/', '%2F');
};

/**
 * Create Mixcloud iframe element
 * @param {string} feedPath - Feed path for the show
 * @returns {HTMLIFrameElement} - Configured iframe element
 */
export const createMixcloudIframe = (feedPath) => {
  const iframe = document.createElement('iframe');
  iframe.width = '100%';
  iframe.height = '120';
  iframe.src = `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=${feedPath}`;
  iframe.allow = 'encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share;';
  iframe.style.border = 'none';
  return iframe;
};

/**
 * Load a specific Mixcloud track into container
 * @param {HTMLElement} container - Container element for the player
 * @param {Object} show - Show object with url and name
 * @param {number} index - Current track index
 * @param {number} totalShows - Total number of shows
 * @param {HTMLElement} trackInfoElement - Optional element to display track info
 */
export const loadMixcloudTrack = (container, show, index, totalShows, trackInfoElement = null) => {
  if (!container) {
    console.warn('⚠️ Player container not found');
    return;
  }
  
  const feedPath = convertToFeedPath(show.url);
  const iframe = createMixcloudIframe(feedPath);
  
  // Clear container and add new iframe
  container.innerHTML = '';
  container.appendChild(iframe);
  
  // Update track info if element provided
  if (trackInfoElement) {
    trackInfoElement.textContent = `${index + 1} of ${totalShows} - ${show.name}`;
  }
  
  console.log(`🎵 Loaded track ${index + 1}: ${show.name}`);
};

/**
 * Navigate to next or previous track (with looping)
 * @param {number} currentIndex - Current track index
 * @param {number} direction - Direction to navigate (1 for next, -1 for previous)
 * @param {number} totalShows - Total number of shows
 * @returns {number} - New track index
 */
export const navigateTrack = (currentIndex, direction, totalShows) => {
  let newIndex = currentIndex + direction;
  
  // Loop around
  if (newIndex < 0) {
    newIndex = totalShows - 1;
  } else if (newIndex >= totalShows) {
    newIndex = 0;
  }
  
  return newIndex;
};

/**
 * Setup Mixcloud widget message listener
 * @param {Function} onMessage - Callback for handling Mixcloud messages
 * @returns {Function} - Event listener function (for removal later)
 */
export const setupMixcloudMessageListener = (onMessage) => {
  const listener = (event) => {
    // Only accept messages from Mixcloud
    if (event.origin !== 'https://www.mixcloud.com') {
      return;
    }
    
    console.log('📨 Message from Mixcloud widget:', event.data);
    onMessage?.(event.data);
  };
  
  globalThis.addEventListener('message', listener);
  return listener;
};

/**
 * Send message to Mixcloud iframe
 * @param {HTMLIFrameElement} iframe - Mixcloud iframe element
 * @param {Object} message - Message object to send
 */
export const sendMixcloudMessage = (iframe, message) => {
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(message, 'https://www.mixcloud.com');
  }
};
