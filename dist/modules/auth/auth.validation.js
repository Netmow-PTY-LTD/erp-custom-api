const { z } = require('zod');
exports.loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
});
exports.registerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role_id: z.number().optional()
});
exports.refreshSchema = z.object({
    refreshToken: z.string().optional(),
    refresh_token: z.string().optional()
});
