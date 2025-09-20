package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.ScheduleDTO;
import org.example.backend.dto.ScheduleSearchDTO;
import org.example.backend.service.ScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RequestMapping("api/v1/schedule")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class ScheduleController {
    private final ScheduleService scheduleService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO){
        log.info("INFO - Schedule Created");
        log.warn("WARN -  Schedule Created");
        log.debug("DEBUG -  Schedule Created");
        log.error("ERROR - Schedule Created");
        log.trace("TRACE - Schedule Created");

        scheduleService.saveSchedule(scheduleDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Schedule Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifySchedule(@RequestBody ScheduleDTO scheduleDTO){
        scheduleService.updateSchedule(scheduleDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Schedule Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getSchedules(){

        List<ScheduleDTO> scheduleDTOS = scheduleService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        scheduleDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteSchedule(@PathVariable Integer id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Schedule deleted successfully",
                        null
                )
        );
    }

    @GetMapping("/search")
    public ResponseEntity<APIResponse> searchSchedules(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam String date
    ) {
        LocalDate parsedDate = LocalDate.parse(date);
        List<ScheduleSearchDTO> schedules = scheduleService.searchSchedules(from, to, parsedDate);
        return ResponseEntity.ok(new APIResponse(200, "Search Results", schedules));
    }
}
