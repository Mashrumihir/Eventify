import { useState } from "react";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import Container from "../../layout/Container";
import "./pricing.css";

const pricingPlans = {
  monthly: [
    {
      name: "Basic",
      price: "Free / \u20B90",
      subtitle: "Best for trying Eventify features.",
      features: [
        "Create up to 3 events",
        "Basic event management",
        "Limited attendee handling",
        "Email ticket support",
        "Basic analytics",
      ],
      action: "Get Started",
    },
    {
      name: "Pro",
      price: "\u20B9499 / month",
      subtitle: "Best for growing event organizers.",
      badge: "Most Popular",
      features: [
        "Unlimited events",
        "Advanced booking system",
        "Payment integration",
        "Detailed analytics dashboard",
        "Coupon and discount system",
        "Priority support",
      ],
      action: "Start Pro",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      subtitle: "Best for companies and large teams.",
      features: [
        "Unlimited everything",
        "Dedicated account manager",
        "Custom branding",
        "Advanced reports and insights",
        "API and ERP support",
        "24/7 priority support",
      ],
      action: "Contact Us",
    },
  ],
  yearly: [
    {
      name: "Basic",
      price: "Free / \u20B90",
      subtitle: "Best for trying Eventify features.",
      features: [
        "Create up to 3 events",
        "Basic event management",
        "Limited attendee handling",
        "Email ticket support",
        "Basic analytics",
      ],
      action: "Get Started",
    },
    {
      name: "Pro",
      price: "\u20B94,999 / year",
      subtitle: "Save more with our yearly plan.",
      badge: "Most Popular",
      features: [
        "Unlimited events",
        "Advanced booking system",
        "Payment integration",
        "Detailed analytics dashboard",
        "Coupon and discount system",
        "Priority support",
      ],
      action: "Start Pro",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom Pricing",
      subtitle: "Best for companies and large teams.",
      features: [
        "Unlimited everything",
        "Dedicated account manager",
        "Custom branding",
        "Advanced reports and insights",
        "API and ERP support",
        "24/7 priority support",
      ],
      action: "Contact Us",
    },
  ],
};

const pricingFaq = [
  { question: "Can I upgrade later?", answer: "Yes" },
  { question: "Is there a free trial?", answer: "Yes" },
  { question: "Do you charge commission?", answer: "Optional" },
];

export default function Pricing({ onBack, onContact, onGetStarted }) {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="pricing-page">
      <Container className="pricing-shell">
        <button type="button" className="pricing-back" onClick={onBack}>
          <FiArrowLeft aria-hidden="true" />
          <span>Go Back</span>
        </button>

        <section className="pricing-hero">
          <h1>Simple, Transparent Pricing</h1>
          <p>Choose the plan that fits your event needs. No hidden charges.</p>

          <div className="pricing-toggle" role="tablist" aria-label="Billing period">
            <button
              type="button"
              className={billing === "monthly" ? "is-active" : ""}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              type="button"
              className={billing === "yearly" ? "is-active" : ""}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>
        </section>

        <section className="pricing-grid">
          {pricingPlans[billing].map((plan) => (
            <article key={`${billing}-${plan.name}`} className={`pricing-card ${plan.featured ? "is-featured" : ""}`}>
              <div className="pricing-card__head">
                <div>
                  <h2>{plan.name}</h2>
                  <h3>{plan.price}</h3>
                  <p>{plan.subtitle}</p>
                </div>
                {plan.badge ? <span className="pricing-card__badge">{plan.badge}</span> : null}
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <FiCheck aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="pricing-card__action"
                onClick={plan.name === "Enterprise" ? onContact : onGetStarted}
              >
                {plan.action}
              </button>
            </article>
          ))}
        </section>

        <section className="pricing-faq">
          <h2>Pricing FAQ</h2>
          <div className="pricing-faq__list">
            {pricingFaq.map((item) => (
              <div key={item.question} className="pricing-faq__row">
                <span>{item.question}</span>
                <strong>{item.answer}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-support">
          <h2>Still not sure?</h2>
          <div className="pricing-support__actions">
            <button type="button" onClick={onContact}>Contact Sales</button>
            <button type="button" className="secondary" onClick={onGetStarted}>Try Free Plan</button>
          </div>
        </section>
      </Container>
    </div>
  );
}
