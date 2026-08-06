import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../core/services/flight.service';
import { SessionService } from '../../core/services/session.service';
import { Flight, FlightSearchCriteria } from '../../core/models/models';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="hero-card fade-in" style="background-image:url('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=1600&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">Find Your Next Flight</h2>
          <p class="hero-subtitle">Compare routes, timings and fares in one view. Pick a cabin and continue to instant booking.</p>
        </div>
      </div>

      <div class="card fade-in">
        <h3 class="section-title">Flight Search</h3>
        
        <!-- Trip Type Selection -->
        <div style="margin-bottom:1rem;">
          <label style="margin-right:1rem;">Trip Type:</label>
          <label class="radio-label">
            <input type="radio" [(ngModel)]="searchCriteria.tripType" value="one-way" (change="onTripTypeChange()"> One Way
          </label>
          <label class="radio-label" style="margin-left:1rem;">
            <input type="radio" [(ngModel)]="searchCriteria.tripType" value="return" (change="onTripTypeChange()"> Return
          </label>
        </div>

        <div class="grid-3">
          <div>
            <label>From</label>
            <input [(ngModel)]="searchCriteria.from" placeholder="e.g. DEL">
          </div>
          <div>
            <label>To</label>
            <input [(ngModel)]="searchCriteria.to" placeholder="e.g. BOM">
          </div>
          <div>
            <label>Cabin Class</label>
            <select [(ngModel)]="searchCriteria.cabin">
              <option value="">All Classes</option>
              <option value="one-way">One Way</option>
              <option value="round-trip">Round Trip</option>
            </select>
          </div>
        </div>

        <div class="grid-3" style="margin-top:0.8rem;">
          <div>
            <label>Departure Date</label>
            <input [(ngModel)]="searchCriteria.departureDate" type="date" [min]="today">
          </div>
          <div *ngIf="searchCriteria.tripType === 'return'">
            <label>Return Date</label>
            <input [(ngModel)]="searchCriteria.returnDate" type="date" [min]="searchCriteria.departureDate">
          </div>
          <div>
            <label>&nbsp;</label>
            <button (click)="search()" style="width:100%;">Search Flights</button>
          </div>
        </div>

        <!-- Passenger Count -->
        <div class="grid-3" style="margin-top:0.8rem;">
          <div>
            <label>Adults (12+)</label>
            <input type="number" min="1" max="9" [(ngModel)]="searchCriteria.adults">
          </div>
          <div>
            <label>Children (2-11)</label>
            <input type="number" min="0" max="9" [(ngModel)]="searchCriteria.children">
          </div>
          <div>
            <label>Infants (<2)</label>
            <input type="number" min="0" max="2" [(ngModel)]="searchCriteria.infants">
          </div>
        </div>

        <p class="error" *ngIf="error" style="margin-top:0.8rem;">{{ error }}</p>
      </div>

      <div class="card" *ngIf="results.length">
        <h3 class="section-title">Available Flights ({{ results.length }} found)</h3>
        <div class="flight-grid">
          <div class="flight-card" *ngFor="let f of results">
            <div class="flight-image" [style.background-image]="'url(' + getFlightImage(f) + ')'">
            </div>
            <div class="flight-meta">
              <h4 class="flight-route">{{ f.fromCity }} → {{ f.toCity }}</h4>
              <p style="margin:0.2rem 0; color:#38516d; font-size:0.86rem;">{{ f.flightNumber }} | {{ f.departTime }} - {{ f.arriveTime }}</p>
              <div class="chips">
                <span class="chip">{{ f.duration }}</span>
                <span class="chip">Seats: {{ f.seatsAvailable }}</span>
                <span class="chip" *ngIf="f.travelDate">{{ f.travelDate }}</span>
              </div>
              <p style="margin:0.1rem 0 0.8rem; font-size:0.88rem;">
                <b>Economy:</b> ₹{{ f.economyPrice }} 
                <b style="margin-left:0.5rem;">Business:</b> ₹{{ f.businessPrice }}
              </p>
              <button (click)="select(f)">Select Flight</button>
            </div>
          </div>
        </div>
      </div>

      <div class="card" *ngIf="searched && !results.length && !error">
        {{ searchCriteria.from || searchCriteria.to ? 'No flights found for this route.' : 'No flights available right now.' }}
      </div>
    </div>
  `,
  styles: [`
    .radio-label {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      cursor: pointer;
      font-weight: 600;
      color: var(--ink-700);
    }
    .radio-label input[type="radio"] {
      width: auto;
      margin: 0;
    }
  `]
})
export class FlightSearchComponent implements OnInit {
  searchCriteria: FlightSearchCriteria = {
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    tripType: 'one-way',
    cabin: '',
    adults: 1,
    children: 0,
    infants: 0
  };
  results: Flight[] = [];
  searched = false;
  error = '';
  today = new Date().toISOString().split('T')[0];

  constructor(private flightService: FlightService, private session: SessionService, private router: Router) {}

  ngOnInit() {
    this.loadAllFlights();
  }

  onTripTypeChange() {
    if (this.searchCriteria.tripType === 'one-way') {
      this.searchCriteria.returnDate = '';
    }
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

  search() {
    this.error = '';
    if (!this.searchCriteria.from || !this.searchCriteria.to) {
      this.error = 'Please enter both departure and destination cities';
      return;
    }
    const totalPassengers = this.searchCriteria.adults + this.searchCriteria.children + this.searchCriteria.infants;
    if (totalPassengers < 1) {
      this.error = 'At least one passenger is required';
      return;
    }
    if (this.searchCriteria.infants > this.searchCriteria.adults) {
      this.error = 'Number of infants cannot exceed number of adults';
      return;
    }

    this.flightService.search(
      this.searchCriteria.from, 
      this.searchCriteria.to, 
      this.searchCriteria.departureDate || undefined,
      this.searchCriteria.cabin || undefined
    ).subscribe({
      next: (flights) => { 
        this.results = flights; 
        this.searched = true; 
      },
      error: () => this.error = 'Search failed'
    });
  }

  private loadAllFlights() {
    this.error = '';
    this.flightService.getAll().subscribe({
      next: (flights) => { this.results = flights; this.searched = true; },
      error: () => this.error = 'Unable to load available flights'
    });
  }

  select(flight: Flight) {
    // Store search criteria in session for use in booking
    this.session.setSearchCriteria(this.searchCriteria);
    this.router.navigate(['/flights', flight.id, 'book'], { 
      queryParams: { 
        tripType: this.searchCriteria.tripType,
        adults: this.searchCriteria.adults,
        children: this.searchCriteria.children,
        infants: this.searchCriteria.infants
      } 
    });
  }
}
