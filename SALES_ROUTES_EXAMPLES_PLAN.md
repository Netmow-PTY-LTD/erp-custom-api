# Sales Module Routes - Examples Implementation Plan

## Routes That Already Have Examples ✅
1. `/orders/by-route` - Route-wise sales orders (DONE - 3 examples)

## Routes That Have Examples in Other Files ✅
2. `/reports/sales/summary` - Has examples
3. `/reports/charts` - Has examples

## Priority Routes to Add Examples (Top 10)

### High Priority - Core Operations
1. **GET /orders** - Get all orders
   - Example 1: Get all orders (default pagination)
   - Example 2: Filter by status (pending)
   - Example 3: Search by order number

2. **POST /orders** - Create new order
   - Example 1: Simple order with one item
   - Example 2: Order with multiple items and discount

3. **GET /orders/:id** - Get order by ID
   - Example 1: Get specific order details

4. **GET /orders/stats** - Get order statistics
   - Example 1: Get current stats

### Medium Priority - Invoices & Payments
5. **GET /orders/invoices** - Get all invoices
   - Example 1: Get all invoices
   - Example 2: Filter unpaid invoices

6. **POST /orders/invoices** - Create invoice
   - Example 1: Create invoice for order

7. **GET /orders/payments** - Get all payments
   - Example 1: Get all payments
   - Example 2: Filter by order

8. **POST /orders/payments** - Create payment
   - Example 1: Record payment for invoice

### Lower Priority - Deliveries & Others
9. **POST /orders/:id/deliver** - Record delivery
   - Example 1: Mark order as delivered

10. **GET /warehouses** - Get warehouses
    - Example 1: Get all warehouses

## Implementation Strategy

For each route, I'll add 1-3 examples with:
- Title and description
- Full request URL with parameters
- Complete sample response structure

This will provide comprehensive documentation while keeping the file manageable.
