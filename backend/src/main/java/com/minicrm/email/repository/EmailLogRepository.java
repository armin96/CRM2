package com.minicrm.email.repository;

import com.minicrm.email.entity.EmailLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {

    Page<EmailLog> findByUserIdOrderBySentAtDesc(Long userId, Pageable pageable);

    Page<EmailLog> findByUserIdAndContactIdOrderBySentAtDesc(Long userId, Long contactId, Pageable pageable);

    @Query("SELECT e.status, COUNT(e) FROM EmailLog e WHERE e.user.id = :userId GROUP BY e.status")
    java.util.List<Object[]> getStatusStats(@Param("userId") Long userId);
}
