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

const getChartsData = async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        // const targetYear = currentYear - 1; // User likely wants to see current data if last year is empty
        const targetYear = currentYear;

        const results = await sequelize.query(`
            SELECT 
                MONTH(order_date) as month, 
                SUM(total_amount) as total
            FROM orders 
            WHERE YEAR(order_date) = :year 
            AND status != 'cancelled'
            GROUP BY MONTH(order_date)
        `, {
            replacements: { year: targetYear },
            type: sequelize.QueryTypes.SELECT
        });

        // Initialize all months with 0
        const monthMap = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "May", 6: "Jun",
            7: "Jul", 8: "Aug", 9: "Sep", 10: "Oct", 11: "Nov", 12: "Dec"
        };

        const chartData = [];
        const dataMap = {};

        // Populate data map from query results
        results.forEach(row => {
            dataMap[row.month] = parseFloat(row.total);
        });

        // Build the final array ensuring all 12 months are present
        for (let i = 1; i <= 12; i++) {
            chartData.push({
                name: monthMap[i],
                total: dataMap[i] || 0
            });
        }

        res.json(chartData); // Return array directly as requested

    } catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch chart data',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getChartsData
};
