package org.example.backend.service;

import org.example.backend.dto.SeatMapDTO;

import java.util.List;

public interface SeatMapService {
    void saveSeatMap(SeatMapDTO seatMapDTO);
    public void updateSeatMap(SeatMapDTO seatMapDTO);
    List<SeatMapDTO> getAll();
    void deleteSeatMap(Integer id);
}
