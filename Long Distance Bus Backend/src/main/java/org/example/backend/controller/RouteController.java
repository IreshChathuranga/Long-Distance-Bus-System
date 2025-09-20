package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.RouteDTO;
import org.example.backend.service.RouteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/route")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class RouteController {
    private final RouteService routeService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveRoute(@Valid @RequestBody RouteDTO routeDTO){
        log.info("INFO - Route Created");
        log.warn("WARN -  Route Created");
        log.debug("DEBUG -  Route Created");
        log.error("ERROR - Route Created");
        log.trace("TRACE - Route Created");

        routeService.saveRoute(routeDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Route Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyRoute(@RequestBody RouteDTO routeDTO){
        routeService.updateRoute(routeDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Route Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getRoutes(){

        List<RouteDTO> routeDTOS = routeService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        routeDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteRoute(@PathVariable Integer id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Route deleted successfully",
                        null
                )
        );
    }
}
