// Application configuration
export const config = {
  // API configuration
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
  
  // Request timeout (milliseconds)
  REQUEST_TIMEOUT: 30000,
  
  // Pagination configuration
  DEFAULT_PAGE_SIZE: 20,
  
  // Upload file size limit (bytes)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Supported image formats
  SUPPORTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  
  // Application information
  APP_NAME: 'CY Pet Store',
  APP_VERSION: '1.0.0',
  
  // Development mode
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Debug mode
  IS_DEBUG: process.env.REACT_APP_DEBUG === 'true',
};