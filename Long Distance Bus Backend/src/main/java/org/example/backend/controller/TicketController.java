package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.TicketDTO;
import org.example.backend.service.TicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/ticket")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class TicketController {
    private final TicketService ticketService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveTicket(@Valid @RequestBody TicketDTO ticketDTO){
        log.info("INFO - Ticket Created");
        log.warn("WARN -  Ticket Created");
        log.debug("DEBUG -  Ticket Created");
        log.error("ERROR - Ticket Created");
        log.trace("TRACE - Ticket Created");

        ticketService.saveTicket(ticketDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Ticket Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyTicket(@RequestBody TicketDTO ticketDTO){
        ticketService.updateTicket(ticketDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Ticket Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getTickets(){

        List<TicketDTO> ticketDTOS = ticketService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        ticketDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteTicket(@PathVariable Integer id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Ticket deleted successfully",
                        null
                )
        );
    }
}
