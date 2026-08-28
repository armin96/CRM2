package com.minicrm.deal.repository;

import com.minicrm.deal.entity.Deal;
import com.minicrm.deal.entity.Deal.DealStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    List<Deal> findByUserIdOrderByStageAscPositionAsc(Long userId);

    List<Deal> findByUserIdAndStageOrderByPositionAsc(Long userId, DealStage stage);

    long countByUserId(Long userId);

    @Query("SELECT d.stage, COUNT(d), COALESCE(SUM(d.value), 0) FROM Deal d WHERE d.user.id = :userId GROUP BY d.stage")
    List<Object[]> getStageStats(@Param("userId") Long userId);

    @Query("SELECT COALESCE(SUM(d.value), 0) FROM Deal d WHERE d.user.id = :userId AND d.stage NOT IN ('WON', 'LOST')")
    BigDecimal getTotalPipelineValue(@Param("userId") Long userId);

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.user.id = :userId AND d.stage = 'WON'")
    long countWon(@Param("userId") Long userId);

    @Query("SELECT COUNT(d) FROM Deal d WHERE d.user.id = :userId AND d.stage NOT IN ('LEAD')")
    long countProgressed(@Param("userId") Long userId);
}
