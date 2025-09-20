package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "trip_id")
    private Integer tripId;

    @ManyToOne
    @JoinColumn(name = "schedule_id", foreignKey = @ForeignKey(name = "fk_trips_schedule"))
    @JsonIgnore
    private Schedule schedule;

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    @Column(name = "depart_datetime", nullable = false)
    private LocalDateTime departDateTime;

    @Column(name = "arrival_eta")
    private LocalDateTime arrivalEta;

    @Column(name = "status", nullable = false, length = 20)
    private String status; //        SCHEDULED, BOARDING, IN_PROGRESS, COMPLETED, CANCELLED
}
