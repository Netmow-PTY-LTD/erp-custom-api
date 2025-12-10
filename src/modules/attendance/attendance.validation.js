const { z } = require('zod');

const checkIn = z.object({
    staff_id: z.number().int().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    check_in: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Invalid time format (HH:mm:ss)').optional(),
    status: z.enum(['present', 'late', 'half_day']).optional(),
    notes: z.string().optional()
});

const checkOut = z.object({
    staff_id: z.number().int().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    check_out: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Invalid time format (HH:mm:ss)')
});

const updateAttendance = z.object({
    check_in: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).optional(),
    check_out: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/).optional(),
    status: z.enum(['present', 'absent', 'late', 'half_day', 'on_leave']).optional(),
    notes: z.string().optional()
});

module.exports = {
    checkIn,
    checkOut,
    updateAttendance
};
