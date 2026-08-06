import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { Customer } from '../../core/models/models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container auth-shell fade-in">
      <div class="hero-card auth-card" style="background-image:url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1500&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">Create Your Traveler Profile</h2>
          <p class="hero-subtitle">Join now to unlock quick bookings, easy cancellation, and one-dashboard ticket tracking.</p>
        </div>
      </div>

      <div class="card auth-card">
        <h3 class="section-title">Register</h3>
        <div class="grid-3">
          <div>
            <label>Title</label>
            <select [(ngModel)]="model.title">
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Mrs">Mrs</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
          </div>
          <div>
            <label>First Name</label>
            <input [(ngModel)]="model.firstName" placeholder="Enter first name">
          </div>
          <div>
            <label>Last Name</label>
            <input [(ngModel)]="model.lastName" placeholder="Enter last name">
          </div>
        </div>

        <div class="grid-2" style="margin-top:0.8rem;">
          <div>
            <label>Email</label>
            <input [(ngModel)]="model.email" type="email" placeholder="you@example.com">
          </div>
          <div>
            <label>Password</label>
            <input [(ngModel)]="model.password" type="password" placeholder="Min 8 chars, 1 uppercase, 1 special char, 1 digit">
          </div>
        </div>

        <div class="grid-2" style="margin-top:0.8rem;">
          <div>
            <label>Confirm Password</label>
            <input [(ngModel)]="confirmPassword" type="password" placeholder="Re-enter password">
          </div>
          <div>
            <label>Date of Birth</label>
            <input [(ngModel)]="model.dateOfBirth" type="date">
          </div>
        </div>

        <div style="margin-top:0.8rem;">
          <label>Phone Number</label>
          <input [(ngModel)]="model.phoneNumber" placeholder="+91-XXXXXXXXXX" maxlength="13">
        </div>

        <!-- Password strength indicator -->
        <div class="password-strength" *ngIf="model.password">
          <div class="strength-bar">
            <div class="strength-fill" [ngClass]="passwordStrengthClass"></div>
          </div>
          <span class="strength-text" [ngClass]="passwordStrengthClass">{{ passwordStrengthText }}</span>
        </div>

        <div style="margin-top:1rem; display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
          <button (click)="signUp()" [disabled]="!isValid()">Create Account</button>
          <a class="action-link" style="background:#edf4fb; color:#224564;" routerLink="/login">Already have an account?</a>
        </div>

        <p class="error" *ngIf="error" style="margin-top:0.8rem;">{{ error }}</p>
        <p class="success" *ngIf="success" style="margin-top:0.8rem;">Registered! You can now log in.</p>
      </div>
    </div>
  `,
  styles: [`
    .password-strength {
      margin-top: 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .strength-bar {
      flex: 1;
      height: 6px;
      background: #e0e0e0;
      border-radius: 3px;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
    }
    .strength-fill.weak { width: 25%; background: #b4232f; }
    .strength-fill.fair { width: 50%; background: #e67700; }
    .strength-fill.good { width: 75%; background: #2b8a3e; }
    .strength-fill.strong { width: 100%; background: #186a3b; }
    .strength-text {
      font-size: 0.75rem;
      font-weight: 600;
      min-width: 50px;
    }
    .strength-text.weak { color: #b4232f; }
    .strength-text.fair { color: #e67700; }
    .strength-text.good { color: #2b8a3e; }
    .strength-text.strong { color: #186a3b; }
  `]
})
export class RegisterComponent {
  model: Customer = { title: '', firstName: '', lastName: '', email: '', password: '', dateOfBirth: '', phoneNumber: '' };
  confirmPassword = '';
  error = '';
  success = false;

  constructor(private customerService: CustomerService, private router: Router) {}

  // Password validation: min 8 chars, 1 uppercase, 1 special char, 1 digit
  isValidPassword(password: string): boolean {
    const pattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/;
    return pattern.test(password);
  }

  getPasswordStrength(password: string): { class: string; text: string } {
    if (!password) return { class: '', text: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score <= 1) return { class: 'weak', text: 'Weak' };
    if (score === 2) return { class: 'fair', text: 'Fair' };
    if (score === 3) return { class: 'good', text: 'Good' };
    return { class: 'strong', text: 'Strong' };
  }

  get passwordStrengthClass(): string {
    return this.getPasswordStrength(this.model.password).class;
  }

  get passwordStrengthText(): string {
    return this.getPasswordStrength(this.model.password).text;
  }

  isValid(): boolean {
    if (!this.model.title || !this.model.firstName || !this.model.lastName || !this.model.email || !this.model.password || !this.model.dateOfBirth || !this.model.phoneNumber) {
      return false;
    }
    if (this.model.password !== this.confirmPassword) {
      return false;
    }
    if (!this.isValidPassword(this.model.password)) {
      return false;
    }
    return true;
  }

  signUp() {
    this.error = '';
    if (!this.isValid()) {
      if (this.model.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      if (!this.isValidPassword(this.model.password)) {
        this.error = 'Password must be at least 8 characters, contain one uppercase letter, one special character and one digit';
        return;
      }
      return;
    }
    this.customerService.register(this.model).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/login']), 1200); },
      error: (err) => this.error = err?.error?.error || 'Registration failed'
    });
  }
}
