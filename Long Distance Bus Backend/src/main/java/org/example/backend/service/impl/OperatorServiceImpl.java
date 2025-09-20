package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.OperatorDTO;
import org.example.backend.entity.Operator;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.OperatorRepository;
import org.example.backend.service.OperatorService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OperatorServiceImpl implements OperatorService {
    private final OperatorRepository operatorRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveOperator(OperatorDTO operatorDTO) {
        try {
            operatorRepository.save(modelMapper.map(operatorDTO, Operator.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (email or hotline already exists)");
        }
    }

    @Override
    public void updateOperator(OperatorDTO operatorDTO) {
        Operator existingOperator = operatorRepository.findById(operatorDTO.getOperatorId())
                .orElseThrow(() -> new ResourseNotFound("User not found with id: " + operatorDTO.getOperatorId()));

        try {
            Operator updatedOperator = modelMapper.map(operatorDTO, Operator.class);
            operatorRepository.save(updatedOperator);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (email or hotline already exists)");
        }
    }

    @Override
    public List<OperatorDTO> getAll() {
        List<Operator> allOperators = operatorRepository.findAll();
        if(allOperators.isEmpty()) {
            throw new ResourseNotFound("No operators found");
        }
        return modelMapper.map(allOperators, new TypeToken<List<OperatorDTO>>(){}.getType());
    }

    @Override
    public void deleteOperator(Integer id) {
        try {
            Operator existingOperator = operatorRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Operator not found with id: " + id));

            operatorRepository.delete(existingOperator);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete operator: " + ex.getMessage());
        }
    }
}
