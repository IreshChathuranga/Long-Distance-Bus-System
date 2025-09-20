package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.BusDTO;
import org.example.backend.service.BusService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/bus")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class BusController {
    private final BusService busService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveBus(@Valid @RequestBody BusDTO busDTO){
        log.info("INFO - Bus Created");
        log.warn("WARN -  Bus Created");
        log.debug("DEBUG -  Bus Created");
        log.error("ERROR - Bus Created");
        log.trace("TRACE - Bus Created");

        busService.saveBus(busDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Bus Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyBus(@RequestBody BusDTO busDTO){
        busService.updateBus(busDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Bus Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getBuss(){

        List<BusDTO> busDTOS = busService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        busDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteBus(@PathVariable Integer id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Bus deleted successfully",
                        null
                )
        );
    }
}
