package org.example.backend.service;

import org.example.backend.dto.TripSeatDTO;
import org.example.backend.entity.TripSeat;

import java.util.List;

public interface TripSeatService {
    void saveTripSeat(TripSeatDTO tripSeatDTO);
    public void updateTripSeat(TripSeatDTO tripSeatDTO);
    List<TripSeatDTO> getAll();
    void deleteTripSeat(Integer id);
    int getAvailableSeatsByTripId(Integer tripId);

    List<TripSeat> getSeatsForTrip(Integer tripId);
}
