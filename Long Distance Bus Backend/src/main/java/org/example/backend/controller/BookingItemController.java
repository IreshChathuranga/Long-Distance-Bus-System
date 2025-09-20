package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.BookingItemDTO;
import org.example.backend.service.BookingItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/bookingitem")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class BookingItemController {
    private final BookingItemService bookingItemService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveBookingItem(@Valid @RequestBody BookingItemDTO bookingItemDTO){
        log.info("INFO - BookingItem Created");
        log.warn("WARN -  BookingItem Created");
        log.debug("DEBUG -  BookingItem Created");
        log.error("ERROR - BookingItem Created");
        log.trace("TRACE - BookingItem Created");

        bookingItemService.saveBookingItem(bookingItemDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "BookingItem Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyBookingItem(@RequestBody BookingItemDTO bookingItemDTO){
        bookingItemService.updateBookingItem(bookingItemDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "BookingItem Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getBookingItems(){

        List<BookingItemDTO> bookingItemDTOS = bookingItemService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        bookingItemDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteBookingItem(@PathVariable Integer id) {
        bookingItemService.deleteBookingItem(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "BookingItem deleted successfully",
                        null
                )
        );
    }
}
