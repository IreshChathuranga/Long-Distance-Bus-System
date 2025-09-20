package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.BookingItemDTO;
import org.example.backend.entity.BookingItem;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.BookingItemRepository;
import org.example.backend.service.BookingItemService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingItemServiceImpl implements BookingItemService {
    private final BookingItemRepository bookingItemRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveBookingItem(BookingItemDTO bookingItemDTO) {
        try {
            bookingItemRepository.save(modelMapper.map(bookingItemDTO, BookingItem.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public void updateBookingItem(BookingItemDTO bookingItemDTO) {
        BookingItem existingBookingItem = bookingItemRepository.findById(bookingItemDTO.getBookingItemId())
                .orElseThrow(() -> new ResourseNotFound("BookingItem not found with id: " + bookingItemDTO.getBookingItemId()));

        try {
            BookingItem updatedBookingItem = modelMapper.map(bookingItemDTO, BookingItem.class);
            bookingItemRepository.save(updatedBookingItem);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public List<BookingItemDTO> getAll() {
        List<BookingItem> allBookingItems = bookingItemRepository.findAll();
        if(allBookingItems.isEmpty()) {
            throw new ResourseNotFound("No bookingItems found");
        }
        return modelMapper.map(allBookingItems, new TypeToken<List<BookingItemDTO>>(){}.getType());
    }

    @Override
    public void deleteBookingItem(Integer id) {
        try {
            BookingItem existingBookingItem = bookingItemRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("BookingItem not found with id: " + id));

            bookingItemRepository.delete(existingBookingItem);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete bookingItem: " + ex.getMessage());
        }
    }
}
