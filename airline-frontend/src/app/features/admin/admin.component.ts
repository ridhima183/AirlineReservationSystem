import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightService } from '../../core/services/flight.service';
import { Flight } from '../../core/models/models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="hero-card fade-in" style="background-image:url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">Operations Dashboard</h2>
          <p class="hero-subtitle">Create flights, monitor inventory and keep schedules updated for customers in real time.</p>
        </div>
      </div>

      <div class="card">
        <h3 class="section-title">Add Flight</h3>
        <div class="grid-3">
          <div>
            <label>Flight Number</label>
            <input [(ngModel)]="newFlight.flightNumber">
          </div>
          <div>
            <label>From</label>
            <input [(ngModel)]="newFlight.fromCity">
          </div>
          <div>
            <label>To</label>
            <input [(ngModel)]="newFlight.toCity">
          </div>
        </div>

        <div class="grid-3" style="margin-top:0.8rem;">
          <div>
            <label>Depart Time</label>
            <input [(ngModel)]="newFlight.departTime" placeholder="09:00">
          </div>
          <div>
            <label>Arrive Time</label>
            <input [(ngModel)]="newFlight.arriveTime" placeholder="11:00">
          </div>
          <div>
            <label>Duration</label>
            <input [(ngModel)]="newFlight.duration" placeholder="2h">
          </div>
        </div>

        <div class="grid-3" style="margin-top:0.8rem;">
          <div>
            <label>Cabin (one-way / round-trip)</label>
            <input [(ngModel)]="newFlight.cabin">
          </div>
          <div>
            <label>Economy Price</label>
            <input type="number" [(ngModel)]="newFlight.economyPrice">
          </div>
          <div>
            <label>Business Price</label>
            <input type="number" [(ngModel)]="newFlight.businessPrice">
          </div>
        </div>

        <div style="margin-top:0.8rem; max-width:280px;">
          <label>Seats Available</label>
          <input type="number" [(ngModel)]="newFlight.seatsAvailable">
        </div>

        <div class="image-upload" style="margin-top:1rem;">
          <label for="destination-image">Destination image</label>
          <input id="destination-image" type="file" accept="image/png,image/jpeg,image/webp" (change)="onImageSelected($event)">
          <p class="image-upload-note">PNG, JPG or WebP · up to 2 MB</p>
          <img *ngIf="newFlight.imageUrl" class="destination-preview" [src]="newFlight.imageUrl" alt="Selected destination preview">
        </div>

        <div style="margin-top:1rem;">
          <button (click)="add()">Add Flight</button>
        </div>
        <p class="error" *ngIf="error" style="margin-top:0.8rem;">{{ error }}</p>
      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-bottom:0.8rem;">
          <h3 class="section-title" style="margin:0;">All Flights</h3>
          <button class="secondary" (click)="load()">Refresh</button>
        </div>
        <div class="table-wrap">
          <table>
            <tr><th>ID</th><th>Flight</th><th>Route</th><th>Seats</th><th>Action</th></tr>
            <tr *ngFor="let f of flights">
              <td>{{ f.id }}</td>
              <td>{{ f.flightNumber }}</td>
              <td>{{ f.fromCity }} → {{ f.toCity }}</td>
              <td>{{ f.seatsAvailable }}</td>
              <td><button class="secondary" (click)="remove(f.id!)">Delete</button></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  flights: Flight[] = [];
 newFlight: Flight = {
  flightNumber: '',
  fromCity: '',
  toCity: '',
  departTime: '',
  arriveTime: '',
  duration: '',
  cabin: '',
  economyPrice: 0,
  businessPrice: 0,
  totalSeats: 60,
  seatsAvailable: 60,
  travelDate: '',
  returnDate: '',
  lockedSeats: [],
  bookedSeats: []
};
  error = '';

  constructor(private flightService: FlightService) {}

  ngOnInit() { this.load(); }

  load() {
    this.flightService.getAll().subscribe({ next: (f) => this.flights = f });
  }

  add() {
    this.error = '';
    this.flightService.add(this.newFlight).subscribe({
      next: () => { this.load(); this.resetForm(); },
      error: () => this.error = 'Failed to add flight'
    });
  }

  onImageSelected(event: Event) {
    this.error = '';
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.error = 'Choose an image smaller than 2 MB';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.newFlight.imageUrl = String(reader.result);
    reader.readAsDataURL(file);
  }

  private resetForm() {
    this.newFlight = {
      flightNumber: '', fromCity: '', toCity: '', departTime: '', arriveTime: '', duration: '', cabin: '',
      economyPrice: 0, businessPrice: 0, totalSeats: 60, seatsAvailable: 60, travelDate: '', returnDate: '',
      lockedSeats: [], bookedSeats: []
    };
  }

  remove(id: number) {
    this.flightService.delete(id).subscribe({ next: () => this.load() });
  }
}
