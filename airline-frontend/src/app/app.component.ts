import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SessionService } from './core/services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-shell">
      <div class="sky-scene" aria-hidden="true">
        <div class="sky-layer sky-layer-back"></div>
        <div class="sky-layer sky-layer-mid"></div>
        <div class="cloud cloud-a"></div>
        <div class="cloud cloud-b"></div>
        <div class="cloud cloud-c"></div>
        <div class="sun-halo"></div>
        <div class="orbital orbital-one"></div>
        <div class="orbital orbital-two"></div>
        <div class="plane-wrap plane-far">
          <div class="plane-trail"></div>
          <div class="plane-body"></div>
          <div class="plane-wing"></div>
          <div class="plane-tail"></div><div class="plane-engine engine-one"></div><div class="plane-engine engine-two"></div>
        </div>
        <div class="plane-wrap plane-main">
          <div class="plane-trail"></div>
          <div class="plane-body"></div>
          <div class="plane-wing"></div>
          <div class="plane-tail"></div><div class="plane-engine engine-one"></div><div class="plane-engine engine-two"></div>
        </div>
        <div class="plane-wrap plane-near">
          <div class="plane-trail"></div>
          <div class="plane-body"></div>
          <div class="plane-wing"></div>
          <div class="plane-tail"></div><div class="plane-engine engine-one"></div><div class="plane-engine engine-two"></div>
        </div>
      </div>

      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" routerLink="/"><span class="brand-mark">✦</span><span>SkyRoute</span><small>OS</small></a>

          <nav class="topbar-nav">
            <a *ngIf="session.isLoggedIn() || session.isAdminAuthenticated()" routerLink="/flights"><span>Explore</span><i>Flights</i></a>
            <a *ngIf="session.isLoggedIn()" routerLink="/enquiry"><span>Journey</span><i>Bookings</i></a>
            <a *ngIf="session.isLoggedIn()" routerLink="/profile"><span>Account</span><i>Profile</i></a>
            <a routerLink="/about"><span>About</span><i>Us</i></a>
            <a routerLink="/help"><span>Help</span><i>Support</i></a>
            <ng-container *ngIf="!session.isLoggedIn() && !session.isAdminAuthenticated()">
              <a routerLink="/login">Login</a>
              <a routerLink="/register">Register</a>
            </ng-container>
          </nav>

          <div class="topbar-user" *ngIf="session.isLoggedIn() || session.isAdminAuthenticated()">
            <span class="connection-dot"></span><span>Welcome, {{ session.isAdminAuthenticated() ? 'Admin' : session.getCustomer()?.firstName }}</span>
            <span class="logout-link" (click)="logout()">Logout</span>
          </div>
        </div>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="app-footer-inner">
          <p>SkyRoute Airways • Smooth booking, smart travel, better journeys.</p>
          <p>Support: support&#64;skyroute.com | Helpline: +91 1800-2026-777</p>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  constructor(public session: SessionService, private router: Router) {}
  logout() { this.session.logout(); this.router.navigate(['/login']); }
}
