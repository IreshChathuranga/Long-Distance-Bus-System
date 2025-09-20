package org.example.backend.repository;

import org.example.backend.dto.ScheduleSearchDTO;
import org.example.backend.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    @Query("""
SELECT new org.example.backend.dto.ScheduleSearchDTO(
    s.scheduleId, 
    s.daysOfWeek, 
    s.active,
    b.busId,
    b.plateNo,
    b.busType,
    r.routeId,
    r.name,
    t.departDateTime,
    t.arrivalEta,
    f.baseFare,
    t.tripId
)
FROM Schedule s
JOIN s.bus b
JOIN s.route r
LEFT JOIN Trip t ON t.schedule.scheduleId = s.scheduleId
LEFT JOIN Fare f ON f.route.routeId = r.routeId AND f.busType = b.busType
WHERE r.originStop.name = :from
  AND r.destinationStop.name = :to
  AND FUNCTION('DATE', t.departDateTime) = :date
""")
    List<ScheduleSearchDTO> searchSchedules(
            @Param("from") String from,
            @Param("to") String to,
            @Param("date") LocalDate date
    );
}
