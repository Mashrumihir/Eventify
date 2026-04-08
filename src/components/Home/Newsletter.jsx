import Container from "../layout/Container";
import { FiMail } from "react-icons/fi";

const Newsletter = () => {
  return (
    <section className="newsletter-block">
      <Container className="landing-shell">
        <div className="newsletter">
          <span className="newsletter__badge">
            <FiMail aria-hidden="true" />
          </span>
          <h2>Stay Updated with the Latest Events</h2>
          <p>Get exclusive access to upcoming events, special offers, and insider updates delivered straight to your inbox.</p>
          <form className="newsletter__form" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              className="newsletter__input"
              placeholder="Enter your email address"
            />
            <button type="submit" className="newsletter__button">
              Subscribe
            </button>
          </form>
          <span className="newsletter__privacy">We respect your privacy. Unsubscribe at any time.</span>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
