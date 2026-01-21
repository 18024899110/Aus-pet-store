import ApiService from './api';

export const productService = {
  // 获取产品列表
  async getProducts(params = {}) {
    const queryParams = {};
    
    if (params.category_id) {
      queryParams.category_id = params.category_id;
    }
    if (params.search) {
      queryParams.search = params.search;
    }
    if (params.min_price !== undefined) {
      queryParams.min_price = params.min_price;
    }
    if (params.max_price !== undefined) {
      queryParams.max_price = params.max_price;
    }
    if (params.skip !== undefined) {
      queryParams.skip = params.skip;
    }
    if (params.limit !== undefined) {
      queryParams.limit = params.limit;
    }

    return ApiService.get('/products/', queryParams);
  },

  // 获取单个产品详情
  async getProduct(productId) {
    return ApiService.get(`/products/${productId}`);
  },

  // 创建产品（管理员）
  async createProduct(productData) {
    return ApiService.post('/products/', productData);
  },

  // 更新产品（管理员）
  async updateProduct(productId, productData) {
    return ApiService.put(`/products/${productId}`, productData);
  },

  // 删除产品（管理员）
  async deleteProduct(productId) {
    return ApiService.delete(`/products/${productId}`);
  }
};