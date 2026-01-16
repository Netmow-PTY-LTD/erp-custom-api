const express = require('express');
const router = express.Router();
const salesRouteController = require('./salesroute.controller');
const { verifyToken } = require('../../core/middleware/auth');
const { moduleCheck } = require('../../core/middleware/moduleCheck');
const validate = require('../../core/middleware/validate');
const { createRoute, updateRoute } = require('./salesroute.validation');
// Module name for routes-tree grouping
router.moduleName = 'Sales Routes';
// Define routes metadata
router.routesMeta = [
    {
        path: '/sales-route/:id',
        method: 'GET',
        middlewares: [verifyToken, moduleCheck('sales')],
        handler: salesRouteController.getRouteById,
        description: 'Get sales route details',
        sampleResponse: {
            status: true,
            message: 'Sales route retrieved successfully',
            data: {
                id: 1,
                route_name: 'Kuala Lumpur Central',
                description: 'Coverage for KL city center',
                assigned_sales_rep_id: 5,
                start_location: 'KLCC',
                end_location: 'Bukit Bintang',
                is_active: true,
                created_at: '2025-12-02T10:00:00.000Z',
                updated_at: '2025-12-02T10:00:00.000Z'
            }
        }
    },
    {
        path: '/sales-route/:id',
        method: 'PUT',
        middlewares: [verifyToken, moduleCheck('sales'), validate(updateRoute)],
        handler: salesRouteController.updateRoute,
        description: 'Update a sales route',
        sampleRequest: {
            route_name: 'Kuala Lumpur Downtown',
            description: 'Updated coverage area',
            is_active: true
        },
        sampleResponse: {
            status: true,
            message: 'Sales route updated successfully',
            data: {
                id: 1,
                route_name: 'Kuala Lumpur Downtown',
                updated_at: '2025-12-02T10:00:00.000Z'
            }
        }
    },
    {
        path: '/sales-route/:id',
        method: 'DELETE',
        middlewares: [verifyToken, moduleCheck('sales')],
        handler: salesRouteController.deleteRoute,
        description: 'Delete a sales route',
        sampleResponse: {
            status: true,
            message: 'Sales route deleted successfully',
            data: null
        }
    }
];
// Register routes from metadata
router.routesMeta.forEach(r => {
    router[r.method.toLowerCase()](r.path, ...r.middlewares, r.handler);
});
module.exports = router;
