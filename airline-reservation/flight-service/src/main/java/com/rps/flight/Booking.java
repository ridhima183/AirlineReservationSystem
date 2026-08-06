package com.rps.flight;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ticketNumber;
    private Long flightId;
    private Long customerId;
    private String passengerNames;   // comma separated
    private String seatNumbers;      // comma separated e.g. 1A,1B
    private String travelClass;      // economy / business
    private Integer numPassengers;
    
    // Passenger breakdown
    private Integer numAdults;
    private Integer numChildren;
    private Integer numInfants;
    
    private Double amountPaid;
    private String status;           // BOOKED / WAITLISTED / CANCELLED
    private LocalDateTime issueDate = LocalDateTime.now();
    
    // Trip type
    private String tripType;         // one-way / return
    private String returnFlightId;   // For return trips
    
    // Cancellation details
    private Double refundAmount;
    private LocalDateTime cancellationDate;
    
    // Payment details
    private String paymentMethod;    // credit_card / debit_card
    private String paymentStatus;    // PENDING / COMPLETED / REFUNDED
    private String transactionId;
}
