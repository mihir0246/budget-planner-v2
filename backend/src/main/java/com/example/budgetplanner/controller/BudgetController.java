package com.example.budgetplanner.controller;

import com.example.budgetplanner.entity.Income;
import com.example.budgetplanner.entity.Expense;
import com.example.budgetplanner.repository.IncomeRepository;
import com.example.budgetplanner.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/budget")
@CrossOrigin(origins = "*") // For frontend integration
public class BudgetController {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    // Income CRUD
    @GetMapping("/income")
    public List<Income> getAllIncome() {
        return incomeRepository.findAll();
    }

    @PostMapping("/income")
    public Income addIncome(@Valid @RequestBody Income income) {
        return incomeRepository.save(income);
    }

    @PutMapping("/income/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable Long id, @Valid @RequestBody Income incomeDetails) {
        Income income = incomeRepository.findById(id).orElseThrow(() -> new RuntimeException("Income not found"));
        income.setSource(incomeDetails.getSource());
        income.setAmount(incomeDetails.getAmount());
        income.setMonth(incomeDetails.getMonth());
        Income updatedIncome = incomeRepository.save(income);
        return ResponseEntity.ok(updatedIncome);
    }

    @DeleteMapping("/income/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {
        Income income = incomeRepository.findById(id).orElseThrow(() -> new RuntimeException("Income not found"));
        incomeRepository.delete(income);
        return ResponseEntity.noContent().build();
    }

    // Expense CRUD
    @GetMapping("/expense")
    public List<Expense> getAllExpense() {
        return expenseRepository.findAll();
    }

    @PostMapping("/expense")
    public Expense addExpense(@Valid @RequestBody Expense expense) {
        return expenseRepository.save(expense);
    }

    @PutMapping("/expense/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @Valid @RequestBody Expense expenseDetails) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        expense.setCategory(expenseDetails.getCategory());
        expense.setAmount(expenseDetails.getAmount());
        expense.setMonth(expenseDetails.getMonth());
        Expense updatedExpense = expenseRepository.save(expense);
        return ResponseEntity.ok(updatedExpense);
    }

    @DeleteMapping("/expense/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
        expenseRepository.delete(expense);
        return ResponseEntity.noContent().build();
    }

    // Get balance for a month
    @GetMapping("/balance/{month}")
    public ResponseEntity<Map<String, Double>> getBalance(@PathVariable String month) {
        Double totalIncome = incomeRepository.sumByMonth(month);
        Double totalExpense = expenseRepository.sumByMonth(month);
        if (totalIncome == null) totalIncome = 0.0;
        if (totalExpense == null) totalExpense = 0.0;
        Double balance = totalIncome - totalExpense;
        Map<String, Double> response = new HashMap<>();
        response.put("totalIncome", totalIncome);
        response.put("totalExpense", totalExpense);
        response.put("balance", balance);
        return ResponseEntity.ok(response);
    }

    // Get transactions by month
    @GetMapping("/transactions/{month}")
    public ResponseEntity<Map<String, List<?>>> getTransactions(@PathVariable String month) {
        List<Income> incomes = incomeRepository.findByMonth(month);
        List<Expense> expenses = expenseRepository.findByMonth(month);
        Map<String, List<?>> response = new HashMap<>();
        response.put("incomes", incomes);
        response.put("expenses", expenses);
        return ResponseEntity.ok(response);
    }
}
