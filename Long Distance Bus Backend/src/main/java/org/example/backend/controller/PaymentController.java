package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.PaymentDTO;
import org.example.backend.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/payment")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> savePayment(@Valid @RequestBody PaymentDTO paymentDTO){
        log.info("INFO - Payment Created");
        log.warn("WARN -  Payment Created");
        log.debug("DEBUG -  Payment Created");
        log.error("ERROR - Payment Created");
        log.trace("TRACE - Payment Created");

        paymentService.savePayment(paymentDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Payment Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyPayment(@RequestBody PaymentDTO paymentDTO){
        paymentService.updatePayment(paymentDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Payment Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getBookings(){

        List<PaymentDTO> paymentDTOS = paymentService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        paymentDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Payment deleted successfully",
                        null
                )
        );
    }
}
