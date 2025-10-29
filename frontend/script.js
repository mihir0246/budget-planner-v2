const API_BASE = 'http://localhost:8080/api/budget';

// Load dashboard data
async function loadDashboard() {
    const month = document.getElementById('month-select').value;
    try {
        const response = await fetch(`${API_BASE}/balance/${month}`);
        const data = await response.json();
        document.getElementById('total-income').textContent = data.totalIncome.toFixed(2);
        document.getElementById('total-expenses').textContent = data.totalExpense.toFixed(2);
        document.getElementById('net-balance').textContent = data.balance.toFixed(2);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
    loadTransactions(month);
}

// Load transactions
async function loadTransactions(month) {
    try {
        const response = await fetch(`${API_BASE}/transactions/${month}`);
        const data = await response.json();
        const transactionsList = document.getElementById('transactions-list');
        const categoryFilter = document.getElementById('category-filter');
        const selectedCategory = categoryFilter.value;

        // Populate category filter options
        const categories = new Set();
        data.expenses.forEach(expense => categories.add(expense.category));
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
        categoryFilter.value = selectedCategory; // Restore selected value

        transactionsList.innerHTML = '';

        data.incomes.forEach(income => {
            if (selectedCategory === '' || income.source === selectedCategory) {
                const div = document.createElement('div');
                div.className = 'transaction income';
                div.innerHTML = `
                    <p><strong>Income:</strong> ${income.source} - $${income.amount.toFixed(2)}</p>
                    <button onclick="editIncome(${income.id})">Edit</button>
                    <button onclick="deleteIncome(${income.id})">Delete</button>
                `;
                transactionsList.appendChild(div);
            }
        });

        data.expenses.forEach(expense => {
            if (selectedCategory === '' || expense.category === selectedCategory) {
                const div = document.createElement('div');
                div.className = 'transaction expense';
                div.innerHTML = `
                    <p><strong>Expense:</strong> ${expense.category} - $${expense.amount.toFixed(2)}</p>
                    <button onclick="editExpense(${expense.id})">Edit</button>
                    <button onclick="deleteExpense(${expense.id})">Delete</button>
                `;
                transactionsList.appendChild(div);
            }
        });
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Add income
document.getElementById('income-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const income = {
        source: document.getElementById('income-source').value,
        amount: parseFloat(document.getElementById('income-amount').value),
        month: document.getElementById('income-month').value
    };
    try {
        await fetch(`${API_BASE}/income`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(income)
        });
        document.getElementById('income-form').reset();
        loadDashboard();
    } catch (error) {
        console.error('Error adding income:', error);
    }
});

// Add expense
document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const expense = {
        category: document.getElementById('expense-category').value,
        amount: parseFloat(document.getElementById('expense-amount').value),
        month: document.getElementById('expense-month').value
    };
    try {
        await fetch(`${API_BASE}/expense`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        document.getElementById('expense-form').reset();
        loadDashboard();
    } catch (error) {
        console.error('Error adding expense:', error);
    }
});

// Delete income
async function deleteIncome(id) {
    try {
        await fetch(`${API_BASE}/income/${id}`, { method: 'DELETE' });
        loadDashboard();
    } catch (error) {
        console.error('Error deleting income:', error);
    }
}

// Delete expense
async function deleteExpense(id) {
    try {
        await fetch(`${API_BASE}/expense/${id}`, { method: 'DELETE' });
        loadDashboard();
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// Edit income
async function editIncome(id) {
    try {
        // Fetch current income data
        const response = await fetch(`${API_BASE}/income`);
        const incomes = await response.json();
        const income = incomes.find(i => i.id === id);
        if (!income) return;

        // Prompt for new values
        const newSource = prompt('Enter new source:', income.source);
        const newAmount = prompt('Enter new amount:', income.amount);
        const newMonth = prompt('Enter new month (YYYY-MM):', income.month);

        if (newSource && newAmount && newMonth) {
            const updatedIncome = {
                source: newSource,
                amount: parseFloat(newAmount),
                month: newMonth
            };
            await fetch(`${API_BASE}/income/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedIncome)
            });
            loadDashboard();
        }
    } catch (error) {
        console.error('Error editing income:', error);
    }
}

// Edit expense
async function editExpense(id) {
    try {
        // Fetch current expense data
        const response = await fetch(`${API_BASE}/expense`);
        const expenses = await response.json();
        const expense = expenses.find(e => e.id === id);
        if (!expense) return;

        // Prompt for new values
        const newCategory = prompt('Enter new category:', expense.category);
        const newAmount = prompt('Enter new amount:', expense.amount);
        const newMonth = prompt('Enter new month (YYYY-MM):', expense.month);

        if (newCategory && newAmount && newMonth) {
            const updatedExpense = {
                category: newCategory,
                amount: parseFloat(newAmount),
                month: newMonth
            };
            await fetch(`${API_BASE}/expense/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedExpense)
            });
            loadDashboard();
        }
    } catch (error) {
        console.error('Error editing expense:', error);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});
