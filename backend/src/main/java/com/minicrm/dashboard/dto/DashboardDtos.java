package com.minicrm.dashboard.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardDtos {

    public record StageCount(String stage, long count, BigDecimal value) {}

    public record EmailStatusCount(String status, long count) {}

    public record DashboardStats(
        long totalContacts,
        long totalDeals,
        BigDecimal totalPipelineValue,
        long wonDeals,
        double conversionRate,
        List<StageCount> dealsByStage,
        List<EmailStatusCount> emailsByStatus
    ) {}
}
