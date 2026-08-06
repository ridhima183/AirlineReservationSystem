import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container">
      <div class="hero-card fade-in" style="background-image:url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">About SkyRoute Airways</h2>
          <p class="hero-subtitle">Flying people home, to work and to wonder since 2009 — with a smile on every route.</p>
        </div>
      </div>

      <div class="card fade-in">
        <h3 class="section-title">Our Story</h3>
        <p style="line-height:1.75; color:#b9d6ea; margin:0;">
          SkyRoute began as a single turboprop flying between two cities, powered by a stubborn belief that air
          travel should be simple, honest and human. Today we operate a modern fleet across 1,200+ destinations,
          yet every decision — from how we price our fares to how we treat a delayed passenger — is still guided by
          that original promise: <strong style="color:#8cf4ff;">put the traveller first.</strong>
        </p>
      </div>

      <h3 class="section-title" style="margin-top:1.4rem;">Our Values</h3>
      <div class="grid-3">
        <div class="card feature">
          <div class="feature-icon">✈</div>
          <h4>Safety Above All</h4>
          <p>A zero-compromise safety culture backed by continuous training and a modern, well-maintained fleet.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon">❤</div>
          <h4>Human Service</h4>
          <p>Real people on our helplines, 24/7, who treat your journey like their own.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon">★</div>
          <h4>Radical Honesty</h4>
          <p>Transparent fares, no hidden fees, and clear communication in every situation.</p>
        </div>
      </div>

      <div class="card fade-in" style="margin-top:1.4rem;">
        <h3 class="section-title">Our Milestones</h3>
        <div class="about-stats">
          <div class="stat"><b>2009</b><span>Founded</span></div>
          <div class="stat"><b>120+</b><span>Aircraft</span></div>
          <div class="stat"><b>1200+</b><span>Destinations</span></div>
          <div class="stat"><b>40M+</b><span>Passengers / yr</span></div>
        </div>
      </div>

      <div class="card text-center fade-in" style="margin-top:1.4rem;">
        <h3 class="section-title">Ready to fly with us?</h3>
        <p style="margin:0 0 1rem; color:#b9d6ea;">Join millions of travellers who choose SkyRoute every year.</p>
        <button routerLink="/flights">Explore Flights</button>
      </div>
    </section>
  `,
  styles: [`
    .feature { text-align: center; padding: 1.5rem 1.2rem; }
    .feature-icon {
      width: 56px; height: 56px; margin: 0 auto 1rem;
      display: grid; place-items: center;
      font-size: 1.4rem; font-weight: 800; color: #0b2c47;
      border-radius: 16px;
      background: linear-gradient(135deg, #8cf4ff, #b9a6ff);
      box-shadow: 0 12px 26px rgba(30, 120, 200, .35);
    }
    .feature h4 { margin: 0 0 .5rem; color: #eafaff; font-size: 1.05rem; }
    .feature p { margin: 0; color: #9dbdd3; font-size: .88rem; line-height: 1.6; }
    .about-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: .6rem 0; }
    .stat { text-align: center; padding: .6rem; }
    .stat b { display: block; font-size: 1.6rem; color: #8cf4ff; }
    .stat span { font-size: .8rem; color: #93b4cc; text-transform: uppercase; letter-spacing: .04em; }
    .text-center { text-align: center; }
    @media (max-width: 640px) { .about-stats { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class AboutComponent {}
