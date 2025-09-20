package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.BookingDTO;
import org.example.backend.entity.*;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.BookingRepository;
import org.example.backend.repository.TripSeatRepository;
import org.example.backend.service.BookingService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final TripSeatRepository tripSeatRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public void saveBooking(BookingDTO bookingDTO) {
        // Split seat numbers as String list
        List<String> selectedSeatNumbers = Arrays.stream(bookingDTO.getSeatNumber().split(","))
                .map(String::trim)
                .toList();

        // Find trip seats by seatNumber (String)
        List<TripSeat> tripSeats = tripSeatRepository
                .findByTripIdAndSeatNumbers(bookingDTO.getTripId(), selectedSeatNumbers);

        if (tripSeats.isEmpty()) {
            throw new ResourseNotFound("No seats found for selected trip.");
        }

        // Check status
        for (TripSeat ts : tripSeats) {
            if ("HELD".equals(ts.getStatus()) && ts.getHoldExpiresAt() != null &&
                    ts.getHoldExpiresAt().isAfter(LocalDateTime.now())) {
                throw new ResourseAllredyFound("Seat " + ts.getSeat().getSeatNumber() + " is currently HELD.");
            }
            if ("BOOKED".equals(ts.getStatus())) {
                throw new ResourseAllredyFound("Seat " + ts.getSeat().getSeatNumber() + " is already BOOKED.");
            }
        }

        // Save booking
        Booking booking = new Booking();
        booking.setBookingRef(bookingDTO.getBookingRef());
        booking.setSeatNumber(bookingDTO.getSeatNumber());
        booking.setStatus("HELD");
        booking.setTotalAmount(bookingDTO.getTotalAmount());
        booking.setCurrency(bookingDTO.getCurrency());
        booking.setCreatedAt(LocalDateTime.now());
        booking.setExpiresAt(LocalDateTime.now().plusMinutes(30));

        User user = new User();
        user.setUserId(bookingDTO.getUserId());
        booking.setUser(user);

        Trip trip = new Trip();
        trip.setTripId(bookingDTO.getTripId());
        booking.setTrip(trip);

        bookingRepository.save(booking);

        // Update TripSeats
        LocalDateTime holdExpiresAt = LocalDateTime.now().plusMinutes(30);
        tripSeats.forEach(ts -> {
            ts.setStatus("HELD");
            ts.setHoldExpiresAt(holdExpiresAt);
        });
        tripSeatRepository.saveAll(tripSeats);
    }

    @Override
    @Transactional
    public void confirmBooking(Integer bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourseNotFound("Booking not found"));

        if (booking.getExpiresAt() != null && booking.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot confirm expired booking.");
        }

        booking.setStatus("BOOKED");
        bookingRepository.save(booking);

        // Split seat numbers as String
        List<String> selectedSeatNumbers = Arrays.stream(booking.getSeatNumber().split(","))
                .map(String::trim)
                .toList();

        // Find seats by seatNumber (String)
        List<TripSeat> tripSeats = tripSeatRepository
                .findByTripIdAndSeatNumbers(booking.getTrip().getTripId(), selectedSeatNumbers);

        for (TripSeat ts : tripSeats) {
            ts.setStatus("BOOKED");
            ts.setHoldExpiresAt(null);
        }
        tripSeatRepository.saveAll(tripSeats);
    }

    @Override
    public void updateBooking(BookingDTO bookingDTO) {
        Booking existingBooking = bookingRepository.findById(bookingDTO.getBookingId())
                .orElseThrow(() -> new ResourseNotFound("Booking not found with id: " + bookingDTO.getBookingId()));

        try {
            Booking updatedBooking = modelMapper.map(bookingDTO, Booking.class);
            bookingRepository.save(updatedBooking);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (qrCode already exists)");
        }
    }

    @Override
    public List<BookingDTO> getAll() {
        List<Booking> allBookings = bookingRepository.findAll();
        if(allBookings.isEmpty()) {
            throw new ResourseNotFound("No bookings found");
        }
        return modelMapper.map(allBookings, new TypeToken<List<BookingDTO>>(){}.getType());
    }

    @Override
    public void deleteBooking(Integer id) {
        try {
            Booking existingBooking = bookingRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Booking not found with id: " + id));

            bookingRepository.delete(existingBooking);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete booking: " + ex.getMessage());
        }
    }

    @Override
    public BookingDTO getBookingByRef(String bookingRef) {
        Booking booking = bookingRepository.findByBookingRef(bookingRef)
                .orElseThrow(() -> new ResourseNotFound("Booking not found for ref: " + bookingRef));

        return modelMapper.map(booking, BookingDTO.class);
    }
}
