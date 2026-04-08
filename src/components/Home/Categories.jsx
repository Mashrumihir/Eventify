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
    <section className="section-block">
      <Container className="landing-shell">
        <header className="section-heading">
          <h2>Browse by Category</h2>
          <p>Find the perfect event that matches your interests</p>
        </header>

        <div className="category-grid">
          {categories.map((category) => {
            const Icon = iconMap[category.icon];

            return (
              <article key={category.id} className="category-card">
                <span className="category-card__icon" style={category.tint}>
                  <Icon aria-hidden="true" />
                </span>
                <h3>{category.name}</h3>
                <p>{category.count} events</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Categories;
