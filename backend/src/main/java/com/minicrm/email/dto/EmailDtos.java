package com.minicrm.email.dto;

import com.minicrm.email.entity.EmailLog.EmailStatus;

import java.time.LocalDateTime;

public class EmailDtos {

    public record EmailLogRequest(
        Long contactId,
        Long dealId,
        String subject,
        String bodyPreview,
        LocalDateTime sentAt
    ) {}

    public record StatusUpdateRequest(EmailStatus status) {}

    public record EmailLogResponse(
        Long id,
        Long contactId,
        String contactName,
        Long dealId,
        String dealTitle,
        String subject,
        String bodyPreview,
        EmailStatus status,
        LocalDateTime sentAt,
        LocalDateTime openedAt,
        LocalDateTime repliedAt
    ) {}

    public record EmailPageResponse(
        java.util.List<EmailLogResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
    ) {}
}
