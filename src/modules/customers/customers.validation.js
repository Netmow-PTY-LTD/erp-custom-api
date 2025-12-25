const { z } = require('zod');

const createCustomer = z.object({
    name: z.string().min(1, 'Customer name is required').max(255),
    email: z.string().email('Invalid email format').max(255).optional(),
    phone: z.string().max(50).optional(),
    company: z.string().max(255).optional(),
    address: z.string().optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postal_code: z.string().max(20).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    tax_id: z.string().max(100).optional(),
    credit_limit: z.number().min(0).optional(),
    outstanding_balance: z.number().min(0).optional(),
    customer_type: z.enum(['individual', 'business']).default('individual'),
    sales_route_id: z.number().int().positive().optional(),
    salesRouteId: z.number().int().positive().optional(), // camelCase alias
    notes: z.string().optional(),
    is_active: z.boolean().default(true)
}).transform(data => {
    // Convert salesRouteId to sales_route_id if provided
    if (data.salesRouteId !== undefined && data.sales_route_id === undefined) {
        data.sales_route_id = data.salesRouteId;
    }
    delete data.salesRouteId;
    return data;
});

const updateCustomer = z.object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email('Invalid email format').max(255).optional(),
    phone: z.string().max(50).optional(),
    company: z.string().max(255).optional(),
    address: z.string().optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    postal_code: z.string().max(20).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    tax_id: z.string().max(100).optional(),
    credit_limit: z.number().min(0).optional(),
    outstanding_balance: z.number().min(0).optional(),
    customer_type: z.enum(['individual', 'business']).optional(),
    sales_route_id: z.number().int().positive().optional().nullable(),
    salesRouteId: z.number().int().positive().optional().nullable(), // camelCase alias
    notes: z.string().optional(),
    is_active: z.boolean().optional()
}).transform(data => {
    // Convert salesRouteId to sales_route_id if provided
    if (data.salesRouteId !== undefined && data.sales_route_id === undefined) {
        data.sales_route_id = data.salesRouteId;
    }
    delete data.salesRouteId;
    return data;
});

module.exports = {
    createCustomer,
    updateCustomer
};
