package com.minicrm.dashboard.controller;

import com.minicrm.dashboard.dto.DashboardDtos.DashboardStats;
import com.minicrm.dashboard.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(dashboardService.getStats(user.getUsername()));
    }
}
