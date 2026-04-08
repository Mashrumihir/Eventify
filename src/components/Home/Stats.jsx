import { FiCalendar, FiFileText, FiStar, FiUsers } from "react-icons/fi";

const stats = [
  { id: 1, label: "Events", value: "10K+", tone: "#2563eb", glow: "#dbe7ff", Icon: FiCalendar },
  { id: 2, label: "Attendees", value: "50K+", tone: "#8b5cf6", glow: "#ece1ff", Icon: FiUsers },
  { id: 3, label: "Organizers", value: "2K+", tone: "#4f46e5", glow: "#e2e6ff", Icon: FiFileText },
  { id: 4, label: "Rating", value: "4.9", tone: "#f59e0b", glow: "#fff2cf", Icon: FiStar },
];

const Stats = () => {
  return (
    <div className="stats-grid">
      {stats.map((item) => (
        <article key={item.id} className="stat-card">
          <span className="stat-card__orb" style={{ background: item.glow }} aria-hidden="true" />
          <span className="stat-card__icon" style={{ color: item.tone, background: item.glow }}>
            <item.Icon aria-hidden="true" />
          </span>
          <h3>{item.value}</h3>
          <p>{item.label}</p>
        </article>
      ))}
    </div>
  );
};

export default Stats;
