import Container from "../layout/Container";
import { FiMail } from "react-icons/fi";

const Newsletter = () => {
  return (
    <section className="bg-slate-100 pb-16 pt-6">
      <Container>
        <div className="newsletter-glow relative overflow-hidden rounded-2xl px-6 py-12 text-center text-white shadow-2xl md:px-12">
          <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-semibold">
            <FiMail className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Stay Updated with the Latest Events
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-blue-100 md:text-base">
            Get exclusive access to upcoming events, special offers, and insider
            updates delivered straight to your inbox.
          </p>
          <form className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full rounded-full border border-white/30 bg-white px-5 py-2.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              className="rounded-full bg-[#0b2f7a] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102f70]"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-blue-100">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;
