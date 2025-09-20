package org.example.backend.service;

import org.example.backend.dto.StopDTO;

import java.util.List;

public interface StopService {
    void saveStop(StopDTO stopDTO);
    public void updateStop(StopDTO stopDTO);
    List<StopDTO> getAll();
    void deleteStop(Integer id);
}
