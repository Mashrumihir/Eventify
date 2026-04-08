import { FiArrowLeft, FiMail, FiMapPin } from "react-icons/fi";
import Container from "../../layout/Container";
import "./privacy-policy.css";

const sections = [
  {
    id: "collect",
    title: "1. Information We Collect",
    body: [
      "Name, email address, phone number and location",
      "Account details like organization, role, and login activity",
      "Booking information, forms, tickets, and payments",
      "Usage data such as browser and device information",
    ],
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    body: [
      "Create and manage your account",
      "Process bookings and event operations",
      "Send updates and important notifications",
      "Improve your overall experience",
    ],
  },
  {
    id: "security",
    title: "3. Data Protection & Security",
    body: [
      "We use secure authentication and encrypted storage to protect your data from unauthorized access, alteration, or disclosure.",
    ],
  },
  {
    id: "sharing",
    title: "4. Sharing of Information",
    body: [
      "We do not sell your personal data.",
      "Payment information is processed by trusted third-party services only when needed.",
      "Required information may be shared with organizers only when you book an event.",
    ],
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    body: [
      "Eventify uses cookies to enhance your experience and analyze website traffic.",
    ],
  },
  {
    id: "rights",
    title: "6. User Rights",
    body: [
      "Access your profile details",
      "Update your information",
      "Delete your account or personal data",
      "Opt out of communication emails",
    ],
  },
  {
    id: "third-party",
    title: "7. Third-Party Services",
    body: [
      "Eventify integrates with payment gateways, analytics tools, and maps services that have their own privacy policies.",
    ],
  },
  {
    id: "updates",
    title: "8. Updated to Policy",
    body: [
      "We may update this policy from time to time. Changes will be reflected on this page.",
    ],
  },
  {
    id: "contact",
    title: "9. Contact Us",
    body: [
      "If you have any questions regarding this policy, contact us at:",
    ],
  },
];

const sideLinks = sections.map((section) => ({
  id: section.id,
  label: section.title.replace(/^\d+\.\s*/, ""),
}));

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="privacy-page">
      <Container className="privacy-shell">
        <button type="button" className="privacy-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <section className="privacy-hero">
          <h1>Privacy Policy</h1>
          <p>
            At Eventify, we value your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
        </section>

        <div className="privacy-layout">
          <aside className="privacy-side">
            <div className="privacy-side__card">
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

          <section className="privacy-content">
            {sections.map((section) => (
              <article key={section.id} id={section.id} className="privacy-section">
                <h3>{section.title}</h3>
                <div className="privacy-section__body">
                  {section.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}

            <article className="privacy-contact-card">
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
