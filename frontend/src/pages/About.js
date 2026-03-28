import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const TEAM = [
  { name: 'Ethan Hargreaves', role: 'General Manager', img: 'EH', since: '2012' },
  { name: 'Sofia Alvarez', role: 'Head of Hospitality', img: 'SA', since: '2015' },
  { name: 'Rajan Patel', role: 'Executive Chef', img: 'RP', since: '2018' },
  { name: 'Mei-Lin Zhao', role: 'Spa & Wellness Director', img: 'MZ', since: '2019' },
];

const MILESTONES = [
  { year: '2008', event: 'LuxeStay opens its doors in Dubai' },
  { year: '2011', event: 'Awarded Best Luxury Hotel – Middle East' },
  { year: '2015', event: 'Presidential Suite unveiled' },
  { year: '2018', event: 'Infinity Rooftop Pool & Sky Bar launched' },
  { year: '2021', event: 'Sustainability Gold Certification achieved' },
  { year: '2024', event: '50,000 satisfied guests milestone' },
];

export default function About() {
  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__bg" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80)' }} />
        <div className="about-hero__overlay" />
        <div className="container about-hero__content">
          <span className="tag fade-up">Our Story</span>
          <h1 className="about-hero__title fade-up-1">A Legacy of<br/>Extraordinary Moments</h1>
          <p className="about-hero__sub fade-up-2">15 years of redefining luxury hospitality on the Dubai coastline</p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container about-mission">
          <div className="about-mission__text">
            <span className="tag">Our Philosophy</span>
            <h2 className="section-title" style={{ textAlign: 'left' }}>Where Every Detail<br/>Tells a Story</h2>
            <div className="divider" />
            <p>LuxeStay was born from a singular vision: to create a place where luxury is not a price tag, but a feeling. Since 2008, we have welcomed dignitaries, honeymooners, families, and explorers from every corner of the globe, each leaving with memories that last a lifetime.</p>
            <p style={{ marginTop: '16px' }}>We believe that true luxury lies in the smallest details — the thread count of your sheets, the way your name is remembered at breakfast, the seamless silence of a room designed for complete repose.</p>
            <div className="about-mission__values">
              {[{ icon: '🌟', title: 'Excellence', desc: 'Uncompromising standards in every interaction' }, { icon: '🤝', title: 'Integrity', desc: 'Honest, transparent, and dependable service' }, { icon: '🌿', title: 'Sustainability', desc: 'Luxury that respects our planet' }, { icon: '💡', title: 'Innovation', desc: 'Continuously reimagining the guest experience' }].map((v, i) => (
                <div key={i} className="about-mission__value">
                  <span>{v.icon}</span>
                  <div>
                    <strong>{v.title}</strong>
                    <p>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-mission__img-stack">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80" alt="Hotel exterior" className="about-mission__img1" />
            <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&q=80" alt="Suite interior" className="about-mission__img2" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-sm about-numbers">
        <div className="container">
          <div className="about-numbers__grid">
            {[{ num: '240', label: 'Rooms & Suites' }, { num: '15+', label: 'Years of Excellence' }, { num: '50+', label: 'International Awards' }, { num: '500+', label: 'Dedicated Staff' }, { num: '98%', label: 'Guest Satisfaction' }, { num: '50K+', label: 'Guests Hosted' }].map((s, i) => (
              <div key={i} className="about-numbers__item">
                <div className="about-numbers__num">{s.num}</div>
                <div className="about-numbers__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="tag">Our Journey</span>
            <h2 className="section-title">Milestones</h2>
            <div className="divider-center" />
          </div>
          <div className="about-timeline">
            {MILESTONES.map((m, i) => (
              <div key={i} className={`about-timeline__item ${i % 2 === 0 ? 'left' : 'right'}`}>
                <div className="about-timeline__content">
                  <span className="about-timeline__year">{m.year}</span>
                  <p className="about-timeline__event">{m.event}</p>
                </div>
                <div className="about-timeline__dot" />
              </div>
            ))}
            <div className="about-timeline__line" />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section" style={{ background: 'var(--dark-2)' }}>
        <div className="container">
          <div className="section-header">
            <span className="tag">Our People</span>
            <h2 className="section-title">Leadership Team</h2>
            <div className="divider-center" />
            <p className="section-desc">The passionate individuals who bring the LuxeStay vision to life every day.</p>
          </div>
          <div className="about-team">
            {TEAM.map((m, i) => (
              <div key={i} className="about-team__card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="about-team__avatar">{m.img}</div>
                <div className="about-team__name">{m.name}</div>
                <div className="about-team__role">{m.role}</div>
                <div className="about-team__since">With LuxeStay since {m.since}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <h2 className="about-cta__title">Ready to Experience LuxeStay?</h2>
          <p className="about-cta__sub">We'd love to welcome you. Browse our collection of rooms and begin planning your stay.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/rooms" className="btn-primary">Explore Rooms</Link>
            <Link to="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
