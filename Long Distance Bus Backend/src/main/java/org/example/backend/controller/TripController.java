package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.TripDTO;
import org.example.backend.service.TripService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/trip")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TripController {
    private final TripService tripService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveTrip(@Valid @RequestBody TripDTO tripDTO){
        log.info("INFO - Trip Created");
        log.warn("WARN -  Trip Created");
        log.debug("DEBUG -  Trip Created");
        log.error("ERROR - Trip Created");
        log.trace("TRACE - Trip Created");

        tripService.saveTrip(tripDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Trip Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyTrip(@RequestBody TripDTO tripDTO){
        tripService.updateTrip(tripDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Trip Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getTrips(){

        List<TripDTO> tripDTOS = tripService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        tripDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteTrip(@PathVariable Integer id) {
        tripService.deleteTrip(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Trip deleted successfully",
                        null
                )
        );
    }
}
