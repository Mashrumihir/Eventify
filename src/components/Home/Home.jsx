import { useEffect, useState } from "react";
import Container from "../layout/Container";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import PopularEvents from "./PopularEvents";
import Categories from "./Categories";
import Newsletter from "./Newsletter";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import "./Home.css";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "events", label: "Events" },
  { id: "categories", label: "Categories" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const Home = ({ onNavigateToLogin, onNavigateToRegister, onNavigateToApp, onNavigateToContact, onNavigateToAbout, onNavigateToPartnerEvents, onNavigateToFaq, onNavigateToPricing, onNavigateToPrivacyPolicy, onNavigateToTermsOfService }) => {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target?.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.2, 0.4, 0.65],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Container className="landing-shell landing-header__inner">
          <a href="#home" className="landing-brand" aria-label="Eventify home">
            <span className="landing-brand__mark">★</span>
            <span className="landing-brand__text">Eventify</span>
          </a>

          <nav className="landing-nav" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`landing-nav-link ${activeSection === item.id ? "is-active" : ""}`}
                onClick={() => {
                  if (item.id === "about") {
                    setActiveSection(item.id);
                    onNavigateToAbout?.();
                    return;
                  }

                  if (item.id === "contact") {
                    setActiveSection(item.id);
                    onNavigateToContact?.();
                    return;
                  }

                  scrollToSection(item.id);
                }}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="landing-actions">
            <button type="button" onClick={onNavigateToLogin} className="action-btn action-btn--ghost">
              Login
            </button>
            <button type="button" onClick={onNavigateToRegister} className="action-btn action-btn--soft">
              Register
            </button>
            <button type="button" onClick={onNavigateToApp} className="action-btn action-btn--primary">
              Get Started
            </button>
          </div>
        </Container>
      </header>

      <main>
        <section id="home">
          <Hero
            onNavigateToApp={onNavigateToApp}
          />
        </section>

        <section className="stats-strip">
          <Container className="landing-shell">
            <Stats />
          </Container>
        </section>

        <section id="about">
          <Features />
        </section>

        <section id="events">
          <PopularEvents />
        </section>

        <section id="categories">
          <Categories />
        </section>

        <section>
          <Newsletter />
        </section>

        <footer id="contact" className="landing-footer">
          <Container className="landing-shell landing-footer__grid">
            <div>
              <div className="landing-footer__brand">
                <span className="landing-footer__brand-mark">{"\u2605"}</span>
                <span>Eventify</span>
              </div>
              <p className="landing-footer__copy">
                Discover amazing events happening around you.
                <br />
                From concerts to conferences, we've got you covered.
              </p>
              <div className="landing-footer__socials">
                <a href="#contact" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#contact" aria-label="X"><FaXTwitter /></a>
                <a href="#contact" aria-label="LinkedIn"><FaLinkedinIn /></a>
                <a href="#contact" aria-label="Instagram"><FaInstagram /></a>
              </div>
            </div>

            <div>
              <h3>Quick Links</h3>
              <ul className="landing-footer__links">
                <li>
                  <button type="button" className="landing-footer__button-link" onClick={onNavigateToAbout}>
                    About Us
                  </button>
                </li>
                <li>
                  <button type="button" className="landing-footer__button-link" onClick={onNavigateToPartnerEvents}>
                    Partner Events
                  </button>
                </li>
                <li>
                  <button type="button" className="landing-footer__button-link" onClick={onNavigateToFaq}>
                    FAQ
                  </button>
                </li>
                <li>
                  <button type="button" className="landing-footer__button-link" onClick={onNavigateToPricing}>
                    Pricing
                  </button>
                </li>
                <li>
                  <button type="button" className="landing-footer__button-link" onClick={onNavigateToContact}>
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3>Categories</h3>
              <ul className="landing-footer__links">
                <li>Music Events</li>
                <li>Sports Events</li>
                <li>Arts &amp; Culture</li>
                <li>Food &amp; Drink</li>
                <li>Business</li>
                <li>Nightlife</li>
              </ul>
            </div>

            <div>
              <h3>Contact Info</h3>
              <div className="landing-footer__contact">
                <p><FiMapPin /> Patel Colony 3/5<br />Jamnagar, Gujarat, India</p>
                <p><FiPhone /> +91 81062 53134</p>
                <p><FiMail /> mashrumihir13@gmail.com</p>
              </div>
            </div>
          </Container>

          <div className="landing-footer__bottom">
            <Container className="landing-shell landing-footer__bottom-row">
              <span>&copy; 2026 Eventify. All rights reserved.</span>
              <span className="landing-footer__bottom-links">
                <button type="button" className="landing-footer__button-link" onClick={onNavigateToPrivacyPolicy}>
                  Privacy Policy
                </button>
                <button type="button" className="landing-footer__button-link" onClick={onNavigateToTermsOfService}>
                  Terms of Service
                </button>
              </span>
            </Container>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
