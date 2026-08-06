import { Injectable } from '@angular/core';
import { Customer, FlightSearchCriteria } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private key = 'airline_customer';
  private adminKey = 'airline_admin_authenticated';
  private searchKey = 'airline_search_criteria';
  private sessionTokenKey = 'airline_session_token';

  setCustomer(customer: Customer) {
    localStorage.setItem(this.key, JSON.stringify(customer));
  }

  getCustomer(): Customer | null {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCustomer();
  }

  setAdminAuthenticated() {
    localStorage.setItem(this.adminKey, 'true');
  }

  isAdminAuthenticated(): boolean {
    return localStorage.getItem(this.adminKey) === 'true';
  }

  // Search criteria storage
  setSearchCriteria(criteria: FlightSearchCriteria) {
    localStorage.setItem(this.searchKey, JSON.stringify(criteria));
  }

  getSearchCriteria(): FlightSearchCriteria | null {
    const raw = localStorage.getItem(this.searchKey);
    return raw ? JSON.parse(raw) : null;
  }

  clearSearchCriteria() {
    localStorage.removeItem(this.searchKey);
  }

  // Session token for seat locking
  generateSessionToken(): string {
    const token = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(this.sessionTokenKey, token);
    return token;
  }

  getSessionToken(): string | null {
    return localStorage.getItem(this.sessionTokenKey);
  }

  clearSessionToken() {
    localStorage.removeItem(this.sessionTokenKey);
  }

  logout() {
    localStorage.removeItem(this.key);
    localStorage.removeItem(this.adminKey);
    localStorage.removeItem(this.searchKey);
    localStorage.removeItem(this.sessionTokenKey);
  }
}
