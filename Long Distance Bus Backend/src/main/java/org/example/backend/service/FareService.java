package org.example.backend.service;

import org.example.backend.dto.FareDTO;

import java.util.List;

public interface FareService {
    void saveFare(FareDTO fareDTO);
    public void updateFare(FareDTO fareDTO);
    List<FareDTO> getAll();
    void deleteFare(Integer id);
}
