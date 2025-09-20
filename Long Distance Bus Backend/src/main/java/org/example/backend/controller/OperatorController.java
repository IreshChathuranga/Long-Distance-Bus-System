package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.OperatorDTO;
import org.example.backend.service.OperatorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/operator")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class OperatorController {
    private final OperatorService operatorService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveOperator(@Valid @RequestBody OperatorDTO operatorDTO){
        log.info("INFO - Operator Created");
        log.warn("WARN -  Operator Created");
        log.debug("DEBUG -  Operator Created");
        log.error("ERROR - Operator Created");
        log.trace("TRACE - Operator Created");

        operatorService.saveOperator(operatorDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Operator Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyOperator(@RequestBody OperatorDTO operatorDTO){
        operatorService.updateOperator(operatorDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Operator Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getOperators(){

        List<OperatorDTO> operatorDTOS = operatorService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        operatorDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteUser(@PathVariable Integer id) {
        operatorService.deleteOperator(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Operator deleted successfully",
                        null
                )
        );
    }
}
