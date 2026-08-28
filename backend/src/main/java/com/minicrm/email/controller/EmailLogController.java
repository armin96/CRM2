package com.minicrm.email.controller;

import com.minicrm.email.dto.EmailDtos.*;
import com.minicrm.email.service.EmailLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/emails")
@RequiredArgsConstructor
public class EmailLogController {

    private final EmailLogService emailLogService;

    @GetMapping
    public ResponseEntity<EmailPageResponse> getEmails(
        @AuthenticationPrincipal UserDetails user,
        @RequestParam(required = false) Long contactId,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(emailLogService.getEmails(user.getUsername(), contactId, page, size));
    }

    @PostMapping
    public ResponseEntity<EmailLogResponse> create(
        @AuthenticationPrincipal UserDetails user,
        @RequestBody EmailLogRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(emailLogService.create(user.getUsername(), request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EmailLogResponse> updateStatus(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @RequestBody StatusUpdateRequest request
    ) {
        return ResponseEntity.ok(emailLogService.updateStatus(user.getUsername(), id, request));
    }
}
