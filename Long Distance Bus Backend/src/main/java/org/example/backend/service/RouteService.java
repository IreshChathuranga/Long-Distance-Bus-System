package org.example.backend.service;

import org.example.backend.dto.RouteDTO;

import java.util.List;

public interface RouteService {
    void saveRoute(RouteDTO routeDTO);
    public void updateRoute(RouteDTO routeDTO);
    List<RouteDTO> getAll();
    void deleteRoute(Integer id);
}
