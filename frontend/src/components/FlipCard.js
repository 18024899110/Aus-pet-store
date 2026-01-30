import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import ProductImage from './ProductImage';
import './FlipCard.css';

const FlipCard = ({ product, isFlipped, onAddToCart }) => {
  return (
    <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
      <div className="flip-card-inner">
        {/* 正面 */}
        <div className="flip-card-front">
          <Card className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
              <ProductImage
                src={product.image_url || product.image}
                alt={product.name}
                className="product-image"
                containerClass="product-image-wrapper"
              />
            </Link>
            <Card.Body>
              <div className="product-category">
                {product.category?.name || product.category}
              </div>
              <Link to={`/product/${product.id}`} className="product-link">
                <Card.Title>{product.name}</Card.Title>
              </Link>
              {product.rating && (
                <div className="product-rating">
                  {'★'.repeat(Math.floor(product.rating))}
                  {'☆'.repeat(5 - Math.floor(product.rating))}
                  <span className="rating-number">{product.rating}</span>
                </div>
              )}
              <div className="product-price">
                ${product.price ? product.price.toFixed(2) : '0.00'}
              </div>
              <div className="product-buttons">
                <Link to={`/product/${product.id}`}>
                  <Button variant="light" size="sm">View Details</Button>
                </Link>
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => onAddToCart(product)}
                >
                  <FaShoppingCart />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* 背面 */}
        <div className="flip-card-back">
          <div className="success-checkmark">
            <svg viewBox="0 0 52 52" className="checkmark">
              <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
              <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
