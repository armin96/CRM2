package com.minicrm.deal.controller;

import com.minicrm.deal.dto.DealDtos.*;
import com.minicrm.deal.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping("/kanban")
    public ResponseEntity<KanbanBoard> getKanban(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(dealService.getKanbanBoard(user.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<DealResponse>> getAll(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(dealService.getAll(user.getUsername()));
    }

    @PostMapping
    public ResponseEntity<DealResponse> create(
        @AuthenticationPrincipal UserDetails user,
        @RequestBody DealRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(dealService.create(user.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DealResponse> update(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @RequestBody DealRequest request
    ) {
        return ResponseEntity.ok(dealService.update(user.getUsername(), id, request));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<DealResponse> updateStage(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @RequestBody StageUpdateRequest request
    ) {
        return ResponseEntity.ok(dealService.updateStage(user.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        dealService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
