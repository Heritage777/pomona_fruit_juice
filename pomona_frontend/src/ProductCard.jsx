import React from 'react';
import './ProductCard.css';

function ProductCard({ name, description, price, image, onAddToCart }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={image} alt={name} className="product-img" />
      </div>

      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-desc">{description}</p>
        
        <div className="product-footer">
          <span className="product-price">{price}</span>
          <button 
            className="add-to-cart-btn" 
            onClick={onAddToCart}
            aria-label={`Add ${name} to cart`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;