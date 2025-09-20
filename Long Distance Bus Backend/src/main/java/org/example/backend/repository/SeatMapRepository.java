package org.example.backend.repository;

import org.example.backend.entity.SeatMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeatMapRepository extends JpaRepository<SeatMap, Integer> {
}
