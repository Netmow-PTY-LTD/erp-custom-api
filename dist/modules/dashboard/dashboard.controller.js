var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
const { Order } = require('../sales/sales.models');
const { Product } = require('../products/products.model');
const { Customer } = require('../customers/customers.model');
const { Staff } = require('../staffs/staffs.model');
const getDashboardStats = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const [totalOrders, pendingOrders, activeCustomers, lowStockProducts, revenueResult, activeStaff] = yield Promise.all([
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
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
});
module.exports = {
    getDashboardStats
};
