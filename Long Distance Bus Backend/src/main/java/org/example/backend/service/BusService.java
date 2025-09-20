package org.example.backend.service;

import org.example.backend.dto.BusDTO;

import java.util.List;

public interface BusService {
    void saveBus(BusDTO busDTO);
    public void updateBus(BusDTO busDTO);
    List<BusDTO> getAll();
    void deleteBus(Integer id);
}
