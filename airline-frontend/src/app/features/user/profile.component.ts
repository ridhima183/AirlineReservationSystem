import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { SessionService } from '../../core/services/session.service';
import { Booking, Receipt } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="hero-card fade-in" style="background-image:url('https://images.unsplash.com/photo-1504198266285-165a17ff13f6?auto=format&fit=crop&w=1600&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">My Profile</h2>
          <p class="hero-subtitle">Manage your account and view your booking history.</p>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="card" *ngIf="customer">
        <h3 class="section-title">Account Information</h3>
        <div class="grid-3">
          <div>
            <span class="profile-label">Name</span>
            <p class="profile-value">{{ customer.title }} {{ customer.firstName }} {{ customer.lastName }}</p>
          </div>
          <div>
            <span class="profile-label">Email</span>
            <p class="profile-value">{{ customer.email }}</p>
          </div>
          <div>
            <span class="profile-label">Phone</span>
            <p class="profile-value">{{ customer.phoneNumber }}</p>
          </div>
        </div>
      </div>

      <!-- Booking History -->
      <div class="card">
        <h3 class="section-title">My Bookings</h3>
        
        <div *ngIf="bookings.length === 0" style="text-align:center; padding:2rem; color:#38516d;">
          <p>No bookings found. <a routerLink="/flights" class="action-link">Book your first flight</a></p>
        </div>

        <div class="booking-list" *ngIf="bookings.length > 0">
          <div class="booking-item" *ngFor="let booking of bookings">
            <div class="booking-header">
              <span class="booking-ticket">{{ booking.ticketNumber }}</span>
              <span class="status-badge" [ngClass]="{
                'status-booked': booking.status === 'BOOKED',
                'status-waitlisted': booking.status === 'WAITLISTED',
                'status-cancelled': booking.status === 'CANCELLED'
              }">{{ booking.status }}</span>
            </div>
            <div class="booking-details">
              <p><b>Flight ID:</b> {{ booking.flightId }}</p>
              <p><b>Seats:</b> {{ booking.seatNumbers }}</p>
              <p><b>Class:</b> {{ booking.travelClass | titlecase }}</p>
              <p><b>Passengers:</b> {{ booking.passengerNames }}</p>
              <p><b>Amount:</b> ₹{{ booking.amountPaid }}</p>
              <p><b>Date:</b> {{ booking.issueDate | date:'dd-MMM-yyyy HH:mm' }}</p>
            </div>
            <div class="booking-actions">
              <button class="secondary" (click)="viewReceipt(booking)">View Receipt</button>
              <button class="secondary" *ngIf="booking.status === 'BOOKED'" (click)="cancelBooking(booking.id!)">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Receipt Modal -->
      <div class="modal-overlay" *ngIf="showReceipt && selectedReceipt" (click)="showReceipt = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="receipt" *ngIf="selectedReceipt">
            <div class="receipt-header">
              <h4>{{ selectedReceipt.airlineName }}</h4>
              <p class="receipt-subtitle">E-Ticket Receipt</p>
            </div>
            <div class="receipt-grid">
              <div class="receipt-item"><span class="receipt-label">Ticket Number</span><span class="receipt-value"><b>{{ selectedReceipt.ticketNumber }}</b></span></div>
              <div class="receipt-item"><span class="receipt-label">Transaction ID</span><span class="receipt-value">{{ selectedReceipt.transactionId }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Flight</span><span class="receipt-value">{{ selectedReceipt.flightNumber }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Route</span><span class="receipt-value">{{ selectedReceipt.route }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Departure</span><span class="receipt-value">{{ selectedReceipt.departureTime }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Arrival</span><span class="receipt-value">{{ selectedReceipt.arrivalTime }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Duration</span><span class="receipt-value">{{ selectedReceipt.duration }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Travel Date</span><span class="receipt-value">{{ selectedReceipt.travelDate }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Class</span><span class="receipt-value">{{ selectedReceipt.travelClass }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Trip Type</span><span class="receipt-value">{{ selectedReceipt.tripType }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Passengers</span><span class="receipt-value">{{ selectedReceipt.passengerNames }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Seats</span><span class="receipt-value"><b>{{ selectedReceipt.seatNumbers }}</b></span></div>
              <div class="receipt-item"><span class="receipt-label">Adults</span><span class="receipt-value">{{ selectedReceipt.numAdults }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Children</span><span class="receipt-value">{{ selectedReceipt.numChildren }}</span></div>
              <div class="receipt-item"><span class="receipt-label">Infants</span><span class="receipt-value">{{ selectedReceipt.numInfants }}</span></div>
              <div class="receipt-item total"><span class="receipt-label">Amount Paid</span><span class="receipt-value"><b>₹{{ selectedReceipt.amountPaid }}</b></span></div>
            </div>
            <div class="receipt-footer">
              <p>Issued: {{ selectedReceipt.issueDate }}</p>
              <p>Status: {{ selectedReceipt.status }}</p>
            </div>
          </div>
          <div style="margin-top:1rem; display:flex; gap:0.6rem;">
            <button (click)="printReceipt()">Print</button>
            <button class="secondary" (click)="showReceipt = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-label {
      font-size: 0.75rem;
      color: #38516d;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .profile-value {
      margin: 0.3rem 0 0;
      font-size: 1rem;
      color: var(--ink-900);
      font-weight: 600;
    }
    .booking-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .booking-item {
      background: #f8fafc;
      border-radius: 12px;
      padding: 1rem;
      border: 1px solid rgba(56, 81, 109, 0.1);
    }
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
    }
    .booking-ticket {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--sky-900);
    }
    .status-booked { background: #d6efe2; color: #1e6c41; }
    .status-waitlisted { background: #ffe8cc; color: #e67700; }
    .status-cancelled { background: #ffe3e3; color: #b4232f; }
    .booking-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.5rem;
      font-size: 0.88rem;
    }
    .booking-details p {
      margin: 0.2rem 0;
      color: #38516d;
    }
    .booking-actions {
      margin-top: 0.8rem;
      display: flex;
      gap: 0.5rem;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(12, 39, 71, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }
    .receipt { /* Reuse receipt styles from booking component */
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .receipt-header {
      text-align: center;
      border-bottom: 2px dashed #e0e0e0;
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
    .receipt-header h4 { margin: 0; color: var(--sky-900); font-size: 1.2rem; }
    .receipt-subtitle { color: #38516d; font-size: 0.85rem; margin-top: 0.3rem; }
    .receipt-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.8rem; }
    .receipt-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .receipt-label { font-size: 0.75rem; color: #38516d; text-transform: uppercase; letter-spacing: 0.03em; }
    .receipt-value { font-size: 0.95rem; color: var(--ink-900); }
    .receipt-item.total { grid-column: span 2; flex-direction: row; justify-content: space-between; padding-top: 0.8rem; border-top: 2px solid #e0e0e0; margin-top: 0.5rem; }
    .receipt-item.total .receipt-value { font-size: 1.3rem; color: #186a3b; }
    .receipt-footer { margin-top: 1rem; padding-top: 1rem; border-top: 2px dashed #e0e0e0; text-align: center; font-size: 0.8rem; color: #38516d; }
    
    @media print {
      .modal-overlay { position: static; background: none; }
      .modal-content { box-shadow: none; border: none; }
      button { display: none !important; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  customer: any = null;
  bookings: Booking[] = [];
  showReceipt = false;
  selectedReceipt: Receipt | null = null;

  constructor(
    private session: SessionService,
    private bookingService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.customer = this.session.getCustomer();
    if (!this.customer) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadBookings();
  }

  loadBookings() {
    if (this.customer?.id) {
      this.bookingService.getByCustomer(this.customer.id).subscribe({
        next: (bookings) => this.bookings = bookings,
        error: () => this.bookings = []
      });
    }
  }

  viewReceipt(booking: Booking) {
    this.bookingService.getById(booking.id!).subscribe({
      next: (response) => {
        if (response.receipt) {
          this.selectedReceipt = response.receipt;
          this.showReceipt = true;
        }
      }
    });
  }

  cancelBooking(id: number) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancel(id).subscribe({
        next: () => {
          this.loadBookings();
          alert('Booking cancelled successfully. Refund will be processed.');
        },
        error: (err) => alert('Cancellation failed: ' + (err?.error?.error || 'Unknown error'))
      });
    }
  }

  printReceipt() {
    window.print();
  }
}