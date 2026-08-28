package com.minicrm.dashboard.service;

import com.minicrm.auth.entity.User;
import com.minicrm.auth.repository.UserRepository;
import com.minicrm.common.exception.ResourceNotFoundException;
import com.minicrm.contact.repository.ContactRepository;
import com.minicrm.dashboard.dto.DashboardDtos.*;
import com.minicrm.deal.repository.DealRepository;
import com.minicrm.email.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final DealRepository dealRepository;
    private final EmailLogRepository emailLogRepository;

    public DashboardStats getStats(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long totalContacts = contactRepository.countByUserId(user.getId());
        long wonDeals = dealRepository.countWon(user.getId());
        long totalDeals = dealRepository.countByUserId(user.getId());
        long progressed = dealRepository.countProgressed(user.getId());
        BigDecimal pipelineValue = dealRepository.getTotalPipelineValue(user.getId());

        double conversionRate = totalDeals > 0 ? (double) wonDeals / totalDeals * 100 : 0;

        List<Object[]> stageRaw = dealRepository.getStageStats(user.getId());
        List<StageCount> dealsByStage = stageRaw.stream()
            .map(row -> new StageCount(
                row[0].toString(),
                ((Number) row[1]).longValue(),
                row[2] instanceof BigDecimal bd ? bd : BigDecimal.valueOf(((Number) row[2]).doubleValue())
            ))
            .toList();

        List<Object[]> emailRaw = emailLogRepository.getStatusStats(user.getId());
        List<EmailStatusCount> emailsByStatus = emailRaw.stream()
            .map(row -> new EmailStatusCount(row[0].toString(), ((Number) row[1]).longValue()))
            .toList();

        return new DashboardStats(
            totalContacts, totalDeals,
            pipelineValue != null ? pipelineValue : BigDecimal.ZERO,
            wonDeals, Math.round(conversionRate * 10.0) / 10.0,
            dealsByStage, emailsByStatus
        );
    }
}
