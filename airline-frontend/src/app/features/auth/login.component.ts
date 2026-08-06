import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container auth-shell fade-in">
      <div class="hero-card auth-card" style="background-image:url('https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1500&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">Welcome Back On Board</h2>
          <p class="hero-subtitle">Sign in to manage reservations, track ticket status, and complete bookings in a few clicks.</p>
        </div>
      </div>

      <div class="card auth-card">
        <h3 class="section-title">Login</h3>
        <div class="grid-2">
          <div>
            <label>Email or username</label>
            <input [(ngModel)]="email" type="text" placeholder="you@example.com">
          </div>
          <div>
            <label>Password</label>
            <input [(ngModel)]="password" type="password" placeholder="Enter password">
          </div>
        </div>
        <div style="margin-top:1rem; display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
          <button (click)="login()">Login</button>
          <a class="action-link" style="background:#edf4fb; color:#224564;" routerLink="/register">Create account</a>
        </div>
        <p class="error" *ngIf="error" style="margin-top:0.8rem;">{{ error }}</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private customerService: CustomerService, private session: SessionService, private router: Router) {}

  login() {
    this.error = '';
    const identifier = this.email.trim().toLowerCase();

    if ((identifier === 'admin' || identifier === 'admin@skyroute.com') && this.password === 'admin123') {
      this.session.setAdminAuthenticated();
      this.router.navigate(['/admin']);
      return;
    }

    this.customerService.login(this.email, this.password).subscribe({
      next: (customer) => { this.session.setCustomer(customer); this.router.navigate(['/flights']); },
      error: (err) => this.error = err?.error?.error || 'Invalid credentials'
    });
  }
}
