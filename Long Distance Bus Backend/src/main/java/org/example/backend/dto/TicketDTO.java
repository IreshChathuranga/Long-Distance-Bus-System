package org.example.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TicketDTO {
    private Integer ticketId;

    private Integer bookingItemId;

    private String ticketNumber;

    private String qrHash;

    private LocalDateTime issuedAt = LocalDateTime.now();
}
