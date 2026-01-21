import ApiService from './api';

export const orderService = {
  // 创建订单
  async createOrder(orderData) {
    return ApiService.post('/orders/', orderData);
  },

  // 获取用户订单列表
  async getUserOrders() {
    return ApiService.get('/orders/');
  },

  // 获取单个订单详情
  async getOrder(orderId) {
    return ApiService.get(`/orders/${orderId}`);
  },

  // 取消订单
  async cancelOrder(orderId) {
    return ApiService.put(`/orders/${orderId}/status`, { status: 'cancelled' });
  },

  // 更新订单状态（管理员）
  async updateOrderStatus(orderId, status) {
    return ApiService.put(`/orders/${orderId}/status`, { status });
  },

  // 获取所有订单（管理员）
  async getAllOrders(params = {}) {
    return ApiService.get('/orders/', params);
  }
};