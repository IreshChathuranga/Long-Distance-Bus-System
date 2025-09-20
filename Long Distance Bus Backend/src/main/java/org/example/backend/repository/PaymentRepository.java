package org.example.backend.repository;

import org.example.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    boolean existsByBookingRef(String bookingRef); // duplicate save
}
