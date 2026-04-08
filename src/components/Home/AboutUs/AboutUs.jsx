import {
  FiArrowLeft,
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiGlobe,
  FiGrid,
  FiShield,
  FiStar,
  FiTarget,
  FiTicket,
  FiUsers,
} from "react-icons/fi";
import Container from "../../layout/Container";
import "./about-us.css";

const values = [
  {
    title: "Mission",
    text: "To simplify event management through smart technology and seamless user experiences.",
    icon: <FiTarget aria-hidden="true" />,
  },
  {
    title: "Vision",
    text: "To become the go-to platform for memorable, reliable, and engaging event experiences.",
    icon: <FiGlobe aria-hidden="true" />,
  },
];

const features = [
  { title: "Event Creation", text: "Easy event setup for every kind of organizer.", icon: <FiCalendar aria-hidden="true" /> },
  { title: "Smart Ticket Booking", text: "Simple and secure booking for attendees.", icon: <FiTicket aria-hidden="true" /> },
  { title: "Payment Integration", text: "Reliable checkout and payment tracking.", icon: <FiCreditCard aria-hidden="true" /> },
  { title: "Real-time Notifications", text: "Stay updated with important alerts instantly.", icon: <FiBell aria-hidden="true" /> },
  { title: "Analytics Dashboard", text: "Track event growth and audience performance.", icon: <FiGrid aria-hidden="true" /> },
  { title: "Multi-role Access", text: "Built for admins, organizers, and attendees.", icon: <FiShield aria-hidden="true" /> },
];

const team = [
  { initials: "MM", name: "Mihir Mashru", role: "Founder / Developer" },
  { initials: "AK", name: "Aanya Kapoor", role: "Event Strategist" },
  { initials: "RS", name: "Rohan Shah", role: "Operations Manager" },
  { initials: "NP", name: "Nisha Patel", role: "Marketing Lead" },
];

const stats = [
  { value: "10,000+", label: "Events Created", icon: <FiCalendar aria-hidden="true" /> },
  { value: "50,000+", label: "Active Users", icon: <FiUsers aria-hidden="true" /> },
  { value: "2,000+", label: "Organizers", icon: <FiGrid aria-hidden="true" /> },
  { value: "4.9", label: "Average Rating", icon: <FiStar aria-hidden="true" /> },
];

export default function AboutUs({ onBack, onGetStarted, onContact }) {
  return (
    <div className="about-page">
      <Container className="about-shell">
        <button type="button" className="about-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          Back to Home
        </button>

        <section className="about-panel about-hero-panel">
          <span className="about-badge">About Eventify</span>
          <h1>One platform to create, manage, and enjoy unforgettable events.</h1>
          <p>
            Eventify helps organizers plan smarter and gives attendees a simpler way to discover,
            book, and experience events with confidence.
          </p>
        </section>

        <section className="about-panel">
          <h2>Our Story</h2>
          <p>
            Eventify started with one clear idea: event management should feel simple, not stressful.
            From student festivals to professional conferences, teams needed one place to organize
            schedules, bookings, communication, and reporting without juggling multiple tools.
          </p>
          <p>
            We built Eventify to bring that experience together in one polished workflow for every
            role involved in an event.
          </p>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">Mission & Vision</h2>
          <div className="about-two-col">
            {values.map((item) => (
              <article key={item.title} className="about-panel about-value-card">
                <span className="about-icon-chip">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">What We Offer</h2>
          <div className="about-feature-grid">
            {features.map((item) => (
              <article key={item.title} className="about-panel about-feature-card">
                <span className="about-icon-chip">{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section">
          <h2 className="about-section-title">Our Team</h2>
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
          <h2 className="about-section-title">Stats & Achievements</h2>
          <div className="about-stats-grid">
            {stats.map((item) => (
              <article key={item.label} className="about-panel about-stat-card">
                <span className="about-stat-icon">{item.icon}</span>
                <div>
                  <h3>{item.value}</h3>
                  <p>{item.label}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <h2>Ready to create your next event?</h2>
          <p>Start planning in minutes and turn every event into a smooth experience.</p>
          <div className="about-cta-actions">
            <button type="button" onClick={onGetStarted}>
              Get Started
            </button>
            <button type="button" className="secondary" onClick={onContact}>
              Contact Us
            </button>
          </div>
        </section>
      </Container>
    </div>
  );
}
