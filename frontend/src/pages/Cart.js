import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useContext(CartContext);

  if (cart.length === 0) {
    return (
      <Container className="cart-page">
        <Row>
          <Col>
            <div className="empty-cart">
              <h2>Your cart is empty</h2>
              <p>You haven't added any items to your cart yet</p>
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="cart-page">
      <Row>
        <Col>
          <h2 className="page-title">Shopping Cart</h2>
          
          <Card>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="product-info">
                          <div className="product-image-container">
                            <img 
                              src={item.image_url || item.image || '/images/placeholder.svg'} 
                              alt={item.name}
                              className="product-image"
                            />
                          </div>
                          <div className="product-details">
                            <h6>{item.name}</h6>
                            <p className="text-muted">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td>${item.price}</td>
                      <td>
                        <div className="quantity-controls">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span className="quantity">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Row className="mt-4">
            <Col md={8}>
              <Link to="/products" className="btn btn-outline-primary">
                Continue Shopping
              </Link>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h5>Order Summary</h5>
                  <div className="total-section">
                    <div className="d-flex justify-content-between">
                      <span>Subtotal:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Shipping:</span>
                      <span>Free</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between total">
                      <strong>Total: ${totalPrice.toFixed(2)}</strong>
                    </div>
                  </div>
                  <Link to="/checkout" className="btn btn-primary w-100 mt-3">
                    Proceed to Checkout
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;