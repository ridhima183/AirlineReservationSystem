import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container auth-shell fade-in">
      <div class="hero-card auth-card" style="background-image:url('https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1500&q=80'); background-size:cover; background-position:center;">
        <div class="hero-card-content">
          <h2 class="hero-title">Reset Your Password</h2>
          <p class="hero-subtitle">Enter your email and new password to regain access to your account.</p>
        </div>
      </div>

      <div class="card auth-card">
        <h3 class="section-title">Forgot Password</h3>
        
        <div *ngIf="step === 1">
          <p style="margin-bottom:1rem; color:#38516d;">Enter your registered email address to receive password reset instructions.</p>
          <div>
            <label>Email Address</label>
            <input [(ngModel)]="email" type="email" placeholder="you@example.com">
          </div>
          <div style="margin-top:1rem; display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
            <button (click)="sendResetLink()">Send Reset Link</button>
            <a class="action-link" style="background:#edf4fb; color:#224564;" routerLink="/login">Back to Login</a>
          </div>
        </div>

        <div *ngIf="step === 2">
          <p style="margin-bottom:1rem; color:#38516d;">Enter your new password below. It must meet the security requirements.</p>
          
          <div>
            <label>New Password</label>
            <input [(ngModel)]="newPassword" type="password" placeholder="Min 8 chars, 1 uppercase, 1 special char, 1 digit">
          </div>
          
          <div style="margin-top:0.8rem;">
            <label>Confirm New Password</label>
            <input [(ngModel)]="confirmPassword" type="password" placeholder="Re-enter new password">
          </div>

          <!-- Password strength indicator -->
          <div class="password-strength" *ngIf="newPassword">
            <div class="strength-bar">
              <div class="strength-fill" [ngClass]="passwordStrengthClass"></div>
            </div>
            <span class="strength-text" [ngClass]="passwordStrengthClass">{{ passwordStrengthText }}</span>
          </div>

          <div style="margin-top:1rem; display:flex; gap:0.6rem; align-items:center; flex-wrap:wrap;">
            <button (click)="resetPassword()" [disabled]="!isValid()">Reset Password</button>
            <a class="action-link" style="background:#edf4fb; color:#224564;" routerLink="/login">Back to Login</a>
          </div>
        </div>

        <p class="error" *ngIf="error" style="margin-top:0.8rem;">{{ error }}</p>
        <p class="success" *ngIf="success" style="margin-top:0.8rem;">{{ success }}</p>
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
export class ForgotPasswordComponent {
  email = '';
  newPassword = '';
  confirmPassword = '';
  step = 1;
  error = '';
  success = '';
  userId: number | null = null;

  constructor(
    private customerService: CustomerService,
    private session: SessionService,
    private router: Router
  ) {}

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
    return this.getPasswordStrength(this.newPassword).class;
  }

  get passwordStrengthText(): string {
    return this.getPasswordStrength(this.newPassword).text;
  }

  isValid(): boolean {
    if (!this.newPassword || !this.confirmPassword) return false;
    if (this.newPassword !== this.confirmPassword) return false;
    if (!this.isValidPassword(this.newPassword)) return false;
    return true;
  }

  sendResetLink() {
    this.error = '';
    this.success = '';
    
    if (!this.email) {
      this.error = 'Please enter your email address';
      return;
    }

    // Check if user exists by trying to login (in real app, this would be a separate endpoint)
    this.customerService.login(this.email, 'dummy').subscribe({
      next: (customer) => {
        // User exists
        this.userId = customer.id || null;
        this.step = 2;
        this.success = 'Email verified. Please enter your new password.';
      },
      error: () => {
        this.error = 'No account found with this email address';
      }
    });
  }

  resetPassword() {
    this.error = '';
    this.success = '';

    if (!this.isValid()) {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      if (!this.isValidPassword(this.newPassword)) {
        this.error = 'Password must be at least 8 characters, contain one uppercase letter, one special character and one digit';
        return;
      }
      return;
    }

    if (!this.userId) {
      this.error = 'User not found. Please try again.';
      return;
    }

    this.customerService.resetPassword(this.userId, this.newPassword).subscribe({
      next: () => {
        this.success = 'Password reset successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err?.error?.error || 'Failed to reset password';
      }
    });
  }
}