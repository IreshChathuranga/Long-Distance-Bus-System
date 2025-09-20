package org.example.backend.repository;

import org.example.backend.entity.TripSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TripSeatRepository extends JpaRepository<TripSeat, Integer> {
    int countByTrip_TripIdAndStatus(Integer tripId, String status);
    List<TripSeat> findByTrip_TripId(Integer tripId);
    @Query("SELECT ts FROM TripSeat ts " +
            "JOIN ts.seat s " +
            "WHERE ts.trip.tripId = :tripId " +
            "AND s.seatNumber IN :seatNumbers")
    List<TripSeat> findByTripIdAndSeatNumbers(@Param("tripId") Integer tripId,
                                              @Param("seatNumbers") List<String> seatNumbers);
    List<TripSeat> findByStatusAndHoldExpiresAtBefore(String status, LocalDateTime dateTime);
}
