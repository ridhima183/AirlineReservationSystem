# Online Airline Reservation — Microservices Backend

Spring Boot **3.5.7**, Spring Cloud **2025.0.0**, Java 17.

## Architecture (matches your Eureka/Boot Dashboard setup)

| Service | Port | Purpose |
|---|---|---|
| `eureka-server` | 8761 | Service registry/discovery |
| `api-gateway` | 9090 | Single entry point, routes `/api/**` to services |
| `customer-service` | 8088 | Registration, login, profile |
| `flight-service` | 8089 | Flight search/select, admin add/delete/view, booking, payment, cancellation |

## Run order

```bash
cd eureka-server && mvn spring-boot:run       # 1. start registry first
cd customer-service && mvn spring-boot:run    # 2. start services
cd flight-service && mvn spring-boot:run
cd api-gateway && mvn spring-boot:run          # 3. start gateway last
```

Or build all with `mvn clean package` from the root, then run each jar. Check registrations at `http://localhost:8761`.

All calls below can be made directly to each service's port, or through the gateway at `http://localhost:9090` (routes: `/api/customers/**` → customer-service, `/api/flights/**` and `/api/bookings/**` → flight-service).

## Endpoints

### Customer Service (`customer-service`, port 8088)
| Method | Path | Description |
|---|---|---|
| POST | `/api/customers/register` | Register new user (title, firstName, lastName, email, password, dateOfBirth, phoneNumber) |
| POST | `/api/customers/login` | Login with `{email, password}` |
| PUT | `/api/customers/{id}/password` | Forget/reset password |
| GET | `/api/customers/{id}` | Get user profile |
| GET | `/api/customers` | List all customers (admin/debug) |

### Flight Service — Flights (`flight-service`, port 8089)
| Method | Path | Description |
|---|---|---|
| GET | `/api/flights/search?from=DEL&to=BOM` | Flight search |
| GET | `/api/flights/{id}` | Flight select / detail |
| GET | `/api/flights` | Admin: view all flights |
| POST | `/api/flights` | Admin: add flight |
| DELETE | `/api/flights/{id}` | Admin: delete flight |

### Flight Service — Bookings (`flight-service`, port 8089)
| Method | Path | Description |
|---|---|---|
| POST | `/api/bookings` | Book ticket (auto seat check → BOOKED or WAITLISTED, generates ticket number + amount) |
| DELETE | `/api/bookings/{id}` | Cancel booking (returns refund after 10% deduction, restores seats) |
| GET | `/api/bookings/ticket/{ticketNumber}` | Enquiry by ticket number |
| GET | `/api/bookings/{id}` | Get booking by id |
| GET | `/api/bookings` | List all bookings |

## Sample requests

Register:
```bash
curl -X POST http://localhost:8088/api/customers/register -H "Content-Type: application/json" \
 -d '{"title":"Mr","firstName":"John","lastName":"Doe","email":"john@x.com","password":"Pass@123","dateOfBirth":"1990-01-01","phoneNumber":"9999999999"}'
```

Add flight (admin):
```bash
curl -X POST http://localhost:8089/api/flights -H "Content-Type: application/json" \
 -d '{"flightNumber":"AI-101","fromCity":"DEL","toCity":"BOM","departTime":"09:00","arriveTime":"11:00","duration":"2h","cabin":"one-way","economyPrice":4500,"businessPrice":9000,"seatsAvailable":60}'
```

Search flights:
```bash
curl "http://localhost:8089/api/flights/search?from=DEL&to=BOM"
```

Book a ticket:
```bash
curl -X POST http://localhost:8089/api/bookings -H "Content-Type: application/json" \
 -d '{"flightId":1,"customerId":1,"passengerNames":"John Doe","seatNumbers":"1A","travelClass":"economy","numPassengers":1}'
```

Cancel:
```bash
curl -X DELETE http://localhost:8089/api/bookings/1
```

## Notes
- H2 in-memory DB per service (console at `/h2-console` on each service's port) — swap for MySQL/Postgres by editing `application.yml` datasource block.
- Kept intentionally minimal (Lombok `@Data`, no service-layer boilerplate) per your "less code" request — controllers talk to repositories directly.
- To wire this into your existing Eclipse/STS workspace (matching your Package Explorer/Boot Dashboard screenshots), just import each module as an existing Maven project.
