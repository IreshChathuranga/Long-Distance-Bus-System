package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "booking_items")
public class BookingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_item_id")
    private Integer bookingItemId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bitems_booking"))
    @JsonIgnore
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "trip_seat_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bitems_tripseat"))
    @JsonIgnore
    private TripSeat tripSeat;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "fare_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal fareAmount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToOne(mappedBy = "bookingItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Ticket ticket;
}
