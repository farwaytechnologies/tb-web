import '../Styles/HomeStyle/HomeWhyUs.css';
import im1 from '../assets/images/diversity.png';
import im2 from '../assets/images/flexibility.png';
import im3 from '../assets/images/pricing.png';

const CARDS = [
  { img: im1, tag: 'Variety of Courses', title: 'Explore Diverse Topics', desc: 'From technology to arts, learn from experts in various fields and discover new passions.', color: '#8b5cf6' },
  { img: im2, tag: 'Flexible Schedule',  title: 'Learn at Your Own Pace', desc: 'Fit learning into your busy schedule. Access courses anytime, anywhere on any device.', color: '#06b6d4' },
  { img: im3, tag: 'Affordable Learning', title: 'Competitive Pricing',   desc: 'Gain access to high-quality education without breaking the bank. Invest in yourself.', color: '#10b981' },
];

export default function HomeWhyUs() {
  return (
    <section className="hwu-section">
      <div className="hwu-container">
        <div className="hwu-header">
          <span className="hwu-badge">Why TechBorg</span>
          <h2>Built for Learners Like You</h2>
          <p>Whether you're advancing your career or exploring a new passion, we have the right course for you.</p>
        </div>

        <div className="hwu-cards">
          {CARDS.map((c, i) => (
            <div key={i} className="hwu-card" style={{ '--cc': c.color }}>
              <div className="hwu-card-img-wrap">
                <img src={c.img} alt={c.title} />
              </div>
              <span className="hwu-tag" style={{ color: c.color }}>{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="hwu-card-bar" style={{ background: c.color }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
