import Container from "../layout/Container";
import heroImage from "../../assets/landing-hero.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleLearnMore = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="hero-surface relative overflow-hidden py-16 text-white md:py-24">
      <Container className="relative z-10 grid items-center gap-12 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-200">
            Event Discovery Platform
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Discover Amazing <br /> Events Near You
          </h1>
          <p className="mt-5 max-w-xl text-sm text-slate-200 md:text-base">
            Join thousands of people experiencing unforgettable moments. Find
            and book the perfect event for you.
          </p>

          <div className="mt-10 w-full max-w-5xl rounded-full bg-white/95 p-4 shadow-2xl shadow-slate-950/20 ring-1 ring-white/20 backdrop-blur-sm">
            <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr_1fr_auto]">
              <input
                type="text"
                placeholder="Location"
                className="h-14 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              />
              <input
                type="date"
                className="h-14 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
              />
              <select className="h-14 rounded-full border border-slate-200 bg-white px-5 text-sm text-slate-700 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200">
                <option>All Categories</option>
                <option>Music</option>
                <option>Sports</option>
                <option>Arts</option>
              </select>
              <button className="h-14 rounded-full bg-gradient-to-r from-blue-800 to-cyan-500 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition hover:brightness-105">
                Search Events
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
            >
              Explore Events
            </button>
            <button
              type="button"
              onClick={handleLearnMore}
              className="rounded-md border border-blue-300 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="hero-photo-shell relative mx-auto w-full max-w-md">
          <div className="hero-art absolute -inset-8 rounded-3xl blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-tr from-blue-700/70 to-cyan-400/60 p-4 shadow-2xl">
            <img
              src={heroImage}
              alt="Event collage"
              className="hero-photo h-72 w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
