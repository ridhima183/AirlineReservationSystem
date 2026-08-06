import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/models';

// Maps 1:1 to com.rps.customer.CustomerController (base path /api/customers)
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private base = `${environment.apiBaseUrl}/api/customers`;

  constructor(private http: HttpClient) {}

  // POST /api/customers/register
  register(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.base}/register`, customer);
  }

  // POST /api/customers/login  body: { email, password }
  login(email: string, password: string): Observable<Customer> {
    return this.http.post<Customer>(`${this.base}/login`, { email, password });
  }

  // PUT /api/customers/{id}/password  body: { password }
  resetPassword(id: number, password: string): Observable<Customer> {
    return this.http.put<Customer>(`${this.base}/${id}/password`, { password });
  }

  // GET /api/customers/{id}
  getProfile(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.base}/${id}`);
  }

  // GET /api/customers
  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.base);
  }
}
