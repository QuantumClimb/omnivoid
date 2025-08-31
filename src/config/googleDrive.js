/**
 * Google Drive Configuration for Omnivoid
 * Centralized configuration for all Google Drive content
 */

export const GOOGLE_DRIVE_CONFIG = {
  // Master folder ID
  MASTER_FOLDER_ID: '1DpzugUI6YG_wwEjTE2Vkq3fL3L4eyoss',
  
  // Base URL for Google Drive
  BASE_URL: 'https://drive.google.com/drive/folders',
  
  // Folder names in Google Drive
  FOLDERS: {
    RADIO: 'radio',        // Audio files (was audio/Music)
    RELEASES: 'releases',  // Research papers (was docs)
    GALLERY: 'gallery'     // Images (same name)
  },
  
  // Full URLs for each folder
  getFolderUrl(folderName) {
    return `${this.BASE_URL}/${this.MASTER_FOLDER_ID}?usp=sharing`;
  },
  
  // Debug logging
  debug: true,
  
  // Log function
  log(message, data = null) {
    if (this.debug) {
      console.log(`🌐 [Google Drive] ${message}`, data || '');
    }
  }
};

// Helper function to get file URL from Google Drive
export function getGoogleDriveFileUrl(folderName, fileName) {
  const config = GOOGLE_DRIVE_CONFIG;
  config.log(`Getting file URL for: ${folderName}/${fileName}`);
  
  // For now, we'll use the folder URL and let the component handle file access
  // This can be enhanced later with direct file URLs if needed
  return config.getFolderUrl(folderName);
}

// Helper function to read text files from the public folder
export async function readPublicFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const content = await response.text();
    return content;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

// Helper function to fetch text file content from Google Drive
export async function fetchGoogleDriveTextFile(fileUrl) {
  try {
    // Extract file ID from Google Drive sharing URL
    const fileIdMatch = fileUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!fileIdMatch) {
      throw new Error('Invalid Google Drive URL format');
    }
    
    const fileId = fileIdMatch[1];
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    
    GOOGLE_DRIVE_CONFIG.log(`Fetching text file content from: ${directUrl}`);
    
    const response = await fetch(directUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    GOOGLE_DRIVE_CONFIG.log(`Successfully fetched text file content, length: ${content.length}`);
    return content;
  } catch (error) {
    GOOGLE_DRIVE_CONFIG.log(`Error fetching Google Drive text file: ${error.message}`);
    return null;
  }
}

export default GOOGLE_DRIVE_CONFIG;
