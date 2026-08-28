package com.minicrm.contact.controller;

import com.minicrm.contact.dto.ContactDtos.*;
import com.minicrm.contact.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ContactPageResponse> getContacts(
        @AuthenticationPrincipal UserDetails user,
        @RequestParam(defaultValue = "") String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(contactService.getContacts(user.getUsername(), search, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getById(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(contactService.getById(user.getUsername(), id));
    }

    @PostMapping
    public ResponseEntity<ContactResponse> create(
        @AuthenticationPrincipal UserDetails user,
        @Valid @RequestBody ContactRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(contactService.create(user.getUsername(), request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> update(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id,
        @Valid @RequestBody ContactRequest request
    ) {
        return ResponseEntity.ok(contactService.update(user.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
        @AuthenticationPrincipal UserDetails user,
        @PathVariable Long id
    ) {
        contactService.delete(user.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
