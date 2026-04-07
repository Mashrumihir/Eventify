import { events } from "../../data/events";
import useInteraction from "../../hooks/useInteraction";
import Container from "../layout/Container";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PopularEvents = () => {
  const { toggleFavourite, isFavourite } = useInteraction();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleBookNow = (eventId) => {
    const targetPath = `/dashboard/events/${eventId}`;
    if (!isAuthenticated || user?.role !== "attend") {
      navigate("/login", {
        state: {
          from: { pathname: targetPath },
          requiredRole: "attend",
        },
      });
      return;
    }
    navigate(targetPath);
  };

  return (
    <section className="bg-slate-100 py-16">
      <Container>
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Popular Events
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Do not miss out on the most exciting events happening near you.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                {(() => {
                  const saved = isFavourite(event.id);
                  return (
                    <button
                      type="button"
                      className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-slate-700 shadow-sm"
                      onClick={() => toggleFavourite(event.id)}
                      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      {saved ? (
                        <IoHeart className="h-4 w-4 text-rose-500" />
                      ) : (
                        <IoHeartOutline className="h-4 w-4" />
                      )}
                    </button>
                  );
                })()}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{event.date}</p>
                <p className="mt-1 text-sm text-slate-500">{event.location}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    Rating {event.rating}
                  </span>
                  <span className="text-xl font-extrabold text-blue-700">
                    ₹{event.price}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleBookNow(event.id)}
                  className="mt-4 w-full rounded-md bg-gradient-to-r from-blue-800 to-cyan-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="rounded-md border border-blue-500 px-5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
          >
            View All Events
          </button>
        </div>
      </Container>
    </section>
  );
};

export default PopularEvents;
