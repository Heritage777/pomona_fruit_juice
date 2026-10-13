
import React, { useState, useEffect } from 'react';
import { useScrollReveal } from './useScrollReveal';
import Navbar from './Navbar';
import Hero from './Hero';
import Products from './Products';
import WhyChooseUs from './WhyChooseUs';
import HeroBanner from './HeroBanner';
import Testimonials from './Testimonials';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import AdminDashboard from './AdminDashboard';
import Newsletter from './Newsletter';
import Stats from './Stats';
import ComboDeals from './ComboDeals';
import AboutDrawer from './AboutDrawer';
import ContactDrawer from './ContactDrawer';

// Assets
import watermelon from './assets/watermelon.jpg';
import pineappleAndCarrot from './assets/carrot.jpg';
import cucumberAndTangerine from './assets/cucumber.jpg';
import smoothie from './assets/smoothie.jpg';
import customer1 from './assets/customer1.jpg';
import customer2 from './assets/customer2.jpg';
import customer3 from './assets/customer3.jpg';

const juiceData = [
  {
    id: 1,
    name: 'Refreshing Red',
    description: 'Watermelon & Beetroot',
    price: '₦2,500',
    image: watermelon,
  },
  {
    id: 2,
    name: 'Tropical Blend',
    description: 'Carrot & Pineapple',
    price: '₦2,500',
    image: pineappleAndCarrot,
  },
  {
    id: 3,
    name: 'Tangy Blend',
    description: 'Cucumber & Tangerine',
    price: '₦2,500',
    image: cucumberAndTangerine,
  },
  {
    id: 4,
    name: 'Liquid Bliss',
    description: 'Banana & Pineapple',
    price: '₦3,200',
    image: smoothie,
  },
];

const whyChooseData = [
  {
    title: 'Real Ingredients',
    description:
      'Made from 100% natural fruits, no artificial flavours or preservatives.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.4 19 2c1 2 1.5 3.5.4 9.2A7 7 0 0 1 11 20z"></path>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.5 12 17 12 19"></path>
      </svg>
    ),
  },
  {
    title: 'Great Taste',
    description: 'Naturally sweet, always refreshing.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    ),
  },
  {
    title: 'Health Focused',
    description: 'Packed with vitamins, minerals and goodness for your body.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    ),
  },
  {
    title: 'Convenient',
    description: 'Order easily online and get it delivered to your doorstep.',
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
];

const customerReviews = [
  {
    quote:
      "Pomona Tangy Blend is that GIRL!!! Especially after morning exercise when your throat is begging for something cold and refreshing.",
    name: 'Mide',
    image: customer1,
  },
  {
    quote:
      "A great way to kick off the day. The liquid bliss is more viscous compared to the others. The refreshing red is the sweetest and the tropical blend gives that natural taste.",
    name: 'Razaq',
    image: customer2,
  },
  {
    quote:
      'Tangy blend is my favorite.',
    name: 'Qudus',
    image: customer3,
  },
];

function App() {
  useScrollReveal();

  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // About drawer state
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const openAbout = () => setIsAboutOpen(true);
  const closeAbout = () => setIsAboutOpen(false);

  const [isContactOpen, setIsContactOpen] = useState(false);

const openContact = () => setIsContactOpen(true);
const closeContact = () => setIsContactOpen(false);

  // Admin view state (listens to #admin in URL)
  const [isAdminView, setIsAdminView] = useState(
    window.location.hash === '#admin'
  );

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminView(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Dark mode state management (persisted in localStorage)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('pomona_theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('pomona_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('pomona_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Add product to cart handler
  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  // Update quantity handler (+ / -)
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item handler
  const handleRemoveItem = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    );
  };

  // Total cart count for Navbar badge
  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Render Admin Dashboard when URL hash is #admin
  if (isAdminView) {
    return <AdminDashboard />;
  }

  return (
    <main>
<Navbar 
  cartCount={totalCartCount} 
  onOpenCart={() => setIsCartOpen(true)}
  isDarkMode={isDarkMode}
  onToggleTheme={handleToggleTheme}
  onAboutClick={openAbout}
  onContactClick={openContact}
/>

      <Hero />

      <Products
        products={juiceData}
        onAddToCart={handleAddToCart}
        onViewAll={() => alert('Navigating to all products')}
      />
<ComboDeals onSelectDeal={handleAddToCart} />

      <WhyChooseUs
        title="Why Choose Pomona?"
        features={whyChooseData}
      />

      <Stats />



      <Testimonials
        title="What Our Customers Say"
        reviews={customerReviews}
        />
        <HeroBanner onShopNow={() => setIsCartOpen(true)} />

      <Newsletter />

      <Footer onAboutClick={openAbout} onContactClick={openContact} />

      {/* Slide-out Cart & Order Ticket Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />

      {/* About Drawer */}
      <AboutDrawer
        isOpen={isAboutOpen}
        onClose={closeAbout}
      />

      <ContactDrawer
  isOpen={isContactOpen}
  onClose={closeContact}
/>
    </main>
  );
}

export default App;
