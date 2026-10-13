import React from 'react';
// Import Swiper React components and modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Keyboard, Mousewheel, Pagination } from 'swiper/modules';
import { useScrollReveal } from './useScrollReveal';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './Products.css';

function Products({ products = [], onAddToCart, onViewAll }) {
  useScrollReveal();
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
          {/* <button onClick={onViewAll} className="view-all-link">
            View All 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button> */}
        </div>

        {/* Swiper Carousel Stage */}
        <div className="carousel-stage">
          <Swiper
            modules={[EffectCoverflow, Keyboard, Mousewheel, Pagination]}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            initialSlide={1}
            keyboard={{ enabled: true }}
            mousewheel={{ forceToAxis: true }}
            pagination={{ clickable: true }}
            coverflowEffect={{
              rotate: 25,       // Angle of side cards
              stretch: 0,       // Distance between slides
              depth: 200,       // How far back side cards recede
              modifier: 1,      // Intensity
              slideShadows: true, // Depth shadows on side cards
            }}
            breakpoints={{
              320: { slidesPerView: 1.2, spaceBetween: 10 },
              768: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 30 }
            }}
            className="products-swiper"
          >
            {products.map((product, index) => (
              <SwiperSlide key={product.id} className="carousel-slide">
                <div className={`product-card reveal reveal-stagger-${(index % 4) + 1}`}>
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}

export default Products;