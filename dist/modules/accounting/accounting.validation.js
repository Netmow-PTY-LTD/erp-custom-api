const { z } = require('zod');
// Income Validation
const createIncome = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    amount: z.number().positive(),
    income_date: z.string(), // YYYY-MM-DD
    category: z.string().optional(),
    credit_head_id: z.number().int().positive().optional(),
    description: z.string().optional(),
    reference_number: z.string().optional(),
    payment_method: z.string().optional()
});
// Expense Validation
const createExpense = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    amount: z.number().positive(),
    expense_date: z.string(), // YYYY-MM-DD
    category: z.string().optional(),
    debit_head_id: z.number().int().positive().optional(),
    description: z.string().optional(),
    reference_number: z.string().optional(),
    payment_method: z.string().optional(),
    status: z.enum(['pending', 'approved', 'paid', 'rejected']).default('pending')
});
// Payroll Validation
const createPayroll = z.object({
    staff_id: z.number().int().positive(),
    salary_month: z.string().regex(/^\d{4}-\d{2}$/, 'Format must be YYYY-MM'),
    basic_salary: z.number().positive(),
    allowances: z.number().min(0).optional(),
    deductions: z.number().min(0).optional(),
    payment_date: z.string().optional(), // YYYY-MM-DD
    status: z.enum(['pending', 'processed', 'paid']).default('pending'),
    notes: z.string().optional()
});
// Credit Head Validation
const createCreditHead = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    code: z.string().max(50).optional(),
    description: z.string().optional(),
    parent_id: z.number().int().positive().optional(),
    is_active: z.boolean().default(true)
});
const updateCreditHead = z.object({
    name: z.string().min(1).max(255).optional(),
    code: z.string().max(50).optional(),
    description: z.string().optional(),
    parent_id: z.number().int().positive().optional(),
    is_active: z.boolean().optional()
});
// Debit Head Validation
const createDebitHead = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    code: z.string().max(50).optional(),
    description: z.string().optional(),
    parent_id: z.number().int().positive().optional(),
    is_active: z.boolean().default(true)
});
const updateDebitHead = z.object({
    name: z.string().min(1).max(255).optional(),
    code: z.string().max(50).optional(),
    description: z.string().optional(),
    parent_id: z.number().int().positive().optional(),
    is_active: z.boolean().optional()
});
module.exports = {
    createIncome,
    createExpense,
    createPayroll,
    createCreditHead,
    updateCreditHead,
    createDebitHead,
    updateDebitHead
};
