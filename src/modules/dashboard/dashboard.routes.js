const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');
const { verifyToken } = require('../../core/middleware/auth');

// Module name for routes-tree grouping
router.moduleName = 'Dashboard';

router.use(verifyToken);

// Define routes metadata
router.routesMeta = [
    {
        path: '/',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => dashboardController.getDashboardStats(req, res),
        description: 'Get dashboard statistics including total orders, pending orders, active customers, low stock, revenue, and active staff.',
        database: {
            tables: ['orders', 'customers', 'products', 'staffs'],
            mainTable: null,
            fields: {
                calculated: ['totalOrders', 'pendingOrders', 'activeCustomers', 'lowStock', 'revenue', 'activeStaff']
            }
        },
        sampleResponse: {
            success: true,
            data: {
                totalOrders: 22,
                pendingOrders: 12,
                activeCustomers: 10,
                lowStock: 2,
                revenue: 81643.10,
                activeStaff: 15
            }
        },
        examples: [
            {
                title: 'Get Dashboard Stats',
                description: 'Retrieve aggregated statistics for the dashboard',
                url: '/api/dashboard',
                method: 'GET',
                response: {
                    success: true,
                    data: {
                        totalOrders: 22,
                        pendingOrders: 12,
                        activeCustomers: 10,
                        lowStock: 2,
                        revenue: 81643.10,
                        activeStaff: 15
                    }
                }
            }
        ]
    },
    {
        path: '/charts',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => dashboardController.getChartsData(req, res),
        description: 'Get monthly sales chart data for the previous year.',
        database: {
            tables: ['orders'],
            mainTable: 'orders',
            fields: {
                calculated: ['total']
            }
        },
        sampleResponse: [
            { name: "Jan", total: 1500 },
            { name: "Feb", total: 2300 }
        ],
        examples: [
            {
                title: 'Get Dashboard Charts',
                description: 'Retrieve monthly sales data for charts',
                url: '/api/dashboard/charts',
                method: 'GET',
                response: [
                    { name: "Jan", total: 1500 },
                    { name: "Feb", total: 2300 }
                ]
            }
        ]
    }
];

// Register routes
router.routesMeta.forEach(r => {
    router[r.method.toLowerCase()](r.path, ...r.middlewares, r.handler);
});

module.exports = router;
