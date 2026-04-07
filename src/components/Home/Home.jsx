import Container from "../layout/Container";
import Hero from "./Hero";
import Stats from "./Stats";
import Features from "./Features";
import PopularEvents from "./PopularEvents";
import Categories from "./Categories";
import Newsletter from "./Newsletter";

const Home = ({ onNavigateToLogin, onNavigateToRegister, onNavigateToApp }) => {
  return (
    <div className="home-page bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-900 bg-slate-950/95 backdrop-blur-xl">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-5 text-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 text-xl font-black text-white shadow-lg shadow-cyan-500/20">
              E
            </div>
            <span className="text-base font-semibold uppercase tracking-[0.28em] text-white">
              Eventify
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-slate-200 md:flex lg:gap-10">
            <a href="#home" className="transition hover:text-cyan-300">
              Home
            </a>
            <a href="#events" className="transition hover:text-cyan-300">
              Events
            </a>
            <a href="#categories" className="transition hover:text-cyan-300">
              Categories
            </a>
            <a href="#about" className="transition hover:text-cyan-300">
              About
            </a>
            <a href="#contact" className="transition hover:text-cyan-300">
              Contact
            </a>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="hidden rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white md:inline-flex"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="rounded-full border border-cyan-500 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500 hover:text-white"
            >
              Register
            </button>
            <button
              type="button"
              onClick={onNavigateToApp}
              className="rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:brightness-110"
            >
              Create Event
            </button>
          </div>
        </Container>
      </header>

      <main>
        <section id="home">
          <Hero />
        </section>

        <section className="stats-overlap -mt-16 bg-transparent pb-16 pt-0">
          <Container>
            <Stats />
          </Container>
        </section>

        <section id="about">
          <Features />
        </section>

        <section id="events">
          <PopularEvents />
        </section>

        <section id="categories">
          <Categories />
        </section>

        <section>
          <Newsletter />
        </section>

        <footer id="contact" className="border-t border-slate-800 bg-slate-950/95 py-14 text-slate-400">
          <Container className="grid gap-10 xl:grid-cols-3">
            <div>
              <p className="text-2xl font-semibold text-white">Eventify</p>
              <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
                Discover amazing events happening around you. From concerts to
                conferences, we help you book the best experiences with ease.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Quick Links
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-400">
                <li>
                  <a href="#home" className="transition hover:text-white">Home</a>
                </li>
                <li>
                  <a href="#events" className="transition hover:text-white">Events</a>
                </li>
                <li>
                  <a href="#categories" className="transition hover:text-white">Categories</a>
                </li>
                <li>
                  <a href="#about" className="transition hover:text-white">About</a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Contact Info
              </p>
              <div className="mt-6 space-y-3 text-sm text-slate-400">
                <p>Palet Colony 3/5</p>
                <p>Jamnagar, Gujarat</p>
                <p>+91 81602 53154</p>
                <p>mmashru24z@eventify.com</p>
              </div>
            </div>
          </Container>

          <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            © 2026 Eventify. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;
