import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Faq {
  q: string;
  a: string;
  open: boolean;
}

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container">
      <div class="hero-card fade-in" style="background-image:url('https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1600&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">How can we help?</h2>
          <p class="hero-subtitle">Browse answers to common questions or reach our support team — we're here 24/7.</p>
        </div>
      </div>

      <div class="grid-2" style="margin-top:1.4rem;">
        <div class="card fade-in">
          <h3 class="section-title">Contact Us</h3>
          <div class="help-row"><span>📞 Helpline</span><b>+91 1800-2026-777</b></div>
          <div class="help-row"><span>✉ Email</span><b>support&#64;skyroute.com</b></div>
          <div class="help-row"><span>🕐 Hours</span><b>24 / 7 / 365</b></div>
          <div class="help-row"><span>📍 HQ</span><b>SkyRoute House, Mumbai, IN</b></div>
        </div>

        <div class="card fade-in">
          <h3 class="section-title">Quick Links</h3>
          <div class="help-links">
            <a routerLink="/flights">Search &amp; Book Flights</a>
            <a routerLink="/enquiry">Manage My Booking</a>
            <a routerLink="/profile">My Account &amp; Profile</a>
            <a routerLink="/register">Create an Account</a>
          </div>
        </div>
      </div>

      <div class="card fade-in" style="margin-top:1.4rem;">
        <h3 class="section-title">Frequently Asked Questions</h3>
        <div class="faq-item" *ngFor="let f of faqs">
          <button class="faq-q" (click)="toggle(f)">
            <span>{{ f.q }}</span>
            <span class="faq-chevron" [class.open]="f.open">{{ f.open ? '−' : '+' }}</span>
          </button>
          <div class="faq-a" *ngIf="f.open">{{ f.a }}</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .help-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: .7rem 0; border-bottom: 1px solid rgba(135, 215, 255, .12);
      color: #cfe7f7; flex-wrap: wrap; gap: .4rem;
    }
    .help-row:last-child { border-bottom: none; }
    .help-row span { color: #8bb8d5; }
    .help-links { display: grid; gap: .5rem; }
    .help-links a {
      color: #a8f4ff; text-decoration: none; padding: .6rem .8rem;
      border-radius: 10px; background: rgba(124, 234, 255, .08);
      border: 1px solid rgba(124, 234, 255, .18);
      transition: background .2s ease, transform .2s ease;
    }
    .help-links a:hover { background: rgba(124, 234, 255, .16); transform: translateX(4px); }
    .faq-item { border-bottom: 1px solid rgba(135, 215, 255, .12); }
    .faq-item:last-child { border-bottom: none; }
    .faq-q {
      width: 100%; display: flex; justify-content: space-between; align-items: center;
      text-align: left; background: transparent; box-shadow: none; border: none;
      color: #eafaff; font-size: .95rem; font-weight: 600; padding: .9rem .2rem;
    }
    .faq-q:hover { background: rgba(124, 234, 255, .06); }
    .faq-chevron { color: #8cf4ff; font-size: 1.2rem; transition: transform .2s ease; }
    .faq-chevron.open { transform: rotate(180deg); }
    .faq-a {
      padding: 0 .2rem .9rem; color: #9dbdd3; line-height: 1.65; font-size: .9rem;
    }
  `]
})
export class HelpComponent {
  faqs: Faq[] = [
    { q: 'How do I book a flight?', a: 'Head to the Flights page, enter your departure and destination cities, choose a date and cabin class, then select a flight to continue to instant booking and seat selection.', open: false },
    { q: 'Can I change or cancel my booking?', a: 'Yes. Log in and visit the Bookings page to manage your reservations. Cancellation fees and refunds are calculated based on your fare type and how close to departure you cancel.', open: false },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking and popular digital wallets. Your transaction is processed securely and you will receive an e-ticket instantly.', open: false },
    { q: 'How is the price calculated?', a: 'The total reflects the number of adults, children and infants, plus the cabin class you select. We show the fare breakdown transparently before you pay — no hidden fees.', open: false },
    { q: 'How many bags can I carry?', a: 'Economy includes one cabin bag and one checked bag. Business passengers enjoy an additional checked bag. Exact allowances are shown on your e-ticket.', open: false }
  ];

  toggle(f: Faq) {
    f.open = !f.open;
    this.faqs.forEach(x => { if (x !== f) x.open = false; });
  }
}
