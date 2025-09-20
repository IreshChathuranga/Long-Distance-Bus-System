package org.example.backend.service;

import org.example.backend.dto.TripDTO;

import java.util.List;

public interface TripService {
    void saveTrip(TripDTO tripDTO);
    public void updateTrip(TripDTO tripDTO);
    List<TripDTO> getAll();
    void deleteTrip(Integer id);
}
