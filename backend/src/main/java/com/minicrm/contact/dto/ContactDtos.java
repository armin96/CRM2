package com.minicrm.contact.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class ContactDtos {

    public record ContactRequest(
        @NotBlank String firstName,
        String lastName,
        String email,
        String phone,
        String company,
        String title,
        String source,
        String[] tags,
        String notes
    ) {}

    public record ContactResponse(
        Long id,
        String firstName,
        String lastName,
        String fullName,
        String email,
        String phone,
        String company,
        String title,
        String source,
        String[] tags,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {}

    public record ContactPageResponse(
        java.util.List<ContactResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
    ) {}
}
