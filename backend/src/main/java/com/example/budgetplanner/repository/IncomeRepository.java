package com.example.budgetplanner.repository;

import com.example.budgetplanner.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findByMonth(String month);

    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.month = :month")
    Double sumByMonth(@Param("month") String month);
}
