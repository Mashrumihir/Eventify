import { events } from "../../data/events";
import useInteraction from "../../hooks/useInteraction";
import Container from "../layout/Container";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { FiStar } from "react-icons/fi";

const PopularEvents = () => {
  const { toggleFavourite, isFavourite } = useInteraction();

  return (
    <section className="section-block">
      <Container className="landing-shell">
        <header className="section-heading">
          <h2>Popular Events</h2>
          <p>Don't miss out on the most exciting events happening near you</p>
        </header>

        <div className="events-grid">
          {events.map((event) => {
            const saved = isFavourite(event.id);

            return (
              <article key={event.id} className="event-card">
                <div className="event-card__image">
                  <img src={event.image} alt={event.title} />
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
                  <p className="event-card__info">{event.date}</p>
                  <p className="event-card__info">{event.location}</p>
                  <div className="event-card__footer">
                    <span className="event-card__rating"><FiStar aria-hidden="true" /> {event.rating}</span>
                    <span>Rs {event.price}</span>
                  </div>
                  <button type="button" className="event-card__button">
                    Book Now
                  </button>
                </div>
              </article>
            );
          })}
        </div>

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
