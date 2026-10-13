import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  EffectCoverflow,
  Keyboard,
  Mousewheel,
  Pagination,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import './ComboDeals.css';

import duobottles from './assets/duobottles.JPG';
import skybottles from './assets/skybottles.JPG';
import boxof5 from './assets/boxof5.png';
import minipack from './assets/minipack.jpg';
import partypack from './assets/partypack.jpg';
import oyinbusola from './assets/oyinbusola.jpg';

function ComboDeals({ onSelectDeal }) {
  const comboDeals = [
    {
      id: 'combo-duo',
      category: 'SIGNATURE COMBO',
      title: 'The Duo',
      description:
        'Two refreshing juice flavors. Double the goodness, your way.',
      discount: '5% OFF',
      priceText: 'Perfect for two',
      price: '₦4,750',
      image: duobottles,
      highlight: false,
      isBundle: true,
    },
    {
      id: 'combo-trio',
      category: 'SIGNATURE COMBO',
      title: 'The Trio',
      description:
        'Three flavors to keep your week colorful, fresh, and fruity.',
      discount: '10% OFF',
      priceText: 'Our most-loved combo',
      price: '₦6,750',
      image: skybottles,
      highlight: true,
      isBundle: true,
    },
    {
      id: 'combo-pomona-box',
      category: 'SIGNATURE COMBO',
      title: 'The Pomona Box',
      description:
        'Five juice flavors plus one creamy smoothie. The full experience.',
      discount: '10% OFF',
      priceText: 'The ultimate variety',
      price: '₦14,100',
      image: boxof5,
      highlight: false,
      isBundle: true,
    },
  ];

  const eventDeals = [
    {
      id: 'event-mini-pack',
      category: 'EVENT & BULK',
      title: 'Mini Pack',
      description:
        'A little something extra for intimate hangouts and small gatherings.',
      bottles: '20 Bottles',
      price: '₦46,000',
      image: minipack,
      highlight: false,
      isBundle: true,
    },
    {
      id: 'event-party-pack',
      category: 'EVENT & BULK',
      title: 'Party Pack',
      description:
        'Keep the good vibes flowing at birthdays, parties, and celebrations.',
      bottles: '50 Bottles',
      price: '₦120,000',
      image: partypack,
      highlight: true,
      isBundle: true,
    },
    {
      id: 'event-pomona-for-all',
      category: 'EVENT & BULK',
      title: 'Pomona For All',
      description:
        'A refreshing experience for weddings, corporate events, and big crowds.',
      bottles: '100 Bottles',
      price: '₦245,000',
      image: oyinbusola,
      highlight: false,
      isBundle: true,
    },
  ];

  const handleSelectDeal = (deal) => {
    const cartProduct = {
      id: deal.id,
      name: deal.title,
      description: deal.bottles || deal.discount,
      price: deal.price,
      image: deal.image,
      isBundle: deal.isBundle,
    };

    if (onSelectDeal) {
      onSelectDeal(cartProduct);
    } else {
      console.log('Selected deal:', cartProduct);
    }
  };

  const renderDealCard = (deal, index, isEvent = false) => (
    <article
      className={`deal-card reveal reveal-stagger-${(index % 3) + 1} ${
        deal.highlight ? 'featured' : ''
      }`}
      key={deal.id}
    >
      {deal.highlight && (
        <span className="featured-badge">
          {isEvent ? 'Party Favorite' : 'Fan Favorite'}
        </span>
      )}

      <div className="deal-image-wrap">
        <img
          src={deal.image}
          alt={deal.title}
          className="deal-image"
          loading="lazy"
        />

        {!isEvent && (
          <span className="discount-tag">{deal.discount}</span>
        )}

        {isEvent && (
          <span className="bottles-tag">{deal.bottles}</span>
        )}
      </div>

      <div className="deal-card-content">
        <span
          className={`category-tag ${
            isEvent ? 'event-category' : ''
          }`}
        >
          {deal.category}
        </span>

        <h4>{deal.title}</h4>

        <p className="deal-description">{deal.description}</p>

        <div className="deal-footer">
          <div className="deal-value">
            {isEvent ? (
              <>
                <span className="deal-price-amount">
                  {deal.price}
                </span>

                <span className="deal-value-caption">
                  Per pack
                </span>
              </>
            ) : (
              <>
                <span className="deal-pricing">
                  {deal.priceText}
                </span>

                <span className="deal-value-caption">
                  More value in every order
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            className={`deal-action-btn ${
              isEvent ? 'event-btn' : ''
            }`}
            onClick={() => handleSelectDeal(deal)}
            aria-label={`${isEvent ? 'Order' : 'Choose'} ${deal.title}`}
          >
            {isEvent ? 'Order Pack' : 'Choose Combo'}
          </button>
        </div>
      </div>
    </article>
  );

  const renderDealsSwiper = (deals, isEvent = false) => (
    <Swiper
      className={`combos-swiper ${
        isEvent ? 'event-swiper' : 'signature-swiper'
      }`}
      modules={[EffectCoverflow, Keyboard, Mousewheel, Pagination]}
      effect="coverflow"
      grabCursor={true}
      centeredSlides={true}
      slidesPerView="auto"
      initialSlide={1}
      keyboard={{
        enabled: true,
      }}
      mousewheel={{
        forceToAxis: true,
        releaseOnEdges: true,
      }}
      pagination={{
        clickable: true,
        dynamicBullets: true,
      }}
      coverflowEffect={{
        rotate: 25,
        stretch: 0,
        depth: 200,
        modifier: 1,
        slideShadows: false,
      }}
      breakpoints={{
        320: {
          slidesPerView: 1.2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2.2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      }}
    >
      {deals.map((deal, index) => (
        <SwiperSlide key={deal.id}>
          {renderDealCard(deal, index, isEvent)}
        </SwiperSlide>
      ))}
    </Swiper>
  );

  return (
    <section className="combos-section" id="deals">
      <div className="combos-container">
        <header className="combos-header">
          <h2 className="reveal">
            Grab a bottle of Pomona ...
            <span>Or maybe some more</span>
          </h2>

          <p className="reveal">
            Your favorite flavors, thoughtfully bundled. Whether it’s a little
            treat for yourself or refreshments for a crowd, there’s a Pomona
            deal for you.
          </p>
        </header>

        <div className="deals-category-heading">
          <div className="reveal">
            <h3>Signature Combos</h3>
          </div>

          <span className="category-side-note reveal">
            Your favorites, together.
          </span>
        </div>

        {renderDealsSwiper(comboDeals)}

        <div className="deals-category-heading event-heading">
          <div className="reveal">
            <span className="category-eyebrow">
              GOOD TIMES, GREAT COMPANY
            </span>

            <h3>Event &amp; Bulk Packs</h3>
          </div>

          <span className="category-side-note reveal">
            Made to share.
          </span>
        </div>

        {renderDealsSwiper(eventDeals, true)}

        <div className="combos-bottom-note reveal">
          <p>Send us a mail or a WhatsApp DM for bulk orders.</p>
        </div>
      </div>
    </section>
  );
}

export default ComboDeals;