import { FiArrowLeft } from "react-icons/fi";
import Container from "../../layout/Container";
import "./about.css";

const missionVision = [
  {
    id: "M",
    title: "Mission",
    text: "To simplify event management through smart technology and seamless user experience.",
  },
  {
    id: "V",
    title: "Vision",
    text: "To become the go-to platform for events worldwide, empowering creators and connecting communities.",
  },
];

const offers = [
  "Easy Event Creation",
  "Smart Ticket Booking",
  "Secure Payment Integration",
  "Real-time Notifications",
  "Analytics Dashboard",
  "Multi-role Access (Admin, Organizer, User)",
];

const team = [
  { initials: "MM", name: "Mihir Mashru", role: "Founder / Developer" },
  { initials: "AK", name: "Aanya Kapoor", role: "UI/UX Designer" },
  { initials: "RS", name: "Rohan Shah", role: "Backend Developer" },
  { initials: "NP", name: "Nisha Patel", role: "Marketing Lead" },
];

const stats = [
  { value: "10,000+", label: "Events Created" },
  { value: "50,000+", label: "Users" },
  { value: "2,000+", label: "Organizers" },
  { value: "4.9", label: "Average Rating" },
];

export default function About({ onBack, onGetStarted, onContact }) {
  return (
    <div className="about-page">
      <Container className="about-shell">
        <button type="button" className="about-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <section className="about-panel about-hero">
          <h1>About Us</h1>
          <p>Eventify is a platform built to simplify how people create, manage, and attend events.</p>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <div className="about-panel about-story">
            <p>
              Eventify was built with one simple goal, to make event management effortless. From college fests to
              corporate conferences, we noticed how messy planning and booking could get. So we created a platform
              that brings everything together, organizing, booking, payments, and analytics in one smooth experience.
            </p>
            <p>
              What started as a simple idea is now a growing platform helping organizers and attendees connect better
              than ever.
            </p>
          </div>
        </section>

        <section className="about-section">
          <h2>Mission &amp; Vision</h2>
          <div className="about-two-grid">
            {missionVision.map((item) => (
              <article key={item.title} className="about-panel about-mini-card">
                <div className="about-mini-card__head">
                  <span className="about-badge">{item.id}</span>
                  <h3>{item.title}</h3>
                </div>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <div className="about-offer-grid">
            {offers.map((item, index) => (
              <article key={item} className="about-panel about-offer-card">
                <span className="about-number">{index + 1}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Our Team</h2>
          <div className="about-team-grid">
            {team.map((member) => (
              <article key={member.name} className="about-panel about-team-card">
                <span className="about-avatar">{member.initials}</span>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2>Stats / Achievements</h2>
          <div className="about-stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="about-panel about-stat-card">
                <span className="about-stat-dot" />
                <div>
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <h2>Ready to Create Your Next Event?</h2>
          <p>Start planning in minutes and run your events with confidence.</p>
          <div className="about-cta__actions">
            <button type="button" onClick={onGetStarted}>Get Started</button>
            <button type="button" className="secondary" onClick={onContact}>Contact Us</button>
          </div>
        </section>
      </Container>
    </div>
  );
}
