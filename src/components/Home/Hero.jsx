import Container from "../layout/Container";
import heroImage from "../../assets/landing-hero.png";
import { FiCalendar, FiChevronDown, FiMapPin, FiTag } from "react-icons/fi";

const Hero = ({ onNavigateToApp }) => {
  const handleLearnMore = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-card">
      <Container className="landing-shell hero-card__inner">
        <div className="hero-copy">
          <h1>
            Discover Amazing
            <br />
            Events Near You
          </h1>
          <p>
            Join thousands of people experiencing unforgettable moments.
            <br />
            Find and book the perfect event for you.
          </p>

          <form className="hero-search" onSubmit={(event) => event.preventDefault()}>
            <div className="hero-search__top">
              <div className="hero-search__input-wrap">
                <span className="hero-search__leading" aria-hidden="true">
                  <FiMapPin />
                </span>
                <input
                  type="text"
                  className="hero-search__field hero-search__field--wide"
                  placeholder="Location"
                />
              </div>
              <div className="hero-search__input-wrap">
                <span className="hero-search__leading" aria-hidden="true">
                  <FiCalendar />
                </span>
                <input
                  type="text"
                  className="hero-search__field"
                  placeholder="dd-mm-yyyy"
                />
              </div>
              <div className="hero-search__select-wrap">
                <span className="hero-search__leading" aria-hidden="true">
                  <FiTag />
                </span>
                <select className="hero-search__select" defaultValue="all">
                  <option value="all">All Categories</option>
                  <option value="music">Music</option>
                  <option value="business">Business</option>
                  <option value="arts">Arts</option>
                </select>
                <span className="hero-search__caret" aria-hidden="true">
                  <FiChevronDown />
                </span>
              </div>
            </div>

            <button type="button" className="hero-search__button" onClick={onNavigateToApp}>
              Search Events
            </button>
          </form>

          <div className="hero-links">
            <button type="button" onClick={onNavigateToApp}>
              Explore Events
            </button>
            <button type="button" onClick={handleLearnMore}>
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-visual__frame">
            <img src={heroImage} alt="Featured event collage" />
          </div>
          <div className="hero-visual__dots" aria-hidden="true">
            <span />
            <span />
            <span className="is-active" />
            <span />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
