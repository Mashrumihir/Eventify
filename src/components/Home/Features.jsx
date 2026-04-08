import Container from "../layout/Container";
import {
  FiBell,
  FiCheckSquare,
  FiHeart,
  FiLock,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

const features = [
  {
    id: 1,
    title: "Instant Booking",
    desc: "Book your favorite events instantly with just a few clicks.",
    icon: <FiZap aria-hidden="true" />,
    tint: { background: "#edf4ff", color: "#2563eb" },
  },
  {
    id: 2,
    title: "Secure Payments",
    desc: "Your payments are protected with bank-level security.",
    icon: <FiLock aria-hidden="true" />,
    tint: { background: "#edfdf1", color: "#16a34a" },
  },
  {
    id: 3,
    title: "Digital Tickets",
    desc: "Access your tickets anytime, anywhere on your mobile device.",
    icon: <FiCheckSquare aria-hidden="true" />,
    tint: { background: "#f4ecff", color: "#9333ea" },
  },
  {
    id: 4,
    title: "Event Reminders",
    desc: "Never miss an event with smart notifications and reminders.",
    icon: <FiBell aria-hidden="true" />,
    tint: { background: "#fff3e8", color: "#ea580c" },
  },
  {
    id: 5,
    title: "Wishlist Events",
    desc: "Save events you love and get notified when tickets are available.",
    icon: <FiHeart aria-hidden="true" />,
    tint: { background: "#ffedf6", color: "#db2777" },
  },
  {
    id: 6,
    title: "Trending Events",
    desc: "Discover what's popular and trending in your area.",
    icon: <FiTrendingUp aria-hidden="true" />,
    tint: { background: "#e8fffb", color: "#0f9f96" },
  },
];

const Features = () => {
  return (
    <section className="section-block">
      <Container className="landing-shell">
        <header className="section-heading">
          <h2>Why Choose Eventify?</h2>
          <p>Experience the future of event booking with our cutting edge features</p>
        </header>

        <div className="features-grid">
          {features.map((feature) => (
            <article key={feature.id} className="feature-card">
              <span className="feature-card__icon" style={feature.tint}>
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
