package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.CancellationDTO;
import org.example.backend.service.CancellationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/cancellation")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class CancellationController {
    private final CancellationService cancellationService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveCancellation(@Valid @RequestBody CancellationDTO cancellationDTO){
        log.info("INFO - Cancellation Created");
        log.warn("WARN -  Cancellation Created");
        log.debug("DEBUG -  Cancellation Created");
        log.error("ERROR - Cancellation Created");
        log.trace("TRACE - Cancellation Created");

        cancellationService.saveCancellation(cancellationDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Cancellation Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyCancellation(@RequestBody CancellationDTO cancellationDTO){
        cancellationService.updateCancellation(cancellationDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Cancellation Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getCancellations(){

        List<CancellationDTO> cancellationDTOS = cancellationService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        cancellationDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteCancellation(@PathVariable Integer id) {
        cancellationService.deleteCancellation(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Cancellation deleted successfully",
                        null
                )
        );
    }
}
