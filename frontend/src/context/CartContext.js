import React, { createContext, useState, useEffect } from 'react';
import { cartService, authService } from '../services';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load cart data
  useEffect(() => {
    loadCartData();
  }, []);
  
  const loadCartData = async () => {
    try {
      if (authService.isAuthenticated()) {
        // If user is logged in, get cart data from server
        const serverCart = await cartService.getCartItems();
        const formattedCart = serverCart.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image_url || item.product.image,
          quantity: item.quantity,
          cartItemId: item.id,
          product: item.product
        }));
        setCart(formattedCart);
      } else {
        // If user is not logged in, get from local storage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Failed to load cart data:', error);
      // If server request fails, fallback to local storage
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      }
    }
  };

  // Update cart data
  useEffect(() => {
    // Always update local storage (as backup)
    if (!authService.isAuthenticated()) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Calculate total quantity and price
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
  }, [cart]);

  // Add product to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      
      if (authService.isAuthenticated()) {
        // If user is logged in, call server API
        await cartService.addToCart(product.id, quantity);
        // Reload cart data
        await loadCartData();
      } else {
        // If user is not logged in, update local state
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.id === product.id);
          
          if (existingItem) {
            return prevCart.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            );
          } else {
            return [...prevCart, { ...product, quantity }];
          }
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // If server request fails, fallback to local update
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === product.id);
        
        if (existingItem) {
          return prevCart.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        } else {
          return [...prevCart, { ...product, quantity }];
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // 从购物车移除商品
  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      
      if (authService.isAuthenticated()) {
        // 找到对应的购物车项ID
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem && cartItem.cartItemId) {
          await cartService.removeFromCart(cartItem.cartItemId);
        }
        await loadCartData();
      } else {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('从购物车移除商品失败:', error);
      // If server request fails, fallback to local update
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } finally {
      setLoading(false);
    }
  };

  // 更新购物车中商品的数量
  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      setLoading(true);
      
      if (authService.isAuthenticated()) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem && cartItem.cartItemId) {
          await cartService.updateCartItem(cartItem.cartItemId, quantity);
        }
        await loadCartData();
      } else {
        setCart(prevCart => 
          prevCart.map(item => 
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('更新购物车商品数量失败:', error);
      // If server request fails, fallback to local update
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === productId ? { ...item, quantity } : item
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // 清空购物车
  const clearCart = async () => {
    try {
      setLoading(true);
      
      if (authService.isAuthenticated()) {
        await cartService.clearCart();
      }
      
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('清空购物车失败:', error);
      // 即使服务器请求失败，也清空本地购物车
      setCart([]);
      localStorage.removeItem('cart');
    } finally {
      setLoading(false);
    }
  };
  
  // 从服务器刷新购物车数据
  const refreshCartFromServer = async () => {
    if (authService.isAuthenticated()) {
      await loadCartData();
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      totalItems, 
      totalPrice, 
      loading,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      refreshCartFromServer
    }}>
      {children}
    </CartContext.Provider>
  );
}; 