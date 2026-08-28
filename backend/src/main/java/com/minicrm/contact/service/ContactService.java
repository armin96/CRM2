package com.minicrm.contact.service;

import com.minicrm.auth.entity.User;
import com.minicrm.auth.repository.UserRepository;
import com.minicrm.common.exception.ResourceNotFoundException;
import com.minicrm.contact.dto.ContactDtos.*;
import com.minicrm.contact.entity.Contact;
import com.minicrm.contact.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactPageResponse getContacts(String email, String search, int page, int size) {
        User user = getUserByEmail(email);
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Contact> result = contactRepository.findByUserAndSearch(user.getId(), search, pageable);
        List<ContactResponse> content = result.getContent().stream().map(this::toResponse).toList();
        return new ContactPageResponse(content, result.getNumber(), result.getSize(),
            result.getTotalElements(), result.getTotalPages());
    }

    public ContactResponse getById(String email, Long id) {
        Contact contact = findContactForUser(email, id);
        return toResponse(contact);
    }

    @Transactional
    public ContactResponse create(String email, ContactRequest request) {
        User user = getUserByEmail(email);
        Contact contact = Contact.builder()
            .user(user)
            .firstName(request.firstName())
            .lastName(request.lastName())
            .email(request.email())
            .phone(request.phone())
            .company(request.company())
            .title(request.title())
            .source(request.source())
            .tags(request.tags())
            .notes(request.notes())
            .build();
        return toResponse(contactRepository.save(contact));
    }

    @Transactional
    public ContactResponse update(String email, Long id, ContactRequest request) {
        Contact contact = findContactForUser(email, id);
        contact.setFirstName(request.firstName());
        contact.setLastName(request.lastName());
        contact.setEmail(request.email());
        contact.setPhone(request.phone());
        contact.setCompany(request.company());
        contact.setTitle(request.title());
        contact.setSource(request.source());
        contact.setTags(request.tags());
        contact.setNotes(request.notes());
        return toResponse(contactRepository.save(contact));
    }

    @Transactional
    public void delete(String email, Long id) {
        Contact contact = findContactForUser(email, id);
        contactRepository.delete(contact);
    }

    private Contact findContactForUser(String email, Long id) {
        User user = getUserByEmail(email);
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found: " + id));
        if (!contact.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Contact not found: " + id);
        }
        return contact;
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private ContactResponse toResponse(Contact c) {
        return new ContactResponse(
            c.getId(), c.getFirstName(), c.getLastName(), c.getFullName(),
            c.getEmail(), c.getPhone(), c.getCompany(), c.getTitle(),
            c.getSource(), c.getTags(), c.getNotes(), c.getCreatedAt(), c.getUpdatedAt()
        );
    }
}
