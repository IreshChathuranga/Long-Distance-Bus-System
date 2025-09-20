package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.BookingDTO;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/booking")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class BookingController {
    private final BookingService bookingService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveBooking(@Valid @RequestBody BookingDTO bookingDTO) {

        try {
            bookingService.saveBooking(bookingDTO);
            return new ResponseEntity<>(new APIResponse(200, "Booking Created Successfully", null), HttpStatus.CREATED);
        } catch (ResourseNotFound ex) {
            return new ResponseEntity<>(new APIResponse(404, ex.getMessage(), null), HttpStatus.NOT_FOUND);
        } catch (ResourseAllredyFound ex) {
            return new ResponseEntity<>(new APIResponse(409, ex.getMessage(), null), HttpStatus.CONFLICT);
        } catch (Exception ex) {
            return new ResponseEntity<>(new APIResponse(500, "Internal Server Error: " + ex.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyBooking(@RequestBody BookingDTO bookingDTO){
        bookingService.updateBooking(bookingDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Booking Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getBookings(){

        List<BookingDTO> bookingDTOS = bookingService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        bookingDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Booking deleted successfully",
                        null
                )
        );
    }

    @GetMapping("/{bookingRef}")
    public ResponseEntity<APIResponse> getBookingByRef(@PathVariable String bookingRef) {
        try {
            BookingDTO dto = bookingService.getBookingByRef(bookingRef);
            return ResponseEntity.ok(new APIResponse(200, "Success", dto));
        } catch (ResourseNotFound ex) {
            return new ResponseEntity<>(new APIResponse(404, ex.getMessage(), null), HttpStatus.NOT_FOUND);
        } catch (Exception ex) {
            return new ResponseEntity<>(new APIResponse(500, "Internal Server Error: " + ex.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
