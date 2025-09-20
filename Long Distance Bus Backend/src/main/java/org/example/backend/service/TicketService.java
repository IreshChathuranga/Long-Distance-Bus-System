package org.example.backend.service;

import org.example.backend.dto.TicketDTO;

import java.util.List;

public interface TicketService {
    void saveTicket(TicketDTO ticketDTO);
    public void updateTicket(TicketDTO ticketDTO);
    List<TicketDTO> getAll();
    void deleteTicket(Integer id);
}
