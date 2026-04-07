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
    icon: <FiZap className="h-4 w-4" aria-hidden="true" />,
    tint: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    title: "Secure Payments",
    desc: "Your payments are protected with trusted encrypted gateways.",
    icon: <FiLock className="h-4 w-4" aria-hidden="true" />,
    tint: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 3,
    title: "Digital Tickets",
    desc: "Access your tickets anytime from your mobile or desktop.",
    icon: <FiCheckSquare className="h-4 w-4" aria-hidden="true" />,
    tint: "bg-violet-100 text-violet-700",
  },
  {
    id: 4,
    title: "Event Reminders",
    desc: "Stay updated with smart reminders and event alerts.",
    icon: <FiBell className="h-4 w-4" aria-hidden="true" />,
    tint: "bg-orange-100 text-orange-700",
  },
  {
    id: 5,
    title: "Wishlist Events",
    desc: "Save interesting events and get notified about updates.",
    icon: <FiHeart className="h-4 w-4" aria-hidden="true" />,
    tint: "bg-pink-100 text-pink-700",
  },
  {
    id: 6,
    title: "Trending Events",
    desc: "Explore top-rated and most popular events near you.",
    icon: <FiTrendingUp className="h-4 w-4" aria-hidden="true" />,
    tint: "bg-indigo-100 text-indigo-700",
  },
];

const Features = () => {
  return (
    <section className="bg-slate-100 py-16">
      <Container>
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Why Choose Eventify?
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Experience the future of event booking with our practical and
            powerful feature set.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span
                className={`mb-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold ${feature.tint}`}
              >
                {feature.icon}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{feature.desc}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Features;
