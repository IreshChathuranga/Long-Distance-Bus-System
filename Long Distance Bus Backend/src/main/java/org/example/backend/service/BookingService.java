package org.example.backend.service;

import org.example.backend.dto.BookingDTO;

import java.util.List;

public interface BookingService {
    void saveBooking(BookingDTO bookingDTO);
    public void updateBooking(BookingDTO bookingDTO);
    List<BookingDTO> getAll();
    void deleteBooking(Integer id);
    void confirmBooking(Integer bookingId);

    BookingDTO getBookingByRef(String bookingRef);
}
