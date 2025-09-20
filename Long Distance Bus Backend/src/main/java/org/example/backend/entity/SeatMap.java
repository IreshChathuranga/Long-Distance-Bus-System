package org.example.backend.entity;

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
@Table(name = "seat_maps")
public class SeatMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_map_id")
    private Integer seatMapId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "rows_count", nullable = false)
    private Integer rowsCount;

    @Column(name = "cols_count", nullable = false)
    private Integer colsCount;

    @Column(name = "layout", nullable = false, columnDefinition = "JSON")
    private String layout;

}
