package com.rps.flight;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByTicketNumber(String ticketNumber);
    List<Booking> findByCustomerId(Long customerId);
}
