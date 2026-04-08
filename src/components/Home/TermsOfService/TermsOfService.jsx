import { FiArrowLeft, FiMail, FiMapPin } from "react-icons/fi";
import Container from "../../layout/Container";
import "./terms-of-service.css";

const sections = [
  {
    id: "platform",
    title: "1. Use of the Platform",
    body: [
      "You must be at least 18 years old or use the platform under supervision.",
      "You agree to use Eventify only for lawful purposes.",
      "Any misuse of the platform may result in account suspension.",
    ],
  },
  {
    id: "accounts",
    title: "2. User Accounts",
    body: [
      "Users are responsible for maintaining the confidentiality of their login credentials.",
      "You agree to provide accurate and complete information during registration.",
      "Eventify is not responsible for unauthorized access due to user negligence.",
    ],
  },
  {
    id: "creation",
    title: "3. Event Creation (Organizers)",
    body: [
      "Organizers are responsible for the accuracy of event details.",
      "Eventify is not liable for cancellations, delays, or changes made by organizers.",
      "Organizers must comply with all applicable laws and regulations.",
    ],
  },
  {
    id: "ticketing",
    title: "4. Ticket Booking & Payments",
    body: [
      "All bookings are subject to availability.",
      "Payments are processed through secure third-party gateways.",
      "Refunds depend on the event organizer's stated policy.",
    ],
  },
  {
    id: "refunds",
    title: "5. Cancellation & Refund Policy",
    body: [
      "Users may cancel bookings based on event-specific rules.",
      "Refund timelines and eligibility are decided by organizers.",
      "Eventify acts as a platform and does not guarantee refunds.",
    ],
  },
  {
    id: "prohibited",
    title: "6. Prohibited Activities",
    body: [
      "Use the platform for fraudulent activity.",
      "Upload false or misleading event information.",
      "Attempt to hack or disrupt the system.",
      "Violate any applicable laws.",
    ],
  },
  {
    id: "ip",
    title: "7. Intellectual Property",
    body: [
      "All content, design, and branding of Eventify are protected and cannot be copied or reused without permission.",
    ],
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    body: [
      "Eventify is not responsible for event cancellations or changes.",
      "Losses due to third-party services.",
      "Technical issues beyond our control.",
    ],
  },
  {
    id: "termination",
    title: "9. Termination of Access",
    body: [
      "We reserve the right to suspend or terminate accounts that violate these terms.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to Terms",
    body: [
      "Eventify may update these Terms at any time. Continued use of the platform implies acceptance of updated terms.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Information",
    body: [
      "For any questions regarding these Terms:",
      "support@eventify.com",
      "Ahmedabad, India",
    ],
  },
];

const sideLinks = sections.map((section) => ({
  id: section.id,
  label: section.title,
}));

export default function TermsOfService({ onBack }) {
  return (
    <div className="terms-page">
      <Container className="terms-shell">
        <button type="button" className="terms-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <section className="terms-hero">
          <h1>Terms of Service</h1>
          <p>
            By accessing or using Eventify, you agree to comply with and be bound by these Terms of Service.
            Please read them carefully before using the platform.
          </p>
          <span className="terms-updated">Last Updated: March 2026</span>
        </section>

        <div className="terms-layout">
          <aside className="terms-side">
            <div className="terms-side__card">
              <h2>Section Navigation</h2>
              <ul>
                {sideLinks.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="terms-content">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="terms-section">
                <h3>{section.title}</h3>
                <div className="terms-section__body">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}

            <article className="terms-contact-card">
              <h3>Contact Info</h3>
              <p><FiMail aria-hidden="true" /> support@eventify.com</p>
              <p><FiMapPin aria-hidden="true" /> Ahmedabad, India</p>
            </article>
          </section>
        </div>
      </Container>
    </div>
  );
}
