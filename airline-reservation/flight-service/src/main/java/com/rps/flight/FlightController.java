package com.rps.flight;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightRepository repo;

    public FlightController(FlightRepository repo) {
        this.repo = repo;
    }

    // Enhanced Flight Search with date and trip type
    @GetMapping("/search")
    public List<Flight> search(
            @RequestParam String from, 
            @RequestParam String to,
            @RequestParam(required = false) LocalDate date,
            @RequestParam(required = false) String cabin) {
        
        List<Flight> flights = repo.findByFromCityIgnoreCaseAndToCityIgnoreCase(from, to);
        
        // Filter by date if provided
        if (date != null) {
            flights = flights.stream()
                .filter(f -> f.getTravelDate() == null || f.getTravelDate().equals(date))
                .toList();
        }
        
        // Filter by cabin if provided
        if (cabin != null && !cabin.isEmpty()) {
            flights = flights.stream()
                .filter(f -> cabin.equalsIgnoreCase(f.getCabin()))
                .toList();
        }
        
        return flights;
    }

    // Flight Select: view single flight
    @GetMapping("/{id}")
    public ResponseEntity<?> getFlight(@PathVariable Long id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Get seat map for a flight
    @GetMapping("/{id}/seats")
    public ResponseEntity<?> getSeatMap(@PathVariable Long id) {
        return repo.findById(id)
                .map(flight -> ResponseEntity.ok(Map.of(
                    "flightId", flight.getId(),
                    "seatMap", flight.getSeatMap(),
                    "totalSeats", flight.getTotalSeats(),
                    "availableSeats", flight.getSeatsAvailable()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Lock a seat temporarily (for session management)
    @PostMapping("/{id}/seats/lock")
    public ResponseEntity<?> lockSeat(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        return repo.findById(id).map(flight -> {
            String seatNumber = request.get("seatNumber");
            if (flight.lockSeat(seatNumber, request.get("sessionToken"))) {
                repo.save(flight);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Seat " + seatNumber + " locked successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Seat " + seatNumber + " is not available"
                ));
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    // Unlock a seat
    @PostMapping("/{id}/seats/unlock")
    public ResponseEntity<?> unlockSeat(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        
        return repo.findById(id).map(flight -> {
            String seatNumber = request.get("seatNumber");
            flight.unlockSeat(seatNumber);
            repo.save(flight);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Seat " + seatNumber + " unlocked successfully"
            ));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Admin - View all flights
    @GetMapping
    public List<Flight> viewAll() {
        return repo.findAll();
    }

    // Admin - Add flight
    @PostMapping
    public ResponseEntity<Flight> addFlight(@RequestBody Flight flight) {
        return ResponseEntity.ok(repo.save(flight));
    }

    // Admin - Delete flight
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFlight(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
