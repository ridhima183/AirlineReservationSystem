import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { SessionService } from '../../core/services/session.service';
import { Flight } from '../../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- HERO -->
    <section class="home-hero fade-in">
      <div class="home-hero-inner">
        <div class="home-hero-copy">
          <p class="home-eyebrow">✦ Welcome aboard</p>
          <h1 class="home-title">Travel the world<br /><span>without the turbulence.</span></h1>
          <p class="home-subtitle">
            SkyRoute connects you to 1,200+ destinations with seamless booking,
            real-time seats and fare transparency. Your journey starts here.
          </p>
          <div class="home-cta">
            <button class="cta-primary" (click)="goFlights()">Search Flights</button>
            <button class="cta-ghost" *ngIf="!isLoggedIn()" routerLink="/register">Join SkyRoute</button>
          </div>
        </div>

        <!-- QUICK SEARCH CARD -->
        <div class="home-quick card">
          <h3 class="section-title">Book in seconds</h3>
          <div>
            <label>From</label>
            <input [(ngModel)]="from" placeholder="e.g. DEL">
          </div>
          <div style="margin-top:.7rem;">
            <label>To</label>
            <input [(ngModel)]="to" placeholder="e.g. BOM">
          </div>
          <button class="cta-primary quick-go" (click)="quickSearch()">Find Flights →</button>
          <p class="error" *ngIf="quickError">{{ quickError }}</p>
        </div>
      </div>

      <div class="home-stats">
        <div class="stat"><b>1200+</b><span>Destinations</span></div>
        <div class="stat"><b>98.6%</b><span>On-time record</span></div>
        <div class="stat"><b>4.8★</b><span>Passenger rating</span></div>
        <div class="stat"><b>24/7</b><span>Human support</span></div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="container">
      <h2 class="home-heading">Why fly with <span>SkyRoute</span>?</h2>
      <div class="grid-3 features">
        <div class="card feature">
          <div class="feature-icon">₹</div>
          <h4>Best Fare Promise</h4>
          <p>Transparent pricing with no hidden fees. Rebook free if you find a cheaper fare within 24 hours.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon">⌚</div>
          <h4>Live Seat Selection</h4>
          <p>Watch availability in real time, lock seats while you pay, and choose your favourite spot on board.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon">✦</div>
          <h4>SkyMiles Rewards</h4>
          <p>Earn miles on every booking and redeem them for upgrades, lounge access and free tickets.</p>
        </div>
      </div>
    </section>

    <!-- POPULAR FLIGHTS -->
    <section class="container" *ngIf="flights.length">
      <h2 class="home-heading">Popular routes <span>right now</span></h2>
      <div class="flight-grid">
        <div class="flight-card" *ngFor="let f of flights.slice(0, 6)">
          <div class="flight-image" [style.background-image]="'url(' + getFlightImage(f) + ')'"></div>
          <div class="flight-meta">
            <h4 class="flight-route">{{ f.fromCity }} → {{ f.toCity }}</h4>
            <p style="margin:0.2rem 0; color:#38516d; font-size:0.86rem;">{{ f.flightNumber }} | {{ f.departTime }} - {{ f.arriveTime }}</p>
            <div class="chips">
              <span class="chip">{{ f.duration }}</span>
              <span class="chip">Seats: {{ f.seatsAvailable }}</span>
            </div>
            <p style="margin:0.1rem 0 0.8rem; font-size:0.88rem;">
              <b>Economy:</b> ₹{{ f.economyPrice }}
              <b style="margin-left:0.5rem;">Business:</b> ₹{{ f.businessPrice }}
            </p>
            <button (click)="book(f)">Book Now</button>
          </div>
        </div>
      </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="container home-cta-band fade-in">
      <div>
        <h2>Ready for takeoff?</h2>
        <p>Sign in to manage bookings, or create a free account to start earning SkyMiles today.</p>
      </div>
      <div class="home-cta">
        <button class="cta-primary" *ngIf="!isLoggedIn()" routerLink="/login">Login</button>
        <button class="cta-ghost" *ngIf="!isLoggedIn()" routerLink="/register">Create Account</button>
        <button class="cta-primary" *ngIf="isLoggedIn()" (click)="goFlights()">Explore Flights</button>
      </div>
    </section>
  `,
  styles: [`
    .home-hero {
      position: relative;
      width: min(1160px, 94%);
      margin: 1.8rem auto 0;
    }

    .home-hero-inner {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 2rem;
      align-items: center;
      padding: clamp(2rem, 5vw, 4rem) 0 clamp(2rem, 4vw, 3rem);
    }

    .home-hero-copy { min-width: 0; }

    .home-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      margin: 0 0 1rem;
      padding: .4rem .9rem;
      border-radius: 999px;
      border: 1px solid rgba(124, 234, 255, .35);
      background: rgba(124, 234, 255, .08);
      color: #a8f4ff;
      font-size: .8rem;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
    }

    .home-title {
      margin: 0;
      font-size: clamp(2.2rem, 5vw, 4rem);
      line-height: 1.04;
      letter-spacing: -.04em;
      color: #f2fbff;
      text-shadow: 0 4px 30px rgba(0,0,0,.4);
    }

    .home-title span {
      background: linear-gradient(100deg, #8cf4ff, #b9a6ff 55%, #ffd9a8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .home-subtitle {
      margin: 1.2rem 0 0;
      max-width: 560px;
      font-size: 1.05rem;
      line-height: 1.65;
      color: #b9d6ea;
    }

    .home-cta { display: flex; gap: .8rem; flex-wrap: wrap; margin-top: 1.6rem; }

    .cta-primary {
      background: linear-gradient(110deg, #0d79bc, #2f8ced 50%, #17bdc1);
      border: 1px solid rgba(157, 242, 255, .45);
      box-shadow: 0 14px 30px rgba(12, 120, 200, .35), inset 0 1px rgba(255,255,255,.35);
      padding: .8rem 1.5rem;
      font-size: .98rem;
    }

    .cta-ghost {
      background: transparent;
      border: 1px solid rgba(157, 242, 255, .4);
      box-shadow: none;
      padding: .8rem 1.5rem;
      font-size: .98rem;
    }

    .cta-ghost:hover { background: rgba(124, 234, 255, .1); }

    .home-quick { padding: 1.4rem; margin: 0; }

    .quick-go { width: 100%; margin-top: 1rem; }

    .home-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 1.2rem 0 1.6rem;
      border-top: 1px solid rgba(124, 234, 255, .14);
    }

    .stat {
      text-align: center;
      padding: .6rem;
    }

    .stat b {
      display: block;
      font-size: 1.6rem;
      color: #8cf4ff;
      text-shadow: 0 0 18px rgba(64, 196, 255, .45);
    }

    .stat span {
      font-size: .8rem;
      color: #93b4cc;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .home-heading {
      margin: 0 0 1.2rem;
      font-size: clamp(1.4rem, 2.6vw, 2rem);
      color: #eafaff;
      letter-spacing: -.02em;
    }

    .home-heading span {
      color: #7de8ff;
      text-shadow: 0 0 22px rgba(61, 196, 255, .5);
    }

    .features { margin-bottom: 1rem; }

    .feature { text-align: center; padding: 1.6rem 1.3rem; }

    .feature-icon {
      width: 58px;
      height: 58px;
      margin: 0 auto 1rem;
      display: grid;
      place-items: center;
      font-size: 1.5rem;
      font-weight: 800;
      color: #0b2c47;
      border-radius: 18px;
      background: linear-gradient(135deg, #8cf4ff, #b9a6ff);
      box-shadow: 0 12px 26px rgba(30, 120, 200, .35);
    }

    .feature h4 { margin: 0 0 .5rem; color: #eafaff; font-size: 1.05rem; }

    .feature p { margin: 0; color: #9dbdd3; font-size: .88rem; line-height: 1.6; }

    .home-cta-band {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding: 1.8rem 2rem;
      background: linear-gradient(120deg, rgba(14, 45, 86, .8), rgba(58, 44, 116, .72));
      border: 1px solid rgba(124, 234, 255, .22);
      border-radius: 20px;
      box-shadow: 0 24px 60px rgba(0,0,0,.25), inset 0 1px rgba(255,255,255,.12);
      margin-bottom: 2.4rem;
    }

    .home-cta-band h2 { margin: 0; color: #f2fbff; letter-spacing: -.02em; }
    .home-cta-band p { margin: .4rem 0 0; color: #a9cbe2; }
    .home-cta-band .home-cta { margin-top: 0; }

    @media (max-width: 860px) {
      .home-hero-inner { grid-template-columns: 1fr; gap: 1.4rem; }
      .home-stats { grid-template-columns: repeat(2, 1fr); }
      .home-cta-band { justify-content: center; text-align: center; }
    }
  `]
})
export class HomeComponent implements OnInit {
  from = '';
  to = '';
  quickError = '';
  flights: Flight[] = [];

  constructor(
    private flightService: FlightService,
    private session: SessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFlights();
  }

  isLoggedIn(): boolean {
    return this.session.isLoggedIn() || this.session.isAdminAuthenticated();
  }

  goFlights() {
    this.router.navigate(['/flights']);
  }

  quickSearch() {
    this.quickError = '';
    if (!this.from.trim() || !this.to.trim()) {
      this.quickError = 'Enter both departure and destination cities';
      return;
    }
    this.session.setSearchCriteria({
      from: this.from.trim().toUpperCase(),
      to: this.to.trim().toUpperCase(),
      departureDate: '',
      returnDate: '',
      tripType: 'one-way',
      cabin: '',
      adults: 1,
      children: 0,
      infants: 0
    });
    this.router.navigate(['/flights']);
  }

  book(flight: Flight) {
    this.session.setSearchCriteria({
      from: flight.fromCity,
      to: flight.toCity,
      departureDate: '',
      returnDate: '',
      tripType: 'one-way',
      cabin: '',
      adults: 1,
      children: 0,
      infants: 0
    });
    this.router.navigate(['/flights', flight.id, 'book'], {
      queryParams: { tripType: 'one-way', adults: 1, children: 0, infants: 0 }
    });
  }

  private loadFlights() {
    this.flightService.getAll().subscribe({
      next: (flights) => this.flights = flights,
      error: () => this.flights = []
    });
  }

  getFlightImage(flight: Flight): string {
    if (flight.imageUrl) return flight.imageUrl;
    const aviationImages = [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1504198266285-165a17ff13f6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1521727857535-28d204d3f5b0?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=85'
    ];
    const identifier = `${flight.id ?? ''}${flight.flightNumber}${flight.fromCity}${flight.toCity}`;
    const index = [...identifier].reduce((total, char) => total + char.charCodeAt(0), 0) % aviationImages.length;
    return aviationImages[index];
  }
}

