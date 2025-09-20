package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.SeatDTO;
import org.example.backend.service.SeatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/seat")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class SeatController {
    private final SeatService seatService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveSeats(@Valid @RequestBody List<SeatDTO> seatDTOs) {
        log.info("INFO - Seat Created");
        log.warn("WARN -  Seat Created");
        log.debug("DEBUG -  Seat Created");
        log.error("ERROR - Seat Created");
        log.trace("TRACE - Seat Created");

        seatService.saveSeat(seatDTOs);
        return new ResponseEntity<>(
                new APIResponse(200, "Seats Created Successfully", null),
                HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifySeat(@RequestBody SeatDTO seatDTO){
        seatService.updateSeat(seatDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Seat Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getSeats(){

        List<SeatDTO> seatDTOS = seatService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        seatDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteSeat(@PathVariable Integer id) {
        seatService.deleteSeat(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Seat deleted successfully",
                        null
                )
        );
    }
}
