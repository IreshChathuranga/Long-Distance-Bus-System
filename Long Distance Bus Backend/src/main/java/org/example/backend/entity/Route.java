package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Integer routeId;

    @Column(name = "code", nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "name", nullable = false, length = 200)
    private String name;

    @ManyToOne
    @JoinColumn(name = "origin_stop_id", nullable = false ,  foreignKey = @ForeignKey(name = "fk_stop_originStop"))
    @JsonIgnore
    private Stop originStop;

    @ManyToOne
    @JoinColumn(name = "destination_stop_id", nullable = false ,  foreignKey = @ForeignKey(name = "fk_stop_destinationStop"))
    @JsonIgnore
    private Stop destinationStop;

    @Column(name = "distance_km", precision = 6, scale = 2)
    private BigDecimal distanceKm;
}
