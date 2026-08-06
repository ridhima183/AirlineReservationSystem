# Airline Reservation — Angular Frontend

Angular 17 (standalone components), TypeScript. Talks to the Spring Boot microservices via the **API Gateway** on `http://localhost:9090`.

## Prerequisites
- Node.js 18+ and npm
- The backend running: `eureka-server` → `customer-service` + `flight-service` → `api-gateway` (see backend README)
- **Important:** the gateway now has CORS enabled for `http://localhost:4200`. If you changed the gateway's `application.properties`, re-add:
  ```properties
  spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allowedOrigins=http://localhost:4200
  spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allowedMethods=GET,POST,PUT,DELETE,OPTIONS
  spring.cloud.gateway.server.webflux.globalcors.cors-configurations.[/**].allowedHeaders=*
  ```

## Setup & Run
```bash
npm install
npm start          # runs `ng serve`, opens on http://localhost:4200
```

## Project structure
```
src/app/
  core/
    models/models.ts          # Customer, Flight, Booking interfaces (mirror backend entities)
    services/
      customer.service.ts     # -> customer-service
      flight.service.ts       # -> flight-service (flights)
      booking.service.ts      # -> flight-service (bookings)
      session.service.ts      # holds logged-in customer in localStorage
  features/
    auth/register.component.ts
    auth/login.component.ts
    flights/flight-search.component.ts
    booking/booking.component.ts    # flight select + seat select + payment
    booking/enquiry.component.ts    # enquiry + cancellation
    admin/admin.component.ts        # admin add/delete/view flights
  app.routes.ts
  app.component.ts                  # nav bar
```

## API base URL
Set in `src/environments/environment.ts`:
```ts
export const environment = {
  apiBaseUrl: 'http://localhost:9090'   // the gateway
};
```
To bypass the gateway and hit services directly during debugging, change to `http://localhost:8088` (customer) or `http://localhost:8089` (flight) per-service — but then update each `*.service.ts` base URL, since the gateway currently combines both under one origin.

## Full endpoint mapping (frontend call → backend route)

### Customer Service (via gateway → `customer-service`, actual port 8088)
| Frontend call | Method | Path | Used in |
|---|---|---|---|
| `CustomerService.register()` | POST | `/api/customers/register` | Register screen |
| `CustomerService.login()` | POST | `/api/customers/login` | Login screen |
| `CustomerService.resetPassword()` | PUT | `/api/customers/{id}/password` | (Forget password — hook up a screen if needed) |
| `CustomerService.getProfile()` | GET | `/api/customers/{id}` | (Profile page — hook up if needed) |
| `CustomerService.getAll()` | GET | `/api/customers` | Admin/debug |

### Flight Service — Flights (via gateway → `flight-service`, actual port 8089)
| Frontend call | Method | Path | Used in |
|---|---|---|---|
| `FlightService.search()` | GET | `/api/flights/search?from=&to=` | Flight Search screen |
| `FlightService.getById()` | GET | `/api/flights/{id}` | Flight Select / Booking screen |
| `FlightService.getAll()` | GET | `/api/flights` | Admin screen |
| `FlightService.add()` | POST | `/api/flights` | Admin — Add Flight |
| `FlightService.delete()` | DELETE | `/api/flights/{id}` | Admin — Delete Flight |

### Flight Service — Bookings (via gateway → `flight-service`, actual port 8089)
| Frontend call | Method | Path | Used in |
|---|---|---|---|
| `BookingService.book()` | POST | `/api/bookings` | Seat Select + Payment (Booking screen) |
| `BookingService.cancel()` | DELETE | `/api/bookings/{id}` | Enquiry screen — Cancel button |
| `BookingService.getByTicket()` | GET | `/api/bookings/ticket/{ticketNumber}` | Enquiry screen — lookup |
| `BookingService.getById()` | GET | `/api/bookings/{id}` | (internal use) |
| `BookingService.getAll()` | GET | `/api/bookings` | (admin/debug) |

## User flow implemented
1. **Register** → `/register` → creates customer via `POST /api/customers/register`
2. **Login** → `/login` → `POST /api/customers/login`, stores customer in `localStorage`
3. **Search flights** → `/flights` → `GET /api/flights/search`
4. **Select flight → seat → pay** (combined, per "less code" backend design) → `/flights/:id/book` → `GET /api/flights/{id}` then `POST /api/bookings`
5. **Enquiry / cancellation** → `/enquiry` → `GET /api/bookings/ticket/{ticketNumber}`, cancel via `DELETE /api/bookings/{id}`
6. **Admin** → `/admin` → `GET/POST/DELETE /api/flights`

## Notes
- Kept intentionally minimal — one component per screen, no NgRx/state library, plain `HttpClient` + RxJS `subscribe`.
- Session (`SessionService`) uses `localStorage` since this is a real browser app (not a Claude artifact) — safe here.
- Add a route guard later if you want to block `/flights/:id/book` and `/enquiry` for logged-out users beyond the current in-component redirect in `booking.component.ts`.
