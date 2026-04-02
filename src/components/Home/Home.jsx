import React from 'react';
import './css/Home.css';

export default function Home({ onNavigateToLogin, onNavigateToApp }) {
  const stats = [
    { label: 'Events', value: '10K+', icon: '📅' },
    { label: 'Attendees', value: '50K+', icon: '👥' },
    { label: 'Organizers', value: '2K+', icon: '🏢' },
    { label: 'Rating', value: '4.9', icon: '⭐' }
  ];

  const features = [
    {
      title: 'Instant Booking',
      desc: 'Book your tickets instantly without any hassle using our platform.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
      bg: '#eff6ff'
    },
    {
      title: 'Secure Payments',
      desc: 'Your payments are perfectly secure with our robust gateway.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      bg: '#f0fdf4'
    },
    {
      title: 'Digital Tickets',
      desc: 'Access your tickets digitally from your device anywhere, anytime.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
      bg: '#faf5ff'
    },
    {
      title: 'Event Reminders',
      desc: 'Never miss an event with our smart notification reminders.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
      bg: '#fff7ed'
    },
    {
      title: 'Wishlist Events',
      desc: 'Save events you love and get notified when tickets are available.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
      bg: '#fdf2f8'
    },
    {
      title: 'Trending Events',
      desc: 'Discover what is popular and trending in your area easily.',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
      bg: '#eef2ff'
    }
  ];

  const popularEvents = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: 'August 20, 2024',
      location: 'Central Park, NY',
      rating: '4.9',
      price: '$150',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Tech Innovation Summit',
      date: 'August 15, 2024',
      location: 'Moscone Center',
      rating: '4.8',
      price: '$149',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'Championship Final',
      date: 'September 1, 2024',
      location: 'Main Arena',
      rating: '4.9',
      price: '$120',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      title: 'Modern Art Exhibition',
      date: 'July 25, 2024',
      location: 'Museum of Art & Design',
      rating: '4.6',
      price: '$40',
      image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      title: 'Gourmet Food Festival',
      date: 'August 10, 2024',
      location: 'City Convention Center',
      rating: '4.8',
      price: '$60',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 6,
      title: 'Business Leadership Summit',
      date: 'September 15, 2024',
      location: 'Grand Hotel',
      rating: '4.7',
      price: '$200',
      image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800'
    }
  ];

  const categories = [
    { name: 'Music', count: '12+', icon: '🎵', bg: '#eff6ff', color: '#3b82f6' },
    { name: 'Sports', count: '80+', icon: '⚽', bg: '#fff7ed', color: '#f97316' },
    { name: 'Arts', count: '45+', icon: '🎨', bg: '#faf5ff', color: '#a855f7' },
    { name: 'Food & Drink', count: '25+', icon: '🍔', bg: '#fef2f2', color: '#ef4444' },
    { name: 'Business', count: '30+', icon: '💼', bg: '#eef2ff', color: '#6366f1' },
    { name: 'Comedy', count: '15+', icon: '🎭', bg: '#fefce8', color: '#eab308' },
    { name: 'Nightlife', count: '40+', icon: '🍸', bg: '#fdf2f8', color: '#ec4899' },
    { name: 'Fitness', count: '20+', icon: '💪', bg: '#f0fdf4', color: '#22c55e' },
    { name: 'Education', count: '35+', icon: '🎓', bg: '#f0fdfa', color: '#14b8a6' }
  ];

  return (
    <div className="landing-layout">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginLeft: '8px' }}>Eventify</span>
          </div>
          <div className="landing-nav-links">
            <a href="#">Home</a>
            <a href="#">Events</a>
            <a href="#">Categories</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </div>
          <div className="landing-nav-actions">
            <a href="#" className="landing-link" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>Login</a>
            <a href="#" className="landing-link" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }}>Register</a>
            <button className="landing-btn-primary" onClick={onNavigateToApp}>Create Event</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-content">
          <h1>Discover Amazing<br/>Events Near You</h1>
          <p>Find, book, and create unforgettable experiences.<br/>We've got the perfect event for you.</p>
          
          <div className="landing-search-box">
            <div className="search-inputs">
              <div className="search-field">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input type="text" placeholder="Location" defaultValue="New York" />
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="text" placeholder="Search events..." />
              </div>
              <div className="search-divider"></div>
              <div className="search-field">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <select>
                  <option>All Categories</option>
                  <option>Music</option>
                  <option>Sports</option>
                  <option>Arts</option>
                </select>
              </div>
            </div>
            <button className="search-submit">Search Events</button>
          </div>

          <div className="landing-hero-actions">
            <button className="landing-btn-primary-inverse" onClick={onNavigateToApp}>Explore Events</button>
            <button className="landing-btn-outline-inverse">Learn More</button>
          </div>
        </div>
        
        <div className="landing-hero-graphic">
          <div className="hero-abstract-art">
            {/* A simplified CSS representation of the 3D flower graphic */}
            <div className="abstract-leaf leaf-1"></div>
            <div className="abstract-leaf leaf-2"></div>
            <div className="abstract-leaf leaf-3"></div>
            <div className="abstract-leaf leaf-4"></div>
            <div className="abstract-center"></div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="landing-stats-section">
        <div className="landing-stats-grid">
          {stats.map((stat, idx) => (
            <div key={idx} className="landing-stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="section-header">
          <h2>Why Choose Eventify?</h2>
          <p>Discover top features that make organizing and attending events easier.</p>
        </div>
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: feature.bg }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Events */}
      <section className="landing-events-section">
        <div className="section-header">
          <h2>Popular Events</h2>
          <p>Don't miss out on the most highly-rated, upcoming events.</p>
        </div>
        <div className="events-grid">
          {popularEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <button className="event-heart">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p className="event-loc">{event.location}</p>
                <div className="event-bottom">
                  <div className="event-rating">
                    <span className="star">⭐</span> {event.rating}
                  </div>
                  <div className="event-price">{event.price}</div>
                </div>
                <button className="event-btn" onClick={onNavigateToApp}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
        <div className="view-all-wrapper">
          <button className="landing-btn-outline" onClick={onNavigateToApp}>View All Events</button>
        </div>
      </section>

      {/* Categories */}
      <section className="landing-categories">
        <div className="section-header">
          <h2>Browse by Category</h2>
          <p>Find the perfect event that matches your interests.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-card">
              <div className="category-icon" style={{ backgroundColor: cat.bg }}>
                {cat.icon}
              </div>
              <h3>{cat.name}</h3>
              <p>{cat.count} events</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="landing-newsletter-section">
        <div className="newsletter-card">
          <div className="newsletter-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h2>Stay Updated with the Latest Events</h2>
          <p>Get exclusive access to upcoming events, special offers, and insider<br/>updates delivered straight to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button className="subscribe-btn">Subscribe <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="landing-logo" style={{ color: 'white', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '8px' }}>Eventify</span>
            </div>
            <p className="footer-desc">Your ultimate platform for discovering, organizing, and attending amazing events worldwide.</p>
            <div className="social-links">
              <a href="#">Fb</a>
              <a href="#">Tw</a>
              <a href="#">Ig</a>
              <a href="#">In</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#">About Us</a>
            <a href="#">How it Works</a>
            <a href="#">FAQ</a>
            <a href="#">Pricing</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>

          <div className="footer-links">
            <h4>Categories</h4>
            <a href="#">Music Festivals</a>
            <a href="#">Sports Events</a>
            <a href="#">Arts & Culture</a>
            <a href="#">Tech Conferences</a>
            <a href="#">Workshops</a>
            <a href="#">Comedy</a>
          </div>

          <div className="footer-contact">
            <h4>Contact Info</h4>
            <div className="contact-item">
              <span>📍</span>
              <p>456 Event Horizon Avenue<br/>New York, NY 10001</p>
            </div>
            <div className="contact-item">
              <span>📞</span>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <span>✉️</span>
              <p>support@eventify.com</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 Eventify. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
