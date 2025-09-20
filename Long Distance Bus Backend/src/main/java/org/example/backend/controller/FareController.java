package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.FareDTO;
import org.example.backend.service.FareService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/fare")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class FareController {
    private final FareService fareService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveFare(@Valid @RequestBody FareDTO fareDTO){
        log.info("INFO - Fare Created");
        log.warn("WARN -  Fare Created");
        log.debug("DEBUG -  Fare Created");
        log.error("ERROR - Fare Created");
        log.trace("TRACE - Fare Created");

        fareService.saveFare(fareDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Fare Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyFare(@RequestBody FareDTO fareDTO){
        fareService.updateFare(fareDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Fare Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getFares(){

        List<FareDTO> fareDTOS = fareService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        fareDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteFare(@PathVariable Integer id) {
        fareService.deleteFare(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Fare deleted successfully",
                        null
                )
        );
    }
}
