# ✈️ Airline Reservation System

A full-stack **Airline Ticket Reservation System** built with a Spring Boot microservice backend and an **Angular 17** single-page application frontend. The system supports user registration & authentication, flight search, ticket booking with seat selection, payment simulation, cancellation with refund logic, ticket enquiry, and an admin dashboard for managing flights.

---

## 🚀 Overview

The application is architected as a set of independently deployable microservices that communicate through an API Gateway and register with a Eureka service discovery server. The Angular frontend consumes the consolidated REST APIs exposed through the gateway, enabling a seamless end-to-end booking experience.

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 17, TypeScript, RxJS, Angular Router |
| **Backend** | Spring Boot 3.5.7, Spring Cloud 2025.0.0, Java 17 |
| **Service Discovery** | Netflix Eureka |
| **API Gateway** | Spring Cloud Gateway (WebFlux) |
| **Database** | H2 in-memory (per service) — swappable to MySQL/PostgreSQL |
| **Build Tools** | Maven (backend), npm / Angular CLI (frontend) |

---

## 🏗️ System Architecture

```
                        ┌─────────────────────────────┐
                        │      Angular 17 Frontend    │
                        │        localhost:4200       │
                        └──────────────┬──────────────┘
                                       │ HTTP
                                       ▼
                        ┌─────────────────────────────┐
                        │    API Gateway (WebFlux)    │
                        │        localhost:9090       │
                        └───────┬─────────────┬───────┘
                                │             │
            /api/customers/**   │             │  /api/flights/**, /api/bookings/**
                                ▼             ▼
                    ┌────────────────┐  ┌────────────────┐
                    │customer-service│  │ flight-service │
                    │  localhost:8088│  │ localhost:8089 │
                    └───────┬────────┘  └───────┬────────┘
                            │  Register/Login   │  Search/Book/Cancel
                            ▼                   ▼
                    ┌──────────────────────────────┐
                    │   Eureka Service Registry    │
                    │         localhost:8761       │
                    └──────────────────────────────┘
```

| Service | Port | Responsibility |
|---------|------|----------------|
| `eureka-server` | 8761 | Service registry & discovery |
| `api-gateway` | 9090 | Single entry point, routes `/api/**` to services, CORS |
| `customer-service` | 8088 | Registration, login, password reset, profile |
| `flight-service` | 8089 | Flight search, admin flight management, booking, payment, cancellation |

---

## ✨ Features

### 👤 Customer Features
- **User Registration** — create an account with personal & contact details
- **Login / Logout** — session management persisted in `localStorage`
- **Password Reset** — via forgot-password flow
- **Profile Management** — view user profile

### 🔎 Flight Features
- **Flight Search** — search available flights by origin & destination
- **Flight Details** — view flight timing, cabin, and pricing (economy & business)

### 🎫 Booking Features
- **Seat Selection** — choose passenger seats
- **Payment Simulation** — integrated into the booking flow
- **Automatic Status** — `BOOKED` or `WAITLISTED` based on seat availability
- **Ticket Number & Amount** — automatically generated on booking
- **Cancellation & Refund** — cancel with a 10% deduction and seat restoration
- **Ticket Enquiry** — look up any booking by ticket number

### 🛠️ Admin Features
- **Add Flight** — create new flights
- **Delete Flight** — remove existing flights
- **View All Flights** — list and manage the flight inventory

---

## 🧱 Project Structure

```
Airline_Assignment/
├── airline-frontend/                 # Angular 17 SPA
│   ├── src/app/
│   │   ├── core/
│   │   │   ├── guards/               # Route guards (admin)
│   │   │   ├── models/models.ts      # TypeScript interfaces
│   │   │   └── services/             # API service layer
│   │   ├── features/
│   │   │   ├── auth/                 # Register, Login, Forgot password
│   │   │   ├── flights/              # Flight search
│   │   │   ├── booking/              # Booking, Enquiry
│   │   │   ├── admin/                # Admin dashboard
│   │   │   └── user/                 # Profile
│   │   ├── app.routes.ts
│   │   └── app.component.ts
│   └── package.json
│
└── airline-reservation/              # Spring Boot microservices (Maven multi-module)
    ├── pom.xml                       # Parent POM
    ├── eureka-server/                # Service registry
    ├── api-gateway/                  # Spring Cloud Gateway
    ├── customer-service/             # Customer management
    └── flight-service/               # Flights + bookings
```

---

## 🧰 Prerequisites

| Tool | Version |
|------|---------|
| **Java** | 17+ |
| **Maven** | 3.8+ |
| **Node.js** | 18+ |
| **npm** | 9+ |
| **Angular CLI** | 17+ |

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Shivavarmavanaparthi/AirlineReservationSystem.git
cd AirlineReservationSystem
```

### 2. Start the backend (microservices)

From the project root, start the services in the following order — **Eureka first, Gateway last**:

```bash
# Terminal 1 — Service Registry
cd airline-reservation/eureka-server
mvn spring-boot:run

