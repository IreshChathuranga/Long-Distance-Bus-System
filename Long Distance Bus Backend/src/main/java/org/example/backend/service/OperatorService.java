package org.example.backend.service;

import org.example.backend.dto.OperatorDTO;

import java.util.List;

public interface OperatorService {
    void saveOperator(OperatorDTO operatorDTO);
    public void updateOperator(OperatorDTO operatorDTO);
    List<OperatorDTO> getAll();
    void deleteOperator(Integer id);
}
