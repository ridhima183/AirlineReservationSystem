package com.rps.flight;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "flights")
@Data
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;
    private String fromCity;
    private String toCity;
    private String departTime;
    private String arriveTime;
    private String duration;
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imageUrl;
    private String cabin;          // one-way / round-trip
    private Double economyPrice;
    private Double businessPrice;
    private Integer totalSeats = 60;
    private Integer seatsAvailable = 60;
    private LocalDate travelDate;
    private LocalDate returnDate;  // For return flights
    
    @ElementCollection
    @CollectionTable(name = "flight_seat_locks", joinColumns = @JoinColumn(name = "flight_id"))
    @Column(name = "locked_seat")
    private Set<String> lockedSeats = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "flight_booked_seats", joinColumns = @JoinColumn(name = "flight_id"))
    @Column(name = "booked_seat")
    private Set<String> bookedSeats = new HashSet<>();
    
    // Helper method to check if seat is available
    public boolean isSeatAvailable(String seatNumber) {
        return !bookedSeats.contains(seatNumber) && !lockedSeats.contains(seatNumber);
    }
    
    // Helper method to lock a seat temporarily
    public boolean lockSeat(String seatNumber, String sessionToken) {
        if (isSeatAvailable(seatNumber)) {
            lockedSeats.add(seatNumber);
            return true;
        }
        return false;
    }
    
    // Helper method to unlock a seat
    public void unlockSeat(String seatNumber) {
        lockedSeats.remove(seatNumber);
    }
    
    // Helper method to book a seat permanently
    public boolean bookSeat(String seatNumber) {
        if (isSeatAvailable(seatNumber)) {
            bookedSeats.add(seatNumber);
            lockedSeats.remove(seatNumber);
            return true;
        }
        return false;
    }
    
    // Generate seat map (6 columns A-F, 15 rows)
    public String[][] getSeatMap() {
        String[][] seats = new String[15][6];
        char[] columns = {'A', 'B', 'C', 'D', 'E', 'F'};
        
        for (int row = 0; row < 15; row++) {
            for (int col = 0; col < 6; col++) {
                String seatNum = (row + 1) + String.valueOf(columns[col]);
                if (bookedSeats.contains(seatNum)) {
                    seats[row][col] = "BOOKED";
                } else if (lockedSeats.contains(seatNum)) {
                    seats[row][col] = "LOCKED";
                } else {
                    seats[row][col] = "AVAILABLE";
                }
            }
        }
        return seats;
    }
}
