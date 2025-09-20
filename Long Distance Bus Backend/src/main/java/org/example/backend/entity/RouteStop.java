package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "route_stops")
public class RouteStop {
    @EmbeddedId
    private RouteStopId id;

    @ManyToOne
    @MapsId("routeId")
    @JoinColumn(name = "route_id", nullable = false, foreignKey = @ForeignKey(name = "fk_routes_routeId"))
    private Route route;

    @ManyToOne
    @MapsId("stopId")
    @JoinColumn(name = "stop_id", nullable = false, foreignKey = @ForeignKey(name = "fk_stops_stopId"))
    private Stop stop;

    @Column(name = "seq_no", nullable = false)
    private Integer seqNo;

    @Column(name = "arrival_offset_min", nullable = false)
    private Integer arrivalOffsetMin;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @EqualsAndHashCode
    @Embeddable
    public static class RouteStopId implements Serializable {
        private Integer routeId;
        private Integer stopId;
    }
}
