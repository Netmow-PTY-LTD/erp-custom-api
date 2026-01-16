const { z } = require('zod');
const createPayroll = z.object({
    staff_id: z.number().int().positive(),
    month: z.string().min(1, 'Month is required'),
    year: z.number().int().min(2000).max(2100),
    basic_salary: z.number().positive(),
    allowances: z.record(z.string(), z.number()).optional(),
    deductions: z.record(z.string(), z.number()).optional(),
    payment_date: z.string().optional(),
    status: z.enum(['pending', 'paid', 'cancelled']).optional(),
    payment_method: z.enum(['bank_transfer', 'cash', 'cheque']).optional(),
    notes: z.string().optional()
});
const updatePayroll = z.object({
    basic_salary: z.number().positive().optional(),
    allowances: z.record(z.string(), z.number()).optional(),
    deductions: z.record(z.string(), z.number()).optional(),
    payment_date: z.string().optional(),
    status: z.enum(['pending', 'paid', 'cancelled']).optional(),
    payment_method: z.enum(['bank_transfer', 'cash', 'cheque']).optional(),
    notes: z.string().optional()
});
module.exports = {
    createPayroll,
    updatePayroll
};