# Terminal 2 — Customer Service
cd airline-reservation/customer-service
mvn spring-boot:run

# Terminal 3 — Flight Service
cd airline-reservation/flight-service
mvn spring-boot:run

# Terminal 4 — API Gateway (last)
cd airline-reservation/api-gateway
mvn spring-boot:run
```

> **Tip:** Alternatively, build all modules at once from the root with `mvn clean package`, then run each generated JAR. Verify service registration at [http://localhost:8761](http://localhost:8761).

### 3. Start the frontend

```bash
cd airline-frontend
npm install
npm start          # serves the app at http://localhost:4200
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

---

## 🔌 API Reference

All endpoints are exposed through the gateway at `http://localhost:9090` (or directly on each service port).

### Customer Service — `/api/customers/**`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/customers/register` | Register a new user |
| `POST` | `/api/customers/login` | Authenticate with `{email, password}` |
| `PUT` | `/api/customers/{id}/password` | Reset password |
| `GET` | `/api/customers/{id}` | Get user profile |
| `GET` | `/api/customers` | List all customers (admin/debug) |

### Flight Service — Flights — `/api/flights/**`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/flights/search?from=&to=` | Search flights by origin/destination |
| `GET` | `/api/flights/{id}` | Get flight details |
| `GET` | `/api/flights` | View all flights (admin) |
| `POST` | `/api/flights` | Add a flight (admin) |
| `DELETE` | `/api/flights/{id}` | Delete a flight (admin) |

### Flight Service — Bookings — `/api/bookings/**`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/bookings` | Book a ticket (seat check → BOOKED/WAITLISTED) |
| `DELETE` | `/api/bookings/{id}` | Cancel booking (10% deduction + seat restore) |
| `GET` | `/api/bookings/ticket/{ticketNumber}` | Enquiry by ticket number |
| `GET` | `/api/bookings/{id}` | Get booking by ID |
| `GET` | `/api/bookings` | List all bookings |

### Sample Requests

**Register a customer:**
```bash
curl -X POST http://localhost:8088/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{"title":"Mr","firstName":"John","lastName":"Doe","email":"john@x.com","password":"Pass@123","dateOfBirth":"1990-01-01","phoneNumber":"9999999999"}'
```

**Add a flight (admin):**
```bash
curl -X POST http://localhost:8089/api/flights \
  -H "Content-Type: application/json" \
  -d '{"flightNumber":"AI-101","fromCity":"DEL","toCity":"BOM","departTime":"09:00","arriveTime":"11:00","duration":"2h","cabin":"one-way","economyPrice":4500,"businessPrice":9000,"seatsAvailable":60}'
```

**Search flights:**
```bash
curl "http://localhost:8089/api/flights/search?from=DEL&to=BOM"
```

**Book a ticket:**
```bash
curl -X POST http://localhost:8089/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"flightId":1,"customerId":1,"passengerNames":"John Doe","seatNumbers":"1A","travelClass":"economy","numPassengers":1}'
```

---

## 🧪 Testing

- Run backend tests with `mvn test` inside any service module.
- The frontend can be built for production with `npm run build` (outputs to `dist/`).
- H2 database consoles are available at `/h2-console` on each service's port for inspecting data.

---

## 🛠️ Tech Stack Summary

- **Backend:** Java 17, Spring Boot 3.5.7, Spring Cloud 2025.0.0, Spring WebFlux, Spring Data JPA, Netflix Eureka, Lombok
- **Frontend:** Angular 17, TypeScript, RxJS, Angular Router, Angular Forms
- **Database:** H2 (in-memory), easily replaceable with MySQL/PostgreSQL
- **Infrastructure:** Spring Cloud Gateway for routing, Eureka for service discovery

---

## 📌 Notes & Future Enhancements

- **Database swap:** Edit the `application.yml`/`application.properties` datasource block in each service to connect to MySQL/PostgreSQL.
- **Security:** Currently no JWT/OAuth2; authentication is session-based via `localStorage`. A JWT-based auth layer can be added for production-grade security.
- **Observability:** Add Health Checks, Metrics (Micrometer/Prometheus), and centralized logging as a next step.
- **Containerization:** Dockerize each service and orchestrate with Docker Compose or Kubernetes for consistent deployment.

---

## 📄 License

This project is for **evaluation and demonstration purposes** as part of the Coforge technical assessment.

---

**Built with Java, Spring Boot & Angular to demonstrate a complete microservices-based full-stack engineering solution.**
