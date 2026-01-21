import ApiService from './api';

export const cartService = {
  // 获取购物车商品
  async getCartItems() {
    return ApiService.get('/cart/');
  },

  // 添加商品到购物车
  async addToCart(productId, quantity = 1) {
    return ApiService.post('/cart/', {
      product_id: productId,
      quantity: quantity
    });
  },

  // 更新购物车商品数量
  async updateCartItem(itemId, quantity) {
    return ApiService.put(`/cart/${itemId}`, { quantity });
  },

  // 从购物车删除商品
  async removeFromCart(itemId) {
    return ApiService.delete(`/cart/${itemId}`);
  },

  // 清空购物车
  async clearCart() {
    return ApiService.delete('/cart/');
  }
};