package com.minicrm.contact.repository;

import com.minicrm.contact.entity.Contact;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("""
        SELECT c FROM Contact c
        WHERE c.user.id = :userId
        AND (:search IS NULL OR :search = '' OR
             LOWER(c.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(c.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
             LOWER(c.company) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Contact> findByUserAndSearch(
        @Param("userId") Long userId,
        @Param("search") String search,
        Pageable pageable
    );

    long countByUserId(Long userId);
}
