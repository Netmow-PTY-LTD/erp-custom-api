const express = require('express');
const router = express.Router();
const reportController = require('./reports.controller');
const { verifyToken } = require('../../core/middleware/auth');
const { moduleCheck } = require('../../core/middleware/moduleCheck');
const { handlerWithFields } = require('../../core/utils/zodTypeView');
const validate = require('../../core/middleware/validate');
const { dateRangeSchema, monthYearSchema, yearSchema } = require('./reports.validation');
// Module name for routes-tree grouping
router.moduleName = 'Reports';
router.use(verifyToken);
// router.use(moduleCheck('reports')); // Optional: Enable if you add a 'reports' toggle in settings
// Define routes metadata
router.routesMeta = [
    // --- Sales ---
    {
        path: '/sales/summary',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getSalesSummary(req, res),
        description: 'Get sales summary (revenue, orders)',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' },
        sampleResponse: {
            status: true,
            data: {
                total_orders: 150,
                total_revenue: 45000.00,
                average_order_value: 300.00
            }
        }
    },
    {
        path: '/sales/top-customers',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getTopCustomers(req, res),
        description: 'Get top customers by revenue',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', limit: 'Number' },
        sampleResponse: {
            success: true,
            message: 'Top customers retrieved',
            pagination: {
                total: 2,
                page: '1',
                limit: '5',
                totalPage: 1
            },
            data: [
                {
                    id: 1,
                    name: 'Acme Corp',
                    email: 'contact@acme.com',
                    order_count: 12,
                    total_spent: 15000.00
                },
                {
                    id: 5,
                    name: 'Global Tech',
                    email: 'info@globaltech.com',
                    order_count: 8,
                    total_spent: 9500.00
                }
            ]
        }
    },
    {
        path: '/sales/top-products',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getTopProducts(req, res),
        description: 'Get top selling products',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', limit: 'Number' },
        sampleResponse: {
            success: true,
            message: 'Top products retrieved',
            pagination: {
                total: 2,
                page: '1',
                limit: '5',
                totalPage: 1
            },
            data: [
                {
                    id: 101,
                    name: 'Wireless Mouse',
                    sku: 'WM-001',
                    total_quantity_sold: 500,
                    total_revenue: 12500.00
                },
                {
                    id: 102,
                    name: 'Mechanical Keyboard',
                    sku: 'MK-002',
                    total_quantity_sold: 300,
                    total_revenue: 24000.00
                }
            ]
        }
    },
    {
        path: '/sales/by-customer',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getSalesByCustomer(req, res),
        description: 'Get sales grouped by customer',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', page: 'Number', limit: 'Number' },
        sampleResponse: {
            success: true,
            message: 'Sales by customer retrieved',
            pagination: {
                total: 2,
                page: 1,
                limit: 10,
                totalPage: 1
            },
            data: [
                { customer: "Tech Solutions Sdn Bhd", orders: 12, sales: 15000.00 },
                { customer: "Global Trading Co", orders: 5, sales: 8000.00 }
            ]
        }
    },
    {
        path: '/customers/account-receivables',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getAccountReceivables(req, res),
        description: 'Get account receivables (unpaid invoices)',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', page: 'Number', limit: 'Number' },
        sampleResponse: {
            success: true,
            message: 'Account receivables retrieved',
            pagination: {
                total: 6,
                page: 1,
                limit: 10,
                totalPage: 1
            },
            data: [
                {
                    invoiceNumber: "INV-20251012-D72F5C",
                    customer: "Modern Enterprises",
                    date: "2025-10-12",
                    due: "2025-10-19",
                    total: 1325,
                    paid: 0,
                    balance: 1325
                },
                {
                    invoiceNumber: "INV2025003",
                    customer: "Innovative Systems",
                    date: "2025-10-03",
                    due: "2025-11-02",
                    total: 715.5,
                    paid: 0,
                    balance: 715.5
                }
            ]
        }
    },
    // --- Purchase ---
    {
        path: '/purchase/summary',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getPurchaseSummary(req, res),
        description: 'Get purchase summary',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' },
        sampleResponse: {
            status: true,
            data: {
                total_orders: 45,
                total_spent: 32000.00
            }
        }
    },
    {
        path: '/purchase/by-supplier',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getSpendingBySupplier(req, res),
        description: 'Get spending breakdown by supplier',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', limit: 'Number (default: 10)' },
        sampleResponse: {
            success: true,
            message: 'Supplier spending retrieved',
            pagination: {
                total: 2,
                page: '1',
                limit: '10',
                totalPage: 1
            },
            data: [
                {
                    id: 3,
                    name: 'Tech Supplies Inc',
                    po_count: 15,
                    total_spent: 18000.00
                },
                {
                    id: 7,
                    name: 'Office Depot',
                    po_count: 10,
                    total_spent: 5000.00
                }
            ]
        }
    },
    // --- Inventory ---
    {
        path: '/inventory/status',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => reportController.getInventoryStatus(req, res),
        description: 'Get current inventory status (low stock, out of stock)',
        sampleResponse: {
            status: true,
            data: {
                total_products: 500,
                low_stock_count: 12,
                out_of_stock_count: 3
            }
        }
    },
    {
        path: '/inventory/valuation',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => reportController.getInventoryValuation(req, res),
        description: 'Get total inventory valuation, units and potential sales',
        sampleResponse: {
            status: true,
            data: {
                total_units: 1500,
                total_Valuation: 95000.00,
                potential_Sales_Value: 150000.00
            }
        }
    },
    {
        path: '/inventory/low-stock-list',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => reportController.getLowStockList(req, res),
        description: 'Get list of products with low stock',
        queryParams: {
            page: 'Page number (default: 1)',
            limit: 'Items per page (default: 10)'
        },
        sampleResponse: {
            status: true,
            pagination: {
                total: 2,
                page: 1,
                limit: 10,
                totalPage: 1
            },
            data: [
                { sku: "SKU004", product: "Laptop Computer", stock: -16, minLevel: 5 },
                { sku: "SKU010", product: "Cable Management", stock: 1, minLevel: 10 }
            ]
        }
    },
    // --- HR ---
    {
        path: '/hr/attendance',
        method: 'GET',
        middlewares: [validate(monthYearSchema, 'query')],
        handler: (req, res) => reportController.getAttendanceSummary(req, res),
        description: 'Get monthly attendance summary with pagination',
        queryParams: {
            month: '1-12',
            year: 'YYYY',
            page: 'Page number (default: 1)',
            limit: 'Items per page (default: 10)'
        },
        sampleResponse: {
            success: true,
            message: 'Attendance summary retrieved',
            pagination: {
                total: 20,
                page: '1',
                limit: '10',
                totalPage: 2
            },
            data: [
                {
                    id: 1,
                    first_name: 'John',
                    last_name: 'Doe',
                    present_days: 20,
                    late_days: 2,
                    absent_days: 0,
                    half_days: 0
                }
            ]
        }
    },
    {
        path: '/hr/payroll',
        method: 'GET',
        middlewares: [validate(yearSchema, 'query')],
        handler: (req, res) => reportController.getPayrollSummary(req, res),
        description: 'Get annual payroll summary',
        queryParams: { year: 'YYYY' },
        sampleResponse: {
            success: true,
            message: 'Payroll summary retrieved',
            pagination: {
                total: 2,
                page: '1',
                limit: '12',
                totalPage: 1
            },
            data: [
                {
                    month: 'January',
                    staff_paid: 15,
                    total_basic: 75000.00,
                    total_net_payout: 72000.00
                },
                {
                    month: 'February',
                    staff_paid: 16,
                    total_basic: 80000.00,
                    total_net_payout: 76500.00
                }
            ]
        }
    },
    // --- Finance ---
    {
        path: '/finance/profit-loss',
        method: 'GET',
        middlewares: [validate(dateRangeSchema, 'query')],
        handler: (req, res) => reportController.getProfitLoss(req, res),
        description: 'Get Profit & Loss statement',
        queryParams: { startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD' },
        sampleResponse: {
            status: true,
            data: {
                revenue: 120000.00,
                cogs: 80000.00,
                gross_profit: 40000.00,
                expenses: 15000.00,
                net_profit: 25000.00
            }
        }
    }
];
// Register routes
router.routesMeta.forEach(r => {
    router[r.method.toLowerCase()](r.path, ...r.middlewares, r.handler);
});
module.exports = router;
