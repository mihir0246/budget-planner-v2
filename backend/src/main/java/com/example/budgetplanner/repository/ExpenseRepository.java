package com.example.budgetplanner.repository;

import com.example.budgetplanner.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByMonth(String month);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.month = :month")
    Double sumByMonth(@Param("month") String month);
}
