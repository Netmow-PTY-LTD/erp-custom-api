const { z } = require('zod');
const createLeave = z.object({
    staff_id: z.number().int().positive(),
    leave_type: z.enum(['annual', 'sick', 'unpaid', 'maternity', 'paternity', 'emergency']),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    reason: z.string().optional()
});
const updateLeave = z.object({
    leave_type: z.enum(['annual', 'sick', 'unpaid', 'maternity', 'paternity', 'emergency']).optional(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    reason: z.string().optional()
});
const updateStatus = z.object({
    status: z.enum(['approved', 'rejected', 'cancelled'])
});
module.exports = {
    createLeave,
    updateLeave,
    updateStatus
};
