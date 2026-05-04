/**
 * Debug Helper Utilities
 * Breaking down complex refreshDebugInfo into smaller, testable functions
 */

/**
 * Format audio manager debug information
 * @param {Object} audioManager - The audio manager instance
 * @returns {string} - HTML formatted debug info
 */
export const formatAudioDebugInfo = (audioManager) => {
  let debugText = '';
  
  if (audioManager) {
    debugText += `✅ Audio Manager: Available<br>`;
    debugText += `🎵 Audio Context: ${audioManager.audioContext ? 'Active' : 'Inactive'}<br>`;
    debugText += `📊 Analyzer: ${audioManager.analyser ? 'Ready' : 'Missing'}<br>`;
    debugText += `🔊 Is Playing: ${audioManager.isPlaying ? 'Yes' : 'No'}<br>`;
  } else {
    debugText += `❌ Audio Manager: Not Available<br>`;
  }
  
  return debugText;
};

/**
 * Format audio stream debug information
 * @param {Object} audioStream - The current audio stream
 * @returns {string} - HTML formatted debug info
 */
export const formatAudioStreamInfo = (audioStream) => {
  let debugText = '';
  
  if (audioStream) {
    debugText += `🎵 Audio Stream: Active<br>`;
    debugText += `🔗 Stream ID: ${audioStream.id || 'Unknown'}<br>`;
  } else {
    debugText += `❌ Audio Stream: Not Active<br>`;
  }
  
  return debugText;
};

/**
 * Test and format frequency data information
 * @param {Object} analyser - The audio analyser node
 * @returns {string} - HTML formatted debug info
 */
export const formatFrequencyDataInfo = (analyser) => {
  let debugText = '';
  
  if (analyser) {
    try {
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(dataArray);
      
      const averageFreq = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const hasData = dataArray.some(value => value > -Infinity);
      
      debugText += `📊 Frequency Data: ${hasData ? 'Yes' : 'No'}<br>`;
      debugText += `📈 Avg Frequency: ${averageFreq.toFixed(2)}<br>`;
      debugText += `🔢 Data Points: ${dataArray.length}<br>`;
    } catch (error) {
      debugText += `❌ Frequency Test: Failed (${error.message})<br>`;
    }
  }
  
  return debugText;
};

/**
 * Format Mixcloud widget debug information
 * @returns {string} - HTML formatted debug info
 */
export const formatMixcloudWidgetInfo = () => {
  let debugText = '';
  
  const mixcloudPlayer = document.getElementById('mixcloud-player');
  if (mixcloudPlayer) {
    debugText += `🎵 Mixcloud Widget: Found<br>`;
    debugText += `🔗 Widget Src: ${mixcloudPlayer.src.substring(0, 50)}...<br>`;
  } else {
    debugText += `❌ Mixcloud Widget: Not Found<br>`;
  }
  
  return debugText;
};

/**
 * Format audio proxy debug information
 * @param {Object} audioProxy - The audio proxy instance
 * @param {Object} audioManager - The audio manager instance
 * @returns {string} - HTML formatted debug info
 */
export const formatAudioProxyInfo = (audioProxy, audioManager) => {
  let debugText = '';
  
  debugText += `🎵 Audio Proxy: ${audioProxy.isActive ? 'Active' : 'Not Active'}<br>`;
  debugText += `🎵 Proxy Context: ${audioProxy.audioContext ? 'Active' : 'Not Available'}<br>`;
  debugText += `🎵 Proxy Analyser: ${audioProxy.analyser ? 'Active' : 'Not Available'}<br>`;
  debugText += `🎵 Proxy Audio: ${audioProxy.audioElement ? 'Loaded' : 'Not Loaded'}<br>`;
  debugText += `🎵 Audio Source: ${audioProxy.source ? 'Connected' : 'Not Connected'}<br>`;
  debugText += `🎵 Iframe Source: ${audioProxy.iframeSource ? 'Connected' : 'Not Connected'}<br>`;
  debugText += `🎵 Test Oscillator: ${audioProxy.testOscillator ? 'Active' : 'Not Active'}<br>`;
  debugText += `🎵 Main Analyser: ${audioManager?.analyser ? 'Available' : 'Not Available'}<br>`;
  
  return debugText;
};

/**
 * Format Mixcloud events debug information
 * @param {boolean} mixcloudEventsReceived - Whether Mixcloud events have been received
 * @returns {string} - HTML formatted debug info
 */
export const formatMixcloudEventsInfo = (mixcloudEventsReceived) => {
  let debugText = '';
  
  debugText += `🎵 Mixcloud Events: ${mixcloudEventsReceived ? 'Received' : 'Not Received'}<br>`;
  debugText += `🎵 Widget Status: ${mixcloudEventsReceived ? 'Working' : 'May have issues'}<br>`;
  
  return debugText;
};

/**
 * Format browser capabilities debug information
 * @returns {string} - HTML formatted debug info
 */
export const formatBrowserCapabilitiesInfo = () => {
  let debugText = '';
  
  debugText += `🎵 Web Audio API: ${globalThis.AudioContext ? 'Supported' : 'Not Supported'}<br>`;
  debugText += `🎵 Mixcloud Only: No microphone access<br>`;
  
  return debugText;
};

/**
 * Compose all debug information sections
 * @param {Object} context - Context object containing all necessary data
 * @returns {string} - Complete HTML formatted debug info
 */
export const composeDebugInfo = (context) => {
  let debugText = '';
  
  // Audio Manager Status
  debugText += formatAudioDebugInfo(context.audioManager);
  
  // Audio Stream Status
  debugText += formatAudioStreamInfo(context.currentAudioStream);
  
  // Frequency Data Test
  if (context.audioManager?.analyser) {
    debugText += formatFrequencyDataInfo(context.audioManager.analyser);
  }
  
  // Mixcloud Widget Status
  debugText += formatMixcloudWidgetInfo();
  
  // Audio Proxy Status
  debugText += formatAudioProxyInfo(context.audioProxy, context.audioManager);
  
  // Mixcloud Events Status
  debugText += formatMixcloudEventsInfo(context.mixcloudEventsReceived);
  
  // Browser Capabilities
  debugText += formatBrowserCapabilitiesInfo();
  
  return debugText;
};
