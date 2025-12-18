const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
const { Order } = require('../sales/sales.models');
const { Product } = require('../products/products.model');
const { Customer } = require('../customers/customers.model');
const { Staff } = require('../staffs/staffs.model');

const getDashboardStats = async (req, res) => {
    try {
        const [
            totalOrders,
            pendingOrders,
            activeCustomers,
            lowStockProducts,
            revenueResult,
            activeStaff
        ] = await Promise.all([
            // Total Orders
            Order.count(),

            // Pending Orders
            Order.count({
                where: { status: 'pending' }
            }),

            // Active Customers
            Customer.count({
                where: { is_active: true }
            }),

            // Low Stock
            Product.count({
                where: {
                    stock_quantity: {
                        [Op.lte]: sequelize.col('min_stock_level')
                    }
                }
            }),

            // Revenue: Sum of paid orders
            Order.sum('total_amount', {
                where: { payment_status: 'paid' }
            }),

            // Active Staff
            Staff.count({
                where: { status: 'active' }
            })
        ]);

        // Format revenue or handle null
        const revenue = revenueResult || 0;

        res.json({
            success: true,
            data: {
                totalOrders,
                pendingOrders,
                activeCustomers,
                lowStock: lowStockProducts,
                revenue,
                activeStaff
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};
