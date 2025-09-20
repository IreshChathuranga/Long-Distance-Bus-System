package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.BusDTO;
import org.example.backend.entity.Bus;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.BusRepository;
import org.example.backend.service.BusService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {
    private final BusRepository busRepository;
    private final ModelMapper modelMapper;


    @Override
    public void saveBus(BusDTO busDTO) {
        try {
            busRepository.save(modelMapper.map(busDTO, Bus.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (plate_no already exists)");
        }
    }

    @Override
    public void updateBus(BusDTO busDTO) {
        Bus existingBus = busRepository.findById(busDTO.getBusId())
                .orElseThrow(() -> new ResourseNotFound("Bus not found with id: " + busDTO.getBusId()));

        try {
            Bus updatedBus = modelMapper.map(busDTO, Bus.class);
            busRepository.save(updatedBus);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (plate_no already exists)");
        }
    }

    @Override
    public List<BusDTO> getAll() {
        List<Bus> allBuses = busRepository.findAll();
        if(allBuses.isEmpty()) {
            throw new ResourseNotFound("No buses found");
        }
        return modelMapper.map(allBuses, new TypeToken<List<BusDTO>>(){}.getType());
    }

    @Override
    public void deleteBus(Integer id) {
        try {
            Bus existingBus = busRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Bus not found with id: " + id));

            busRepository.delete(existingBus);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete bus: " + ex.getMessage());
        }
    }
}
