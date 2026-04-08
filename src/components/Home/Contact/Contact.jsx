import {
  FiArrowLeft,
  FiExternalLink,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiSend,
  FiWatch,
} from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import Container from "../../layout/Container";
import "./contact.css";

const socialLinks = [
  { label: "Instagram", icon: <FaInstagram aria-hidden="true" />, href: "https://www.instagram.com/" },
  { label: "LinkedIn", icon: <FaLinkedinIn aria-hidden="true" />, href: "https://www.linkedin.com/" },
  { label: "X", icon: <FaXTwitter aria-hidden="true" />, href: "https://x.com/" },
  { label: "Facebook", icon: <FaFacebookF aria-hidden="true" />, href: "https://www.facebook.com/" },
];

export default function Contact({ onBack }) {
  return (
    <div className="contact-page">
      <Container className="contact-shell">
        <button type="button" className="contact-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <div className="contact-grid">
          <article className="contact-card contact-info-card">
            <h1>Get in Touch with Us</h1>
            <p className="contact-lead">
              Have questions, feedback, or need help with your event?
              <br />
              We&apos;re here to help you 24/7.
            </p>

            <div className="contact-detail-list">
              <div className="contact-detail-item">
                <FiMail aria-hidden="true" />
                <p><strong>Email:</strong> support@eventify.com</p>
              </div>
              <div className="contact-detail-item">
                <FiPhone aria-hidden="true" />
                <p><strong>Phone:</strong> +91 81602 53134</p>
              </div>
              <div className="contact-detail-item">
                <FiMapPin aria-hidden="true" />
                <p><strong>Location:</strong> Jamnagar, Gujarat, India</p>
              </div>
              <div className="contact-detail-item">
                <FiWatch aria-hidden="true" />
                <p><strong>Working Hours:</strong> Mon - Sat (10 AM - 10 PM)</p>
              </div>
            </div>

            <div className="contact-socials" aria-label="Social links">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {item.icon}
                </a>
              ))}
            </div>
          </article>

          <article className="contact-card contact-form-card">
            <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
              <div className="contact-form__row">
                <label className="contact-field">
                  <span>Full Name</span>
                  <input type="text" placeholder="Enter your name" />
                </label>

                <label className="contact-field">
                  <span>Email Address</span>
                  <input type="email" placeholder="Enter your email" />
                </label>
              </div>

              <label className="contact-field">
                <span>Subject</span>
                <select defaultValue="General Query">
                  <option>General Query</option>
                  <option>Technical Support</option>
                  <option>Partnership</option>
                  <option>Billing Help</option>
                </select>
              </label>

              <label className="contact-field">
                <span>Message</span>
                <textarea placeholder="Write your message here..." rows="7" />
              </label>

              <button type="submit" className="contact-submit">
                <FiSend aria-hidden="true" />
                <span>Send Message</span>
              </button>
            </form>
          </article>
        </div>

        <section className="contact-map-card">
          <div className="contact-map-frame">
            <iframe
              title="Eventify office location"
              src="https://www.google.com/maps?q=Jamnagar,Gujarat,India&z=13&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="contact-map-actions">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Jamnagar%2C+Gujarat%2C+India"
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink aria-hidden="true" />
              <span>Open in Google Maps</span>
            </a>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Jamnagar%2C+Gujarat%2C+India"
              target="_blank"
              rel="noreferrer"
            >
              <FiNavigation aria-hidden="true" />
              <span>Get Directions</span>
            </a>
          </div>
        </section>
      </Container>
    </div>
  );
}
