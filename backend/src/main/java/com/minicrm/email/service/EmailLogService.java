package com.minicrm.email.service;

import com.minicrm.auth.entity.User;
import com.minicrm.auth.repository.UserRepository;
import com.minicrm.common.exception.ResourceNotFoundException;
import com.minicrm.contact.entity.Contact;
import com.minicrm.contact.repository.ContactRepository;
import com.minicrm.deal.entity.Deal;
import com.minicrm.deal.repository.DealRepository;
import com.minicrm.email.dto.EmailDtos.*;
import com.minicrm.email.entity.EmailLog;
import com.minicrm.email.entity.EmailLog.EmailStatus;
import com.minicrm.email.repository.EmailLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmailLogService {

    private final EmailLogRepository emailLogRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;
    private final DealRepository dealRepository;

    public EmailPageResponse getEmails(String email, Long contactId, int page, int size) {
        User user = getUserByEmail(email);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        Page<EmailLog> result;
        if (contactId != null) {
            result = emailLogRepository.findByUserIdAndContactIdOrderBySentAtDesc(user.getId(), contactId, pageable);
        } else {
            result = emailLogRepository.findByUserIdOrderBySentAtDesc(user.getId(), pageable);
        }
        List<EmailLogResponse> content = result.getContent().stream().map(this::toResponse).toList();
        return new EmailPageResponse(content, result.getNumber(), result.getSize(),
            result.getTotalElements(), result.getTotalPages());
    }

    @Transactional
    public EmailLogResponse create(String email, EmailLogRequest request) {
        User user = getUserByEmail(email);
        Contact contact = request.contactId() != null
            ? contactRepository.findById(request.contactId()).orElse(null) : null;
        Deal deal = request.dealId() != null
            ? dealRepository.findById(request.dealId()).orElse(null) : null;

        EmailLog log = EmailLog.builder()
            .user(user)
            .contact(contact)
            .deal(deal)
            .subject(request.subject())
            .bodyPreview(request.bodyPreview())
            .status(EmailStatus.SENT)
            .sentAt(request.sentAt() != null ? request.sentAt() : LocalDateTime.now())
            .build();
        return toResponse(emailLogRepository.save(log));
    }

    @Transactional
    public EmailLogResponse updateStatus(String email, Long id, StatusUpdateRequest request) {
        User user = getUserByEmail(email);
        EmailLog log = emailLogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Email log not found: " + id));
        if (!log.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Email log not found: " + id);
        }
        log.setStatus(request.status());
        if (request.status() == EmailStatus.OPENED && log.getOpenedAt() == null) {
            log.setOpenedAt(LocalDateTime.now());
        } else if (request.status() == EmailStatus.REPLIED && log.getRepliedAt() == null) {
            log.setRepliedAt(LocalDateTime.now());
        }
        return toResponse(emailLogRepository.save(log));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private EmailLogResponse toResponse(EmailLog e) {
        String contactName = e.getContact() != null ? e.getContact().getFullName() : null;
        String dealTitle = e.getDeal() != null ? e.getDeal().getTitle() : null;
        return new EmailLogResponse(
            e.getId(),
            e.getContact() != null ? e.getContact().getId() : null,
            contactName,
            e.getDeal() != null ? e.getDeal().getId() : null,
            dealTitle,
            e.getSubject(),
            e.getBodyPreview(),
            e.getStatus(),
            e.getSentAt(),
            e.getOpenedAt(),
            e.getRepliedAt()
        );
    }
}
