package org.example.backend.service;

import org.example.backend.dto.ScheduleDTO;
import org.example.backend.dto.ScheduleSearchDTO;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {
    void saveSchedule(ScheduleDTO scheduleDTO);
    public void updateSchedule(ScheduleDTO scheduleDTO);
    List<ScheduleDTO> getAll();
    void deleteSchedule(Integer id);
    List<ScheduleSearchDTO> searchSchedules(String from, String to, LocalDate date);}
