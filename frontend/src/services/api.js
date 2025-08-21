import { config } from '../config/config';
import { handleNetworkError, logError } from '../utils/errorHandler';

const API_BASE_URL = config.API_BASE_URL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const requestConfig = {
      headers: {
        // 只有非文件上传时才设置Content-Type
        ...(options.isFileUpload ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    };

    // 添加认证token
    const token = localStorage.getItem('auth_token');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);
      
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText };
        }
        
        const networkError = handleNetworkError({
          response: {
            status: response.status,
            data: errorData,
          }
        });
        
        logError(networkError, { url, options });
        throw networkError;
      }
      
      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('请求超时，请稍后再试');
        logError(timeoutError, { url, options });
        throw timeoutError;
      }
      
      if (error.name === 'AppError') {
        throw error;
      }
      
      const networkError = handleNetworkError(error);
      logError(networkError, { url, options });
      throw networkError;
    }
  }

  // GET 请求
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST 请求
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT 请求
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE 请求
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // 表单数据请求（用于登录）
  async postForm(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });
  }

  // 文件上传请求
  async uploadFile(endpoint, file) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request(endpoint, {
      method: 'POST',
      headers: {
        // 不设置 Content-Type，让浏览器自动设置 multipart/form-data
        // Authorization会在request方法中自动添加
      },
      body: formData,
      isFileUpload: true
    });
  }
}

const apiService = new ApiService();
export default apiService;