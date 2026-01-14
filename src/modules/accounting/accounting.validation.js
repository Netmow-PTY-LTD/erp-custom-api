const { z } = require('zod');

// --- Account Management ---
const createAccount = z.object({
    code: z.string().min(1, 'Code is required').max(20),
    name: z.string().min(1, 'Name is required').max(100),
    type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE']),
    parent_id: z.number().int().positive().nullable().optional(),
    description: z.string().optional()
});

const updateAccount = z.object({
    name: z.string().min(1).max(100).optional(),
    type: z.enum(['ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE']).optional(),
    parent_id: z.number().int().positive().nullable().optional(),
    description: z.string().optional()
});

// --- Transactions ---
const createTransaction = z.object({
    type: z.enum([
        'SALES', 'PURCHASE', 'SALES_RETURN', 'PURCHASE_RETURN',
        'EXPENSE', 'INCOME', 'BANK_DEPOSIT', 'PROFESSIONAL_FEE'
    ]),
    amount: z.number().positive('Amount must be positive'),
    payment_mode: z.enum(['CASH', 'BANK', 'DUE', 'CHEQUE']).default('CASH'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
    description: z.string().optional(),
    // Optional context fields
    person: z.string().optional(), // For professional fee (e.g. SURGEON)
    reference: z.string().optional()
});

module.exports = {
    createAccount,
    updateAccount,
    createTransaction
};
