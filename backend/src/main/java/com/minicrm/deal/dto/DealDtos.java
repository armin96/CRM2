package com.minicrm.deal.dto;

import com.minicrm.deal.entity.Deal.DealStage;
import com.minicrm.deal.entity.Deal.Priority;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DealDtos {

    public record DealRequest(
        String title,
        Long contactId,
        BigDecimal value,
        DealStage stage,
        Priority priority,
        LocalDate expectedCloseDate,
        String notes
    ) {}

    public record StageUpdateRequest(
        DealStage stage,
        int position
    ) {}

    public record DealResponse(
        Long id,
        String title,
        Long contactId,
        String contactName,
        BigDecimal value,
        DealStage stage,
        Priority priority,
        LocalDate expectedCloseDate,
        String notes,
        int position,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {}

    public record KanbanBoard(
        java.util.Map<String, java.util.List<DealResponse>> columns
    ) {}
}
