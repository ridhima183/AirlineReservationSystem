package com.rps.flight;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flight, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    java.util.Optional<Flight> findWithLockById(Long id);
    List<Flight> findByFromCityIgnoreCaseAndToCityIgnoreCase(String fromCity, String toCity);
}
