import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // 从本地存储加载购物车数据
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
    }
  }, []);

  // 更新购物车数据到本地存储
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // 计算总数量和总价格
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cart]);

  // 添加商品到购物车
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // 检查商品是否已在购物车中
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // 如果商品已存在，增加数量
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // 如果商品不存在，添加新商品
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // 从购物车移除商品
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // 更新购物车中商品的数量
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // 清空购物车
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      totalItems, 
      totalPrice, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
}; 