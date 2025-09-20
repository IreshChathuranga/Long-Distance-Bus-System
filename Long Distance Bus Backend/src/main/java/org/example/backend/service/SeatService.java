package org.example.backend.service;

import org.example.backend.dto.SeatDTO;

import java.util.List;

public interface SeatService {
    void saveSeat(List<SeatDTO> seatDTOs);
    public void updateSeat(SeatDTO seatDTO);
    List<SeatDTO> getAll();
    void deleteSeat(Integer id);
}
