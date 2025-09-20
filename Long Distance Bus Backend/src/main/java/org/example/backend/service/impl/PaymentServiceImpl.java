package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.PaymentDTO;
import org.example.backend.entity.Payment;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.PaymentRepository;
import org.example.backend.service.PaymentService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final ModelMapper modelMapper;

    @Override
    public void savePayment(PaymentDTO paymentDTO) {
        try {
            paymentRepository.save(modelMapper.map(paymentDTO, Payment.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public void updatePayment(PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(paymentDTO.getPaymentId())
                .orElseThrow(() -> new ResourseNotFound("Booking not found with id: " + paymentDTO.getPaymentId()));

        try {
            Payment updatedPayment = modelMapper.map(paymentDTO, Payment.class);
            paymentRepository.save(updatedPayment);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public List<PaymentDTO> getAll() {
        List<Payment> allPayments = paymentRepository.findAll();
        if(allPayments.isEmpty()) {
            throw new ResourseNotFound("No payments found");
        }
        return modelMapper.map(allPayments, new TypeToken<List<PaymentDTO>>(){}.getType());
    }

    @Override
    public void deletePayment(Integer id) {
        try {
            Payment existingPayment = paymentRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Payment not found with id: " + id));

            paymentRepository.delete(existingPayment);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete payment: " + ex.getMessage());
        }
    }
}
