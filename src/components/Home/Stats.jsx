import Container from "../layout/Container";
import { FiCalendar, FiFileText, FiStar, FiUsers } from "react-icons/fi";

const stats = [
  { id: 1, label: "Events", value: "10K+", tone: "text-blue-600", Icon: FiCalendar },
  { id: 2, label: "Attendees", value: "50K+", tone: "text-purple-600", Icon: FiUsers },
  { id: 3, label: "Organizers", value: "2K+", tone: "text-indigo-600", Icon: FiFileText },
  { id: 4, label: "Rating", value: "4.9", tone: "text-amber-500", Icon: FiStar },
];

const Stats = () => {
  return (
    <section className="bg-slate-100 py-12">
      <Container className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm"
          >
            <item.Icon
              className={`mx-auto mb-3 h-5 w-5 ${item.tone}`}
              aria-hidden="true"
            />
            <span
              className={`sr-only ${item.tone}`}
            >
              {item.label}
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900">{item.value}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.label}</p>
          </article>
        ))}
      </Container>
    </section>
  );
};

export default Stats;
