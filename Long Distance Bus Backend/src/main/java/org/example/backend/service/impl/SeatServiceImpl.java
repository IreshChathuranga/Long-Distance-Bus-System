package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.SeatDTO;
import org.example.backend.entity.Seat;
import org.example.backend.entity.SeatMap;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.SeatMapRepository;
import org.example.backend.repository.SeatRepository;
import org.example.backend.service.SeatService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatServiceImpl implements SeatService {
    private final SeatRepository seatRepository;
    private final SeatMapRepository seatMapRepository;
    private final ModelMapper modelMapper;


    public void saveSeat(List<SeatDTO> seatDTOs) {
        for (SeatDTO seatDTO : seatDTOs) {
            SeatMap seatMap = seatMapRepository.findById(seatDTO.getSeatMapId())
                    .orElseThrow(() -> new ResourseNotFound("SeatMap not found with id: " + seatDTO.getSeatMapId()));

            Seat seat = new Seat();
            seat.setSeatNumber(seatDTO.getSeatNumber());
            seat.setRowNo(seatDTO.getRowNo());
            seat.setColNo(seatDTO.getColNo());
            seat.setSeatType(seatDTO.getSeatType());
            seat.setSeatMap(seatMap);

            seatRepository.save(seat);
        }
    }

    @Override
    public void updateSeat(SeatDTO seatDTO) {
        Seat existingSeat = seatRepository.findById(seatDTO.getSeatId())
                .orElseThrow(() -> new ResourseNotFound("Seat not found with id: " + seatDTO.getSeatId()));

        existingSeat.setSeatNumber(seatDTO.getSeatNumber());
        existingSeat.setRowNo(seatDTO.getRowNo());
        existingSeat.setColNo(seatDTO.getColNo());
        existingSeat.setSeatType(seatDTO.getSeatType());

        SeatMap seatMap = seatMapRepository.findById(seatDTO.getSeatMapId())
                .orElseThrow(() -> new ResourseNotFound("SeatMap not found with id: " + seatDTO.getSeatMapId()));
        existingSeat.setSeatMap(seatMap);

        try {
            seatRepository.save(existingSeat);
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (seat_number,row_no and col_no already exists)");
        }
    }

    @Override
    public List<SeatDTO> getAll() {
        List<Seat> allSeats = seatRepository.findAll();
        if(allSeats.isEmpty()) {
            throw new ResourseNotFound("No seats found");
        }
        return modelMapper.map(allSeats, new TypeToken<List<SeatDTO>>(){}.getType());
    }

    @Override
    public void deleteSeat(Integer id) {
        try {
            Seat existingSeat = seatRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Seat not found with id: " + id));

            seatRepository.delete(existingSeat);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete seat: " + ex.getMessage());
        }
    }
}
