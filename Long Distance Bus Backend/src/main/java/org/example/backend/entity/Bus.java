package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "buses")
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bus_id")
    private Integer busId;

    @ManyToOne
    @JoinColumn(name = "operator_id", nullable = false, foreignKey = @ForeignKey(name = "fk_buses_operator"))
    @JsonIgnore
    private Operator operator;

    @Column(name = "plate_no", nullable = false, unique = true, length = 20)
    private String plateNo;

    @Column(name = "bus_type", nullable = false, length = 15)
    private String busType;

    @Column(name = "amenities", nullable = false, length = 1000)
    private String amenities;

    @Column(name = "active", nullable = false , length = 10)
    private String active;
}
