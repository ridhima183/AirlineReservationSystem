package com.rps.flight;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepo;
    private final FlightRepository flightRepo;

    public BookingController(BookingRepository bookingRepo, FlightRepository flightRepo) {
        this.bookingRepo = bookingRepo;
        this.flightRepo = flightRepo;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> book(@RequestBody Booking booking) {
        if (booking.getFlightId() == null || booking.getCustomerId() == null || booking.getTravelClass() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "flightId, customerId and travelClass are required"));
        }
        Flight flight = flightRepo.findWithLockById(booking.getFlightId()).orElse(null);
        if (flight == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Flight not found"));
        }

        // Generate unique ticket number
        booking.setTicketNumber("TCK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());

        // Calculate total passengers from breakdown if not provided
        int requested = booking.getNumPassengers() == null ? 
            (booking.getNumAdults() != null ? booking.getNumAdults() : 1) +
            (booking.getNumChildren() != null ? booking.getNumChildren() : 0) +
            (booking.getNumInfants() != null ? booking.getNumInfants() : 0) :
            booking.getNumPassengers();
        
        booking.setNumPassengers(requested);
        if (requested < 1) {
            return ResponseEntity.badRequest().body(Map.of("error", "At least one passenger is required"));
        }
        
        // Set defaults for passenger breakdown
        if (booking.getNumAdults() == null) booking.setNumAdults(requested);
        if (booking.getNumChildren() == null) booking.setNumChildren(0);
        if (booking.getNumInfants() == null) booking.setNumInfants(0);

        // Calculate price (infants typically free or 10% of adult fare)
        Double selectedFare = "business".equalsIgnoreCase(booking.getTravelClass())
                ? flight.getBusinessPrice() : flight.getEconomyPrice();
        if (selectedFare == null || selectedFare <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "The selected cabin does not have a valid fare"));
        }
        int availableSeats = flight.getSeatsAvailable() == null ? 0 : flight.getSeatsAvailable();
        double price = selectedFare;
        double adultPrice = price * booking.getNumAdults();
        double childPrice = price * booking.getNumChildren() * 0.75; // 25% discount for children
        double infantPrice = price * booking.getNumInfants() * 0.10; // 90% discount for infants
        booking.setAmountPaid(adultPrice + childPrice + infantPrice);

        // Set trip type default
        if (booking.getTripType() == null) booking.setTripType("one-way");
        
        // Set payment status
        booking.setPaymentStatus("COMPLETED");
        booking.setPaymentMethod("credit_card");
        booking.setIssueDate(LocalDateTime.now());

        String[] seats = booking.getSeatNumbers() == null || booking.getSeatNumbers().isBlank()
                ? new String[0] : booking.getSeatNumbers().split(",");
        if (seats.length > 0 && seats.length != requested) {
            return ResponseEntity.badRequest().body(Map.of("error", "Provide exactly one seat number per passenger"));
        }
        if (availableSeats >= requested && Arrays.stream(seats).map(String::trim).distinct().count() == seats.length
                && Arrays.stream(seats).allMatch(seat -> flight.isSeatAvailable(seat.trim()))) {
            for (String seat : seats) {
                flight.bookSeat(seat.trim());
            }
            flight.setSeatsAvailable(flight.getSeatsAvailable() - requested);
            
            flightRepo.save(flight);
            booking.setStatus("BOOKED");
        } else {
            booking.setStatus("WAITLISTED");
        }

        Booking savedBooking = bookingRepo.save(booking);
        
        // Generate receipt data
        Map<String, Object> response = new HashMap<>();
        response.put("booking", savedBooking);
        response.put("receipt", generateReceipt(savedBooking, flight));
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private Map<String, Object> generateReceipt(Booking booking, Flight flight) {
        Map<String, Object> receipt = new HashMap<>();
        receipt.put("airlineName", "SkyRoute Airways");
        receipt.put("ticketNumber", booking.getTicketNumber());
        receipt.put("transactionId", booking.getTransactionId());
        receipt.put("flightNumber", flight.getFlightNumber());
        receipt.put("route", flight.getFromCity() + " → " + flight.getToCity());
        receipt.put("departureTime", flight.getDepartTime());
        receipt.put("arrivalTime", flight.getArriveTime());
        receipt.put("duration", flight.getDuration());
        receipt.put("travelDate", flight.getTravelDate() != null ? flight.getTravelDate().toString() : "N/A");
        receipt.put("travelClass", booking.getTravelClass().toUpperCase());
        receipt.put("passengerNames", booking.getPassengerNames());
        receipt.put("seatNumbers", booking.getSeatNumbers());
        receipt.put("numAdults", booking.getNumAdults());
        receipt.put("numChildren", booking.getNumChildren());
        receipt.put("numInfants", booking.getNumInfants());
        receipt.put("amountPaid", booking.getAmountPaid());
        receipt.put("status", booking.getStatus());
        receipt.put("issueDate", booking.getIssueDate().format(DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm")));
        receipt.put("tripType", booking.getTripType().toUpperCase());
        return receipt;
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        Booking booking = bookingRepo.findById(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        if ("CANCELLED".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already cancelled"));
        }

        // Calculate refund based on class
        double cancellationFeeRate = "business".equalsIgnoreCase(booking.getTravelClass()) ? 0.05 : 0.10;
        double refund = booking.getAmountPaid() * (1 - cancellationFeeRate);

        if ("BOOKED".equals(booking.getStatus())) {
            flightRepo.findWithLockById(booking.getFlightId()).ifPresent(f -> {
                f.setSeatsAvailable(f.getSeatsAvailable() + booking.getNumPassengers());
                
                if (booking.getSeatNumbers() != null && !booking.getSeatNumbers().isEmpty()) {
                    String[] seats = booking.getSeatNumbers().split(",");
                    for (String seat : seats) {
                        f.unlockSeat(seat.trim());
                    }
                }
                
                flightRepo.save(f);
            });
        }

        booking.setStatus("CANCELLED");
        booking.setRefundAmount(refund);
        booking.setCancellationDate(LocalDateTime.now());
        booking.setPaymentStatus("REFUNDED");
        bookingRepo.save(booking);

        return ResponseEntity.ok(Map.of("booking", booking, "refundAmount", refund, 
            "cancellationFee", booking.getAmountPaid() * cancellationFeeRate));
    }

    @GetMapping("/customer/{customerId}")
    public List<Booking> getByCustomer(@PathVariable Long customerId) {
        return bookingRepo.findByCustomerId(customerId);
    }

    @GetMapping("/ticket/{ticketNumber}")
    public ResponseEntity<?> getByTicket(@PathVariable String ticketNumber) {
        return bookingRepo.findByTicketNumber(ticketNumber)
                .<ResponseEntity<?>>map(b -> {
                    // Include flight details and receipt
                    Map<String, Object> response = new HashMap<>();
                    response.put("booking", b);
                    flightRepo.findById(b.getFlightId()).ifPresent(f -> {
                        response.put("flight", f);
                        response.put("receipt", generateReceipt(b, f));
                    });
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        return bookingRepo.findById(id)
                .<ResponseEntity<?>>map(b -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("booking", b);
                    flightRepo.findById(b.getFlightId()).ifPresent(f -> {
                        response.put("flight", f);
                    });
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Booking> getAll() {
        return bookingRepo.findAll();
    }
}
