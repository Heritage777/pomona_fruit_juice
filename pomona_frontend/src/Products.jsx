import React from 'react';
import './Products.css';

function Products({ products = [], onAddToCart, onViewAll }) {
  return (
    <section className="our-juices-section" id="shop">
      <div className="our-juices-container">
        
        {/* Section Header */}
        <div className="section-header-wrap reveal">
          <div className="section-header-left">
            <div className="header-accent-line"></div>
            <h2 className="section-title">Our Juices</h2>
            <p className="section-subtitle">
              A range of refreshing flavours, crafted with real fruits and nothing artificial.
            </p>
          </div>
          <button onClick={onViewAll} className="view-all-link">
            View All 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {products.map((product) => (
            <div className={`product-card reveal reveal-stagger-${product.id}`} key={product.id}>
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-img" />
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                
                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <button 
                    className="add-to-cart-btn" 
                    onClick={() => onAddToCart && onAddToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Products;