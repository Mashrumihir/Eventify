import { FiArrowLeft } from "react-icons/fi";
import Container from "../../layout/Container";
import "./partner-events.css";

const trustedPartners = [
  "Garba Night Ahmedabad",
  "Startup Summit India",
  "College Carnival RKU",
  "Music Mania Live",
  "Corporate Expo 2025",
  "EDM Connect",
];

const partnerEvents = [
  {
    title: "TechFest 2025",
    tag: "Technology",
    date: "March 28, 2026",
    location: "Ahmedabad",
  },
  {
    title: "Garba Night",
    tag: "Cultural",
    date: "October 12, 2026",
    location: "Navratri Special",
  },
  {
    title: "Startup Summit",
    tag: "Business",
    date: "July 18, 2026",
    location: "Mumbai",
  },
  {
    title: "EDM Concert",
    tag: "Live Show",
    date: "August 02, 2026",
    location: "Bengaluru",
  },
];

export default function PartnerEvents({ onBack }) {
  return (
    <div className="partner-page">
      <Container className="partner-shell">
        <button type="button" className="partner-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <section className="partner-panel partner-hero">
          <h1>Partner Events</h1>
          <p>Trusted by leading events and organizers across categories.</p>
        </section>

        <section className="partner-section">
          <h2>Trusted by Leading Events &amp; Organizers</h2>
          <div className="partner-chip-row">
            {trustedPartners.map((item) => (
              <span key={item} className="partner-chip">{item}</span>
            ))}
          </div>
        </section>

        <section className="partner-section">
          <h2>Our Partner Events</h2>
          <div className="partner-card-grid">
            {partnerEvents.map((event) => (
              <article key={event.title} className="partner-event-card">
                <div className="partner-event-card__media">
                  <span className="partner-event-card__tag">{event.tag}</span>
                  <span className="partner-event-card__badge">Partnered</span>
                </div>
                <div className="partner-event-card__body">
                  <h3>{event.title}</h3>
                  <p>Date: {event.date}</p>
                  <p>Location: {event.location}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
