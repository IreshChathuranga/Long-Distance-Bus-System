package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.TripSeatDTO;
import org.example.backend.entity.TripSeat;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.TripSeatRepository;
import org.example.backend.service.TripSeatService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripSeatServiceImpl implements TripSeatService {
    private final TripSeatRepository tripSeatRepository;
    private final ModelMapper modelMapper;
    @Override
    @Transactional
    public void saveTripSeat(TripSeatDTO tripSeatDTO) {
        try {
            TripSeat ts = modelMapper.map(tripSeatDTO, TripSeat.class);
            tripSeatRepository.save(ts);
        } catch (Exception ex) {
            throw new ResourseAllredyFound("Duplicate value or invalid data");
        }
    }

    @Override
    @Transactional
    public void updateTripSeat(TripSeatDTO tripSeatDTO) {
        TripSeat existing = tripSeatRepository.findById(tripSeatDTO.getTripSeatId())
                .orElseThrow(() -> new ResourseNotFound("TripSeat not found"));

        TripSeat updated = modelMapper.map(tripSeatDTO, TripSeat.class);
        tripSeatRepository.save(updated);
    }

    @Override
    public List<TripSeatDTO> getAll() {
        List<TripSeat> allTripSeats = tripSeatRepository.findAll();
        return allTripSeats.stream().map(tripSeat -> {
            TripSeatDTO dto = new TripSeatDTO();
            dto.setTripSeatId(tripSeat.getTripSeatId());
            dto.setTripId(tripSeat.getTrip().getTripId());
            dto.setSeatId(tripSeat.getSeat().getSeatId());
            dto.setStatus(tripSeat.getStatus());
            dto.setHoldExpiresAt(tripSeat.getHoldExpiresAt());
            return dto;
        }).toList();
    }

    @Override
    @Transactional
    public void deleteTripSeat(Integer id) {
        TripSeat ts = tripSeatRepository.findById(id)
                .orElseThrow(() -> new ResourseNotFound("TripSeat not found"));
        tripSeatRepository.delete(ts);
    }

    @Override
    public int getAvailableSeatsByTripId(Integer tripId) {
        return tripSeatRepository.countByTrip_TripIdAndStatus(tripId, "AVAILABLE");
    }

    @Override
    public List<TripSeat> getSeatsForTrip(Integer tripId) {
        List<TripSeat> seats = tripSeatRepository.findByTrip_TripId(tripId);
        return seats != null ? seats : List.of();
    }
}
