# Profit & Loss Calculation Logic

This document outlines the methodology for calculating Profit & Loss (P&L) within the application. It integrates data from **Sales**, **Products**, **Accounting** (Incomes/Expenses mapped to Heads), and **Payroll** to produce a comprehensive financial financial statement.

## 1. Executive Summary

The **Net Profit** is calculated as:
`Net Profit = (Sales Revenue - COGS) + Other Income - Operating Expenses`

Where:
*   **Sales Revenue** & **COGS** come from the Sales module.
*   **Other Income** comes from the Accounting module (credit transactions).
*   **Operating Expenses** come from the Accounting module (debit transactions) + Payroll.

---

## 2. Detailed Breakdown by Component

### A. Gross Revenue (Sales)
Revenue is realized from confirmed customer orders.

*   **Source Table**: `orders`
*   **Logic**: Sum of `total_amount` for all orders that are effectively "sold".
*   **Included Statuses**: `'delivered'`, `'shipped'`, `'paid'`, `'confirmed'`. (Exclude `'cancelled'`, `'returned'`, `'pending'`).
*   **Formula**:
    ```sql
    SELECT SUM(total_amount) 
    FROM orders 
    WHERE status IN ('delivered', 'shipped', 'confirmed')
    AND order_date BETWEEN :start_date AND :end_date;
    ```

### B. Cost of Goods Sold (COGS)
COGS represents the direct costs of producing the goods sold.

*   **Source Tables**: `order_items`, `products`
*   **Logic**: Multiply limits quantity sold by the product's unit cost.
*   **Formula**:
    ```sql
    SELECT SUM(oi.quantity * p.cost) AS total_cogs
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status IN ('delivered', 'shipped', 'confirmed')
    AND o.order_date BETWEEN :start_date AND :end_date;
    ```
*   **Result**: **Gross Profit** = `Gross Revenue` - `COGS`

### C. Operating Expenses (OpEx) - Broken down by Account Heads
Expenses are categorized by `Debit Heads` (Accounts). This allows for a granular view of where money is going (e.g., "Rent", "Utilities", "Salary").

*   **Source Tables**: `expenses`, `debit_heads`
*   **Logic**: Sum of expense amounts grouped by their associated Debit Head name.
*   **Grouping SQL**:
    ```sql
    SELECT dh.name AS account_name, SUM(e.amount) AS total
    FROM expenses e
    LEFT JOIN debit_heads dh ON e.debit_head_id = dh.id
    WHERE e.status IN ('approved', 'paid')
    AND e.expense_date BETWEEN :start_date AND :end_date
    GROUP BY dh.name;
    ```

### D. Payroll Costs (Staff Salaries)
Staff costs are often the largest operating expense.

*   **Source Table**: `payrolls`
*   **Logic**: Sum of Gross Salary (`basic_salary` + `allowances`).
*   **Formula**:
    ```sql
    SELECT SUM(basic_salary + allowances) AS total_payroll
    FROM payrolls 
    WHERE status IN ('paid', 'processed')
    AND salary_month BETWEEN :start_month AND :end_month;
    ```

### E. Other Income (Non-Operating) - Broken down by Account Heads
Income from sources other than direct product sales, categorized by `Credit Heads` (e.g., "Consulting", "Asset Sale").

*   **Source Tables**: `incomes`, `credit_heads`
*   **Grouping SQL**:
    ```sql
    SELECT ch.name AS account_name, SUM(i.amount) AS total
    FROM incomes i
    LEFT JOIN credit_heads ch ON i.credit_head_id = ch.id
    WHERE i.income_date BETWEEN :start_date AND :end_date
    GROUP BY ch.name;
    ```

---

## 3. Resulting P&L Report Structure

A generated report should follow this JSON structure, aggregating the data from the queries above:

```json
{
  "report_period": { "start": "2023-01-01", "end": "2023-12-31" },
  "currency": "USD",
  "income_statement": {
    "revenue": {
      "sales_revenue": 150000.00,
      "other_income": {
        "Consulting": 5000.00,
        "Interest": 200.00,
        "total": 5200.00
      },
      "total_gross_income": 155200.00
    },
    "cogs": 60000.00,
    "gross_profit": 95200.00,
    "expenses": {
      "operating_expenses": {
        "Rent": 12000.00,
        "Utilities": 2400.00,
        "Marketing": 5000.00,
        "Office Supplies": 1500.00
      },
      "payroll": 45000.00,
      "total_expenses": 65900.00
    },
    "net_profit": 29300.00
  }
}
```

---

## 4. Accounts & General Ledger Considerations

### Account Mapping
To ensure the "Whole Calculation" is accurate, every transaction must map to an Account Head:
*   **Sales**: Mapped internally to a "Sales" Credit Account (Virtual).
*   **COGS**: Mapped internally to "Inventory Asset" (Credit) and "COGS Expense" (Debit).
*   **Expenses**: Maps `debit_head_id` -> Debit Account.
*   **Incomes**: Maps `credit_head_id` -> Credit Account.
*   **Payroll**: Maps to "Salaries & Wages" Debit Account.

### Cash Flow vs Accrual
*   **Accrual Basis (Recommended)**:
    *   Sales are counted when `confirmed`/`shipped`, regardless of payment.
    *   Expenses are counted when `approved`, regardless of payment.
*   **Cash Basis**:
    *   Sales counted only when `payment_status` = `'paid'`.
    *   Expenses counted only when `status` = `'paid'`.
    *   *The queries above currently lean towards Accrual (using status='confirmed'/'approved').*

---

## 5. Implementation Algorithm (Pseudo-Code)

```javascript
async function generateProfitLossStatement(startDate, endDate) {
    // 1. Fetch Sales Revenue
    const sales = await Order.sum('total_amount', { 
        where: { 
            status: ['delivered', 'shipped', 'confirmed'], 
            order_date: { [Op.between]: [startDate, endDate] } 
        } 
    });

    // 2. Calculate COGS
    const cogsItems = await OrderItem.findAll({
        include: [{ model: Product }, { model: Order, where: { status: ... } }]
    });
    const cogs = cogsItems.reduce((sum, item) => sum + (item.quantity * item.Product.cost), 0);

    // 3. Fetch Expenses Grouped by Head
    const expenseGroups = await Expense.findAll({
        where: { expense_date: ... },
        include: [DebitHead],
        group: ['DebitHead.name'],
        attributes: ['DebitHead.name', [fn('SUM', col('amount')), 'total']]
    });

    // 4. Fetch Payroll
    const payrollTotal = await Payroll.sum('basic_salary', { where: ... }); // + allowances

    // 5. Fetch Other Income Grouped by Head
    const incomeGroups = await Income.findAll({
        where: { income_date: ... },
        include: [CreditHead],
        group: ['CreditHead.name'],
        attributes: ['CreditHead.name', [fn('SUM', col('amount')), 'total']]
    });

    // 6. Aggregate
    const totalRevenue = sales + incomeGroups.reduce((s, i) => s + i.total, 0);
    const totalExpenses = expenseGroups.reduce((s, e) => s + e.total, 0) + payrollTotal;
    const grossProfit = sales - cogs;
    const netProfit = (grossProfit + incomeGroups.total) - totalExpenses;

    return { sales, cogs, grossProfit, expenses: expenseGroups, payroll: payrollTotal, netProfit };
}
```
