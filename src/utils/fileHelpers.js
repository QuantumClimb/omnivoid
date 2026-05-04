/**
 * File Helper Utilities
 * Common functions for loading and parsing files
 */

/**
 * Generate gallery image filenames
 * @param {number} start - Start index
 * @param {number} end - End index
 * @param {string} prefix - Filename prefix (default: 'IMG')
 * @param {string} extension - File extension (default: '.png')
 * @returns {Array<string>} - Array of generated filenames
 */
export const generateImageFilenames = (start, end, prefix = 'IMG', extension = '.png') => {
  const filenames = [];
  for (let i = start; i <= end; i++) {
    const imageNumber = i.toString().padStart(3, '0');
    filenames.push(`${prefix}${imageNumber}${extension}`);
  }
  return filenames;
};

/**
 * Parse YouTube URLs from text content
 * @param {string} content - Text content containing YouTube URLs
 * @returns {Array<string>} - Array of YouTube URLs
 */
export const parseYouTubeUrls = (content) => {
  const lines = content.split('\n');
  const youtubeUrls = [];
  const youtubePattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  
  for (const line of lines) {
    const match = line.match(youtubePattern);
    if (match) {
      const videoId = match[1];
      youtubeUrls.push(`https://www.youtube.com/watch?v=${videoId}`);
    }
  }
  
  return youtubeUrls;
};

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export const extractYouTubeVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Sort videos by publication date
 * @param {Array<Object>} videos - Array of video objects with publishedAt property
 * @param {string} order - Sort order ('newest' or 'oldest')
 * @returns {Array<Object>} - Sorted array
 */
export const sortVideosByDate = (videos, order = 'newest') => {
  return videos.sort((a, b) => {
    const dateA = new Date(a.publishedAt);
    const dateB = new Date(b.publishedAt);
    return order === 'newest' ? dateB - dateA : dateA - dateB;
  });
};

/**
 * Parse text file content into lines, filtering empty lines
 * @param {string} content - Text content
 * @returns {Array<string>} - Array of non-empty lines
 */
export const parseTextFileLines = (content) => {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
};

/**
 * Add cache-busting query parameter to URL
 * @param {string} url - URL to modify
 * @returns {string} - URL with cache-busting parameter
 */
export const addCacheBuster = (url) => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Load and parse a public text file
 * @param {string} path - Path to the file
 * @param {Function} readFunction - Function to read the file (e.g., readPublicFile)
 * @param {boolean} cacheBust - Whether to add cache-busting parameter
 * @returns {Promise<Array<string>>} - Array of parsed lines
 */
export const loadPublicTextFile = async (path, readFunction, cacheBust = true) => {
  const url = cacheBust ? addCacheBuster(path) : path;
  const content = await readFunction(url);
  return parseTextFileLines(content);
};

/**
 * Create image thumbnail HTML
 * @param {string} filename - Image filename
 * @param {string} folder - Folder path
 * @param {string} description - Image description
 * @param {Function} onClickCallback - Callback function name as string
 * @returns {string} - HTML string
 */
export const createThumbnailHTML = (filename, folder, description, onClickCallback) => {
  const escapedDescription = description.replaceAll("'", String.raw`\'`);
  
  return `
    <div class="gallery-thumbnail" 
         style="
           border: 1px solid #333333;
           padding: 2px;
           background: #1a1a1a;
           cursor: pointer;
           transition: all 0.2s;
           position: relative;
           overflow: hidden;
           display: flex;
           align-items: center;
           justify-content: center;
           min-height: 80px;
         "
         onmouseover="this.style.border='2px solid #99ccff'; this.style.padding='1px';"
         onmouseout="this.style.border='1px solid #333333'; this.style.padding='2px';"
         onclick="${onClickCallback}('${filename}', '${escapedDescription}')"
         title="Click to view full image">
      <img src="${folder}/${filename}" 
           alt="${filename}"
           style="
             max-width: 100%;
             max-height: 100%;
             width: auto;
             height: auto;
             object-fit: contain;
             display: block;
           "
           onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'padding: 20px; text-align: center; font-size: 8px; color: #99ccff;\\'>Image not found</div>'">
    </div>
  `;
};
