const { z } = require('zod');
exports.createSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4),
    role_id: z.number().int().nullable().optional()
});
exports.updateSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(4).optional(),
    role_id: z.number().int().nullable().optional()
});
