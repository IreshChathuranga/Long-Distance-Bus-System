package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.FareDTO;
import org.example.backend.entity.Fare;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.FareRepository;
import org.example.backend.service.FareService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FareServiceImpl implements FareService {
    private final FareRepository fareRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveFare(FareDTO fareDTO) {
        try {
            fareRepository.save(modelMapper.map(fareDTO, Fare.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (currency already exists)");
        }
    }

    @Override
    public void updateFare(FareDTO fareDTO) {
        Fare existingFare = fareRepository.findById(fareDTO.getFareId())
                .orElseThrow(() -> new ResourseNotFound("Fare not found with id: " + fareDTO.getFareId()));

        try {
            Fare updatedFare = modelMapper.map(fareDTO, Fare.class);
            fareRepository.save(updatedFare);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (currency already exists)");
        }
    }

    @Override
    public List<FareDTO> getAll() {
        List<Fare> allFares = fareRepository.findAll();
        if(allFares.isEmpty()) {
            throw new ResourseNotFound("No fares found");
        }
        return modelMapper.map(allFares, new TypeToken<List<FareDTO>>(){}.getType());
    }

    @Override
    public void deleteFare(Integer id) {
        try {
            Fare existingFare = fareRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Fare not found with id: " + id));

            fareRepository.delete(existingFare);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete fare: " + ex.getMessage());
        }
    }
}
