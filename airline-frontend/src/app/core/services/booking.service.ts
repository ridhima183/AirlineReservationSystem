import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, CancelResult, BookingResponse } from '../models/models';

// Maps 1:1 to com.rps.flight.BookingController (base path /api/bookings)
@Injectable({ providedIn: 'root' })
export class BookingService {
  private base = `${environment.apiBaseUrl}/api/bookings`;

  constructor(private http: HttpClient) {}

  // POST /api/bookings   (Seat select + Payment -> books or waitlists)
  book(booking: Booking): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.base, booking);
  }

  // DELETE /api/bookings/{id}   (Cancellation module, returns refund amount)
  cancel(id: number): Observable<CancelResult> {
    return this.http.delete<CancelResult>(`${this.base}/${id}`);
  }

  // GET /api/bookings/ticket/{ticketNumber}   (Enquiry module)
  getByTicket(ticketNumber: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.base}/ticket/${ticketNumber}`);
  }

  // GET /api/bookings/{id}
  getById(id: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.base}/${id}`);
  }

  // GET /api/bookings/customer/{customerId}   (User booking history)
  getByCustomer(customerId: number): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.base}/customer/${customerId}`);
  }

  // GET /api/bookings
  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.base);
  }
}
