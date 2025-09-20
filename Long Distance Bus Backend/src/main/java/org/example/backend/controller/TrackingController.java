package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/tracking")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TrackingController {
    @GetMapping("/location/{tripId}")
    public ResponseEntity<Map<String, Object>> getFakeLocation(@PathVariable Integer tripId) {
        Map<String, Object> data = new HashMap<>();
        data.put("latitude", 7.2510); // Near Kegalle
        data.put("longitude", 80.3464);
        data.put("speed", 65);
        data.put("remainingKm", 45);
        data.put("locationText", "Near Kegalle, A1 Highway");
        data.put("eta", "2025-09-10T11:45:00");
        data.put("status", "Moving");
        data.put("lastUpdated", "2 minutes ago");
        return ResponseEntity.ok(data);
    }
}
