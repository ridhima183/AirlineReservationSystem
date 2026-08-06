import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { Booking } from '../../core/models/models';

@Component({
  selector: 'app-enquiry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="hero-card fade-in" style="background-image:url('https://images.unsplash.com/photo-1504198266285-165a17ff13f6?auto=format&fit=crop&w=1600&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">Booking Enquiry</h2>
          <p class="hero-subtitle">Retrieve your ticket instantly and cancel with automatic refund calculation.</p>
        </div>
      </div>

      <div class="card">
        <h3 class="section-title">Find Booking</h3>
        <label>Ticket Number</label>
        <input [(ngModel)]="ticketNumber" placeholder="TCK-XXXXXXXX">
        <div style="margin-top:0.9rem;">
          <button (click)="lookup()">Find Booking</button>
        </div>
        <p class="error" *ngIf="error" style="margin-top:0.7rem;">{{ error }}</p>
      </div>

      <div class="card" *ngIf="booking">
        <h3 class="section-title">Ticket Details</h3>
        <p><b>Ticket:</b> {{ booking.ticketNumber }}</p>
        <p><b>Status:</b> <span class="status-badge">{{ booking.status }}</span></p>
        <p><b>Passengers:</b> {{ booking.passengerNames }}</p>
        <p><b>Seats:</b> {{ booking.seatNumbers }}</p>
        <p><b>Class:</b> {{ booking.travelClass }}</p>
        <p><b>Amount Paid:</b> ₹{{ booking.amountPaid }}</p>
        <p><b>Issued:</b> {{ booking.issueDate }}</p>

        <div style="margin-top:0.9rem; display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
          <button *ngIf="booking.status !== 'CANCELLED'" (click)="cancel()">Cancel Booking</button>
          <p class="success" *ngIf="refund !== null">Cancelled. Refund amount: ₹{{ refund }}</p>
        </div>
      </div>
    </div>
  `
})
export class EnquiryComponent implements OnInit {
  ticketNumber = '';
  booking?: Booking;
  refund: number | null = null;
  error = '';

  constructor(private bookingService: BookingService, private route: ActivatedRoute) {}

  ngOnInit() {
    const t = this.route.snapshot.queryParamMap.get('ticket');
    if (t) { this.ticketNumber = t; this.lookup(); }
  }
lookup() {
  this.error = '';
  this.refund = null;

  this.bookingService.getByTicket(this.ticketNumber).subscribe({
    next: (response) => {
      this.booking = response.booking;
    },
    error: () => {
      this.error = 'Booking not found';
      this.booking = undefined;
    }
  });
}

  cancel() {
    if (!this.booking?.id) return;
    this.bookingService.cancel(this.booking.id).subscribe({
      next: (res) => { this.booking = res.booking; this.refund = res.refundAmount; },
      error: (err) => this.error = err?.error?.error || 'Cancellation failed'
    });
  }
}
