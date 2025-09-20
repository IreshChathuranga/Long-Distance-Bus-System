package org.example.backend.service;

import org.example.backend.dto.CancellationDTO;

import java.util.List;

public interface CancellationService {
    void saveCancellation(CancellationDTO cancellationDTO);
    public void updateCancellation(CancellationDTO cancellationDTO);
    List<CancellationDTO> getAll();
    void deleteCancellation(Integer id);
}
