package org.example.backend.service;

import org.example.backend.dto.BookingItemDTO;

import java.util.List;

public interface BookingItemService {
    void saveBookingItem(BookingItemDTO bookingItemDTO);
    public void updateBookingItem(BookingItemDTO bookingItemDTO);
    List<BookingItemDTO> getAll();
    void deleteBookingItem(Integer id);
}
