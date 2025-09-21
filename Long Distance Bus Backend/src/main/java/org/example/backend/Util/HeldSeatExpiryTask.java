package org.example.backend.Util;


import lombok.RequiredArgsConstructor;
import org.example.backend.entity.Booking;
import org.example.backend.entity.TripSeat;
import org.example.backend.repository.BookingRepository;
import org.example.backend.repository.TripSeatRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class HeldSeatExpiryTask {
    private final TripSeatRepository tripSeatRepository;
    private final BookingRepository bookingRepository;

    @Scheduled(fixedRate = 60000)
    public void expireHeldSeats() {
        LocalDateTime now = LocalDateTime.now();

        List<TripSeat> expiredSeats = tripSeatRepository.findByStatusAndHoldExpiresAtBefore("HELD", now);
        for (TripSeat ts : expiredSeats) {
            ts.setStatus("AVAILABLE");
            ts.setHoldExpiresAt(null);
        }
        tripSeatRepository.saveAll(expiredSeats);

        List<Booking> expiredBookings = bookingRepository.findByStatusAndExpiresAtBefore("HELD", now);
        for (Booking b : expiredBookings) {
            b.setStatus("EXPIRED");
        }
        bookingRepository.saveAll(expiredBookings);
    }
}
