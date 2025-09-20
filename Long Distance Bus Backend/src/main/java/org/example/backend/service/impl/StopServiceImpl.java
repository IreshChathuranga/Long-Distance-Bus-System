package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.StopDTO;
import org.example.backend.entity.Stop;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.StopRepository;
import org.example.backend.service.StopService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StopServiceImpl implements StopService {
    private final StopRepository stopRepository;
    private final ModelMapper modelMapper;


    @Override
    public void saveStop(StopDTO stopDTO) {
        try {
            stopRepository.save(modelMapper.map(stopDTO, Stop.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (longitude , latitude and name already exists)");
        }
    }

    @Override
    public void updateStop(StopDTO stopDTO) {
        Stop existingStop = stopRepository.findById(stopDTO.getStopId())
                .orElseThrow(() -> new ResourseNotFound("Stop not found with id: " + stopDTO.getStopId()));

        try {
            Stop updatedStop = modelMapper.map(stopDTO, Stop.class);
            stopRepository.save(updatedStop);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (longitude , latitude and name already exists)");
        }
    }

    @Override
    public List<StopDTO> getAll() {
        List<Stop> allStops = stopRepository.findAll();
        if(allStops.isEmpty()) {
            throw new ResourseNotFound("No stops found");
        }
        return modelMapper.map(allStops, new TypeToken<List<StopDTO>>(){}.getType());
    }

    @Override
    public void deleteStop(Integer id) {
        try {
            Stop existingStop = stopRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Stop not found with id: " + id));

            stopRepository.delete(existingStop);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete stop: " + ex.getMessage());
        }
    }
}
