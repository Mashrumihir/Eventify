import { useState } from "react";
import { FiArrowLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Container from "../../layout/Container";
import "./faq.css";

const faqItems = [
  {
    question: "What is Eventify?",
    answer: "Eventify is an all-in-one platform to create, manage, and book events easily from small gatherings to large-scale conferences.",
  },
  {
    question: "How can I book an event?",
    answer: "Simply browse events, select your preferred one, choose tickets, and proceed to payment.",
  },
  {
    question: "Can I create my own event?",
    answer: "Yes. Register as an organizer and start creating events with full control over tickets, pricing, and details.",
  },
  {
    question: "What payment methods are supported?",
    answer: "We support UPI, debit/credit cards, and net banking, all available in the project.",
  },
  {
    question: "Can I cancel my booking?",
    answer: "Yes, bookings can be cancelled based on the event's refund policy set by the organizer.",
  },
  {
    question: "How do I receive my ticket?",
    answer: "After successful booking, your ticket will be available in your dashboard with a downloadable QR code.",
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. Eventify ensures secure authentication and safe data handling practices.",
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us via the Contact Us page or email support for any queries.",
  },
];

export default function FAQ({ onBack, onContact }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page">
      <Container className="faq-shell">
        <button type="button" className="faq-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <section className="faq-hero">
          <h1>Frequently Asked Questions</h1>
          <p>Everything you need to know about using Eventify.</p>
        </section>

        <section className="faq-list" aria-label="FAQ list">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article key={item.question} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <button
                  type="button"
                  className="faq-item__header"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span>{index + 1}. {item.question}</span>
                  {isOpen ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
                </button>

                {isOpen && (
                  <div className="faq-item__body">
                    <p>{item.answer}</p>
                  </div>
                )}
              </article>
            );
          })}
        </section>

        <section className="faq-support">
          <h2>Still have questions?</h2>
          <p>Need help with anything else? Our team is ready to support you.</p>
          <button type="button" onClick={onContact}>Contact Support</button>
          <span>We're here to help 24/7</span>
        </section>
      </Container>
    </div>
  );
}
