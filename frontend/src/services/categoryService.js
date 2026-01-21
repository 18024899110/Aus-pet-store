import ApiService from './api';

export const categoryService = {
  // 获取所有分类
  async getCategories() {
    return ApiService.get('/categories/');
  },

  // 获取单个分类
  async getCategory(categoryId) {
    return ApiService.get(`/categories/${categoryId}`);
  },

  // 创建分类（管理员）
  async createCategory(categoryData) {
    return ApiService.post('/categories/', categoryData);
  },

  // 更新分类（管理员）
  async updateCategory(categoryId, categoryData) {
    return ApiService.put(`/categories/${categoryId}`, categoryData);
  },

  // 删除分类（管理员）
  async deleteCategory(categoryId) {
    return ApiService.delete(`/categories/${categoryId}`);
  }
};