package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.SeatMapDTO;
import org.example.backend.service.SeatMapService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/seatmap")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class SeatMapController {
    private final SeatMapService seatMapService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveSeatMap(@Valid @RequestBody SeatMapDTO seatMapDTO){
        log.info("INFO - SeatMap Created");
        log.warn("WARN -  SeatMap Created");
        log.debug("DEBUG -  SeatMap Created");
        log.error("ERROR - SeatMap Created");
        log.trace("TRACE - SeatMap Created");

        seatMapService.saveSeatMap(seatMapDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "SeatMap Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifySeatMap(@RequestBody SeatMapDTO seatMapDTO){
        seatMapService.updateSeatMap(seatMapDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "SeatMap Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getSeatMaps(){

        List<SeatMapDTO> seatMapDTOS = seatMapService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        seatMapDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteSeatMap(@PathVariable Integer id) {
        seatMapService.deleteSeatMap(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "SeatMap deleted successfully",
                        null
                )
        );
    }
}
