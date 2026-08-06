import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Flight, SeatMap } from '../models/models';

// Maps 1:1 to com.rps.flight.FlightController (base path /api/flights)
@Injectable({ providedIn: 'root' })
export class FlightService {
  private base = `${environment.apiBaseUrl}/api/flights`;

  constructor(private http: HttpClient) {}

  // Enhanced Flight Search with date, cabin filters
  search(from: string, to: string, date?: string, cabin?: string): Observable<Flight[]> {
    let params = new HttpParams().set('from', from).set('to', to);
    if (date) params = params.set('date', date);
    if (cabin) params = params.set('cabin', cabin);
    return this.http.get<Flight[]>(`${this.base}/search`, { params });
  }

  // GET /api/flights/{id}   (Flight Select module)
  getById(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.base}/${id}`);
  }

  // Get seat map for a flight
  getSeatMap(id: number): Observable<SeatMap> {
    return this.http.get<SeatMap>(`${this.base}/${id}/seats`);
  }

  // Lock a seat temporarily (session management)
  lockSeat(id: number, seatNumber: string, sessionToken: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/${id}/seats/lock`, {
      seatNumber,
      sessionToken
    });
  }

  // Unlock a seat
  unlockSeat(id: number, seatNumber: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.base}/${id}/seats/unlock`, {
      seatNumber
    });
  }

  // GET /api/flights   (Admin - view all)
  getAll(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.base);
  }

  // POST /api/flights   (Admin - add flight)
  add(flight: Flight): Observable<Flight> {
    return this.http.post<Flight>(this.base, flight);
  }

  // DELETE /api/flights/{id}   (Admin - delete flight)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
