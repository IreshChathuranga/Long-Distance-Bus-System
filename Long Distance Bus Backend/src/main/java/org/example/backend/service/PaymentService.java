package org.example.backend.service;

import org.example.backend.dto.PaymentDTO;

import java.util.List;

public interface PaymentService {
    void savePayment(PaymentDTO paymentDTO);
    public void updatePayment(PaymentDTO paymentDTO);
    List<PaymentDTO> getAll();
    void deletePayment(Integer id);
}
