package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "schedules")
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Integer scheduleId;

    @ManyToOne
    @JoinColumn(name = "bus_id", nullable = false, foreignKey = @ForeignKey(name = "fk_sched_bus"))
    @JsonIgnore
    private Bus bus;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false, foreignKey = @ForeignKey(name = "fk_sched_route"))
    @JsonIgnore
    private Route route;

    @Column(name = "depart_time", nullable = false)
    private LocalDate departTime;

    @Column(name = "days_of_week", nullable = false, length = 50)
    private String daysOfWeek;

    @Column(name = "active", nullable = false)
    private String active;
}
