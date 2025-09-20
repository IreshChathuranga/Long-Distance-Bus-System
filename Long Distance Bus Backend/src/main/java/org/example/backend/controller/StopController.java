package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.StopDTO;
import org.example.backend.service.StopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/stop")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class StopController {
    private final StopService stopService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveStop(@Valid @RequestBody StopDTO stopDTO){
        log.info("INFO - Stop Created");
        log.warn("WARN -  Stop Created");
        log.debug("DEBUG -  Stop Created");
        log.error("ERROR - Stop Created");
        log.trace("TRACE - Stop Created");

        stopService.saveStop(stopDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Stop Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyStop(@RequestBody StopDTO stopDTO){
        stopService.updateStop(stopDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Stop Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getStops(){

        List<StopDTO> stopDTOS = stopService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        stopDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteBus(@PathVariable Integer id) {
        stopService.deleteStop(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Stop deleted successfully",
                        null
                )
        );
    }
}
