package com.minicrm.deal.service;

import com.minicrm.auth.entity.User;
import com.minicrm.auth.repository.UserRepository;
import com.minicrm.common.exception.ResourceNotFoundException;
import com.minicrm.contact.entity.Contact;
import com.minicrm.contact.repository.ContactRepository;
import com.minicrm.deal.dto.DealDtos.*;
import com.minicrm.deal.entity.Deal;
import com.minicrm.deal.entity.Deal.DealStage;
import com.minicrm.deal.entity.Deal.Priority;
import com.minicrm.deal.repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;
    private final UserRepository userRepository;
    private final ContactRepository contactRepository;

    public KanbanBoard getKanbanBoard(String email) {
        User user = getUserByEmail(email);
        List<Deal> deals = dealRepository.findByUserIdOrderByStageAscPositionAsc(user.getId());

        // Build ordered map with all stages
        Map<String, List<DealResponse>> board = new LinkedHashMap<>();
        for (DealStage stage : DealStage.values()) {
            board.put(stage.name(), new ArrayList<>());
        }
        for (Deal d : deals) {
            board.get(d.getStage().name()).add(toResponse(d));
        }
        return new KanbanBoard(board);
    }

    public List<DealResponse> getAll(String email) {
        User user = getUserByEmail(email);
        return dealRepository.findByUserIdOrderByStageAscPositionAsc(user.getId())
            .stream().map(this::toResponse).toList();
    }

    @Transactional
    public DealResponse create(String email, DealRequest request) {
        User user = getUserByEmail(email);
        Contact contact = null;
        if (request.contactId() != null) {
            contact = contactRepository.findById(request.contactId()).orElse(null);
        }
        // Position: append to end of stage column
        List<Deal> existing = dealRepository.findByUserIdAndStageOrderByPositionAsc(
            user.getId(), request.stage() != null ? request.stage() : DealStage.LEAD);
        int pos = existing.isEmpty() ? 0 : existing.get(existing.size() - 1).getPosition() + 1;

        Deal deal = Deal.builder()
            .user(user)
            .contact(contact)
            .title(request.title())
            .value(request.value())
            .stage(request.stage() != null ? request.stage() : DealStage.LEAD)
            .priority(request.priority() != null ? request.priority() : Priority.MEDIUM)
            .expectedCloseDate(request.expectedCloseDate())
            .notes(request.notes())
            .position(pos)
            .build();
        return toResponse(dealRepository.save(deal));
    }

    @Transactional
    public DealResponse update(String email, Long id, DealRequest request) {
        Deal deal = findDealForUser(email, id);
        Contact contact = null;
        if (request.contactId() != null) {
            contact = contactRepository.findById(request.contactId()).orElse(null);
        }
        deal.setContact(contact);
        deal.setTitle(request.title());
        deal.setValue(request.value());
        deal.setStage(request.stage() != null ? request.stage() : deal.getStage());
        deal.setPriority(request.priority() != null ? request.priority() : deal.getPriority());
        deal.setExpectedCloseDate(request.expectedCloseDate());
        deal.setNotes(request.notes());
        return toResponse(dealRepository.save(deal));
    }

    @Transactional
    public DealResponse updateStage(String email, Long id, StageUpdateRequest request) {
        Deal deal = findDealForUser(email, id);
        deal.setStage(request.stage());
        deal.setPosition(request.position());
        return toResponse(dealRepository.save(deal));
    }

    @Transactional
    public void delete(String email, Long id) {
        Deal deal = findDealForUser(email, id);
        dealRepository.delete(deal);
    }

    private Deal findDealForUser(String email, Long id) {
        User user = getUserByEmail(email);
        Deal deal = dealRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Deal not found: " + id));
        if (!deal.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Deal not found: " + id);
        }
        return deal;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private DealResponse toResponse(Deal d) {
        String contactName = d.getContact() != null ? d.getContact().getFullName() : null;
        Long contactId = d.getContact() != null ? d.getContact().getId() : null;
        return new DealResponse(
            d.getId(), d.getTitle(), contactId, contactName,
            d.getValue(), d.getStage(), d.getPriority(),
            d.getExpectedCloseDate(), d.getNotes(), d.getPosition(),
            d.getCreatedAt(), d.getUpdatedAt()
        );
    }
}
