import { categories } from "../../data/categories";
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
  return (
    <section className="bg-slate-100 py-16">
      <Container>
        <header className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Browse by Category
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Find the perfect event that matches your interests.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {(() => {
                const Icon = iconMap[category.icon];
                return (
                  <span
                    className={`mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${category.tint}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                );
              })()}
              <span
                className="sr-only"
              >
                {category.name}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {category.count} events
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
