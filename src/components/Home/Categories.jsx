import { useEffect, useMemo, useState } from "react";
import { fetchEventCategories, fetchEvents } from "../../services/dataService";
import Container from "../layout/Container";
import {
  FiActivity,
  FiBookOpen,
  FiBriefcase,
  FiCoffee,
  FiCompass,
  FiFeather,
  FiMoon,
  FiMusic,
  FiSmile,
} from "react-icons/fi";

const iconMap = {
  music: FiMusic,
  sports: FiActivity,
  arts: FiFeather,
  food: FiCoffee,
  business: FiBriefcase,
  comedy: FiSmile,
  nightlife: FiMoon,
  fitness: FiCompass,
  education: FiBookOpen,
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        setIsLoading(true);
        setError("");

        const [categoryResponse, eventResponse] = await Promise.all([
          fetchEventCategories(),
          fetchEvents(),
        ]);

        if (!isMounted) {
          return;
        }

        setCategories(categoryResponse.categories || []);
        setEvents(eventResponse.events || []);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load categories.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map();

    events.forEach((event) => {
      const key = event.category || "Uncategorized";
      counts.set(key, (counts.get(key) || 0) + 1);
    });

    return counts;
  }, [events]);

  return (
    <section className="section-block">
      <Container className="landing-shell">
        <header className="section-heading">
          <h2>Browse by Category</h2>
          <p>Find the perfect event that matches your interests</p>
        </header>

        {error ? <p className="me-status-message">{error}</p> : null}

        <div className="category-grid">
          {!isLoading && categories.length === 0 ? (
            <p className="me-status-message">No categories available yet.</p>
          ) : null}

          {categories.map((category) => {
            const key = String(category.name || "").toLowerCase();
            const Icon = iconMap[key] || FiCompass;
            const count = categoryCounts.get(category.name) || 0;

            return (
              <article key={category.id} className="category-card">
                <span className="category-card__icon">
                  <Icon aria-hidden="true" />
                </span>
                <h3>{category.name}</h3>
                <p>{count} events</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
