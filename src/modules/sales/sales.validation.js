const { z } = require('zod');

// Warehouse Validation
const createWarehouse = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    location: z.string().optional(),
    capacity: z.number().int().positive().optional(),
    manager_name: z.string().optional(),
    contact_number: z.string().optional(),
    is_active: z.boolean().default(true)
});

// Order Validation
const createOrder = z.object({
    customer_id: z.number().int().positive(),
    shipping_address: z.string().optional(),
    billing_address: z.string().optional(),
    notes: z.string().optional(),
    due_date: z.string().optional(),
    items: z.array(z.object({
        product_id: z.number().int().positive(),
        quantity: z.number().int().positive(),
        unit_price: z.number().positive(),
        discount: z.number().min(0).optional(),
        line_total: z.number().min(0).optional()
    })).min(1, 'At least one item is required')
});

// Invoice Validation
const createInvoice = z.object({
    order_id: z.number().int().positive(),
    due_date: z.string().optional() // YYYY-MM-DD
});

// Payment Validation
const createPayment = z.object({
    order_id: z.number().int().positive(),
    invoice_id: z.number().int().positive().optional(),
    amount: z.number().positive(),
    payment_method: z.string().min(1),
    reference_number: z.string().optional()
});

// Delivery Validation
const createDelivery = z.object({
    delivery_date: z.string().optional(),
    delivery_address: z.string().optional(),
    delivery_person_name: z.string().optional(),
    delivery_person_phone: z.string().optional(),
    tracking_number: z.string().optional(),
    status: z.enum(['pending', 'in_transit', 'delivered', 'failed', 'returned']).default('delivered'),
    notes: z.string().optional()
});

module.exports = {
    createWarehouse,
    createOrder,
    createInvoice,
    createPayment,
    createDelivery
};
