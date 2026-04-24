import { useEffect, useMemo, useState } from "react";
import { fetchEvents } from "../../services/dataService";
import useInteraction from "../../hooks/useInteraction";
import Container from "../layout/Container";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { FiStar } from "react-icons/fi";

function formatEventDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date TBD";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const PopularEvents = () => {
  const { toggleFavourite, isFavourite } = useInteraction();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetchEvents();

        if (!isMounted) {
          return;
        }

        setEvents(response.events || []);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load events.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }

        return (b.ticketsSold || 0) - (a.ticketsSold || 0);
      })
      .slice(0, 6);
  }, [events]);

  return (
    <section className="section-block">
      <Container className="landing-shell">
        <header className="section-heading">
          <h2>Popular Events</h2>
          <p>Don't miss out on the most exciting events happening near you</p>
        </header>

        {error ? <p className="me-status-message">{error}</p> : null}

        {isLoading ? <p className="me-status-message">Loading events...</p> : null}

        <div className="events-grid">
          {featuredEvents.map((event) => {
            const saved = isFavourite(event.id);

            return (
              <article key={event.id} className="event-card">
                <div className="event-card__image">
                  <img src={event.image || "https://placehold.co/640x420?text=Event"} alt={event.title} />
                  <button
                    type="button"
                    className="event-card__wishlist"
                    onClick={() => toggleFavourite(event.id)}
                    aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    {saved ? <IoHeart className="text-rose-500" /> : <IoHeartOutline />}
                  </button>
                </div>

                <div className="event-card__body">
                  <h3 className="event-card__title">{event.title}</h3>
                  <p className="event-card__info">{formatEventDate(event.date)}</p>
                  <p className="event-card__info">{event.location}</p>
                  <div className="event-card__footer">
                    <span className="event-card__rating"><FiStar aria-hidden="true" /> {(event.rating || 0).toFixed(1)}</span>
                    <span>Rs {Number(event.price || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <button type="button" className="event-card__button">
                    Book Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!isLoading && !featuredEvents.length ? (
          <p className="me-status-message">No events found in the database yet.</p>
        ) : null}

        <div className="view-all-wrap">
          <button type="button" className="view-all-btn">
            View All Events
          </button>
        </div>
      </Container>
    </section>
  );
};

export default PopularEvents;
