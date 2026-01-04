import ApiService from './api';

export const authService = {
  // 用户登录
  async login(credentials) {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email); // FastAPI OAuth2PasswordRequestForm 使用 username 字段
    formData.append('password', credentials.password);

    const response = await ApiService.postForm('/auth/login/', formData);

    // 保存token到localStorage (使用一致的key)
    if (response.access_token) {
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('token_type', response.token_type);
    }

    return response;
  },

  // 用户注册
  async register(userData) {
    return ApiService.post('/auth/register/', userData);
  },

  // 获取当前用户信息
  async getCurrentUser() {
    return ApiService.get('/users/me/');
  },

  // 获取用户档案 (别名方法)
  async getProfile() {
    return this.getCurrentUser();
  },

  // 用户登出
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  },

  // 检查是否已登录
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  // 获取token
  getToken() {
    return localStorage.getItem('auth_token');
  }
};