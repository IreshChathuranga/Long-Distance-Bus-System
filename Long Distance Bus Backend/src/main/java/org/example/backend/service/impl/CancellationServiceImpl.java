package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.CancellationDTO;
import org.example.backend.entity.Cancellation;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.CancellationRepository;
import org.example.backend.service.CancellationService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CancellationServiceImpl implements CancellationService {
    private final CancellationRepository cancellationRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveCancellation(CancellationDTO cancellationDTO) {
        try {
            cancellationRepository.save(modelMapper.map(cancellationDTO, Cancellation.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public void updateCancellation(CancellationDTO cancellationDTO) {
        Cancellation existingCancellation = cancellationRepository.findById(cancellationDTO.getCancellationId())
                .orElseThrow(() -> new ResourseNotFound("Booking not found with id: " + cancellationDTO.getCancellationId()));

        try {
            Cancellation updatedCancellation = modelMapper.map(cancellationDTO, Cancellation.class);
            cancellationRepository.save(updatedCancellation);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public List<CancellationDTO> getAll() {
        List<Cancellation> allCancellations = cancellationRepository.findAll();
        if(allCancellations.isEmpty()) {
            throw new ResourseNotFound("No cancellations found");
        }
        return modelMapper.map(allCancellations, new TypeToken<List<CancellationDTO>>(){}.getType());
    }

    @Override
    public void deleteCancellation(Integer id) {
        try {
            Cancellation existingCancellation = cancellationRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Cancellation not found with id: " + id));

            cancellationRepository.delete(existingCancellation);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete cancellation: " + ex.getMessage());
        }
    }
}
