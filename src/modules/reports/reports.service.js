const { sequelize } = require('../../core/database/sequelize');
const { QueryTypes } = require('sequelize');
const { Order, OrderItem } = require('../sales/sales.models');
const { PurchaseOrder } = require('../purchase/purchase.models');
const { Product } = require('../products/products.model');
const { Staff } = require('../staffs/staffs.model');
const { Attendance } = require('../attendance/attendance.model');
const { Payroll } = require('../payroll/payroll.models');
const { Transaction } = require('../accounting/accounting.models');

class ReportService {
    // Helper to format dates for SQL
    _getDateRange(startDate, endDate) {
        return {
            start: startDate || '1970-01-01',
            end: endDate || new Date().toISOString().split('T')[0]
        };
    }

    // --- Sales Reports ---
    async getSalesSummary(startDate, endDate) {
        const { start, end } = this._getDateRange(startDate, endDate);

        const sql = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(total_amount) as total_revenue,
                AVG(total_amount) as average_order_value
            FROM orders
            WHERE order_date BETWEEN :start AND :end
            AND status != 'cancelled'
        `;

        const result = await sequelize.query(sql, {
            replacements: { start, end },
            type: QueryTypes.SELECT
        });

        return result[0];
    }

    async getTopCustomers(startDate, endDate, limit = 5) {
        const { start, end } = this._getDateRange(startDate, endDate);

        const sql = `
            SELECT 
                c.id, c.name, c.email,
                COUNT(o.id) as order_count,
                SUM(o.total_amount) as total_spent
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.order_date BETWEEN :start AND :end
            AND o.status != 'cancelled'
            GROUP BY c.id
            ORDER BY total_spent DESC
            LIMIT :limit
        `;

        return await sequelize.query(sql, {
            replacements: { start, end, limit },
            type: QueryTypes.SELECT
        });
    }

    async getTopProducts(startDate, endDate, limit = 5) {
        const { start, end } = this._getDateRange(startDate, endDate);

        const sql = `
            SELECT 
                p.id, p.name, p.sku,
                SUM(oi.quantity) as total_quantity_sold,
                SUM(oi.total_price) as total_revenue
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.order_date BETWEEN :start AND :end
            AND o.status != 'cancelled'
            GROUP BY p.id
            ORDER BY total_quantity_sold DESC
            LIMIT :limit
        `;

        return await sequelize.query(sql, {
            replacements: { start, end, limit },
            type: QueryTypes.SELECT
        });
    }

    // --- Purchase Reports ---
    async getPurchaseSummary(startDate, endDate) {
        const { start, end } = this._getDateRange(startDate, endDate);

        const sql = `
            SELECT 
                COUNT(*) as total_orders,
                SUM(total_amount) as total_spent
            FROM purchase_orders
            WHERE order_date BETWEEN :start AND :end
            AND status != 'cancelled'
        `;

        const result = await sequelize.query(sql, {
            replacements: { start, end },
            type: QueryTypes.SELECT
        });

        return result[0];
    }

    async getSpendingBySupplier(startDate, endDate, limit = 10) {
        const { start, end } = this._getDateRange(startDate, endDate);

        const sql = `
            SELECT 
                s.id, s.name,
                COUNT(po.id) as po_count,
                SUM(po.total_amount) as total_spent
            FROM purchase_orders po
            JOIN suppliers s ON po.supplier_id = s.id
            WHERE po.order_date BETWEEN :start AND :end
            AND po.status != 'cancelled'
            GROUP BY s.id
            ORDER BY total_spent DESC
            LIMIT :limit
        `;

        return await sequelize.query(sql, {
            replacements: { start, end, limit },
            type: QueryTypes.SELECT
        });
    }

    // --- Inventory Reports ---
    async getInventoryStatus() {
        const sql = `
            SELECT 
                COUNT(*) as total_products,
                SUM(CASE WHEN stock_quantity <= min_stock_level THEN 1 ELSE 0 END) as low_stock_count,
                SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock_count
            FROM products
            WHERE is_active = true
        `;

        const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
        return result[0];
    }

    async getInventoryValuation() {
        const sql = `
            SELECT 
                SUM(stock_quantity * price) as total_sales_value,
                SUM(stock_quantity * cost_price) as total_cost_value
            FROM products
            WHERE is_active = true
        `;

        const result = await sequelize.query(sql, { type: QueryTypes.SELECT });
        return result[0];
    }

    // --- HR Reports ---
    async getAttendanceSummary(month, year, page = 1, limit = 10) {
        const offset = (page - 1) * limit;

        const mysqlSql = `
            SELECT 
                s.id, s.first_name, s.last_name,
                COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
                COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_days,
                COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
                COUNT(CASE WHEN a.status = 'half_day' THEN 1 END) as half_days
            FROM staffs s
            LEFT JOIN attendances a ON s.id = a.staff_id 
                AND MONTH(a.date) = :month 
                AND YEAR(a.date) = :year
            WHERE s.status = 'active'
            GROUP BY s.id
            LIMIT :limit OFFSET :offset
        `;

        const countSql = `
            SELECT COUNT(*) as total
            FROM staffs
            WHERE status = 'active'
        `;

        const rows = await sequelize.query(mysqlSql, {
            replacements: { month, year, limit, offset },
            type: QueryTypes.SELECT
        });

        const countResult = await sequelize.query(countSql, {
            type: QueryTypes.SELECT
        });

        return {
            rows,
            total: countResult[0].total
        };
    }

    async getPayrollSummary(year) {
        const sql = `
            SELECT 
                month,
                COUNT(*) as staff_paid,
                SUM(basic_salary) as total_basic,
                SUM(net_salary) as total_net_payout
            FROM payrolls
            WHERE year = :year
            AND status = 'paid'
            GROUP BY month
            ORDER BY 
                CASE month
                    WHEN 'January' THEN 1
                    WHEN 'February' THEN 2
                    WHEN 'March' THEN 3
                    WHEN 'April' THEN 4
                    WHEN 'May' THEN 5
                    WHEN 'June' THEN 6
                    WHEN 'July' THEN 7
                    WHEN 'August' THEN 8
                    WHEN 'September' THEN 9
                    WHEN 'October' THEN 10
                    WHEN 'November' THEN 11
                    WHEN 'December' THEN 12
                END
        `;

        return await sequelize.query(sql, {
            replacements: { year },
            type: QueryTypes.SELECT
        });
    }

    // --- Finance Reports ---
    async getProfitLoss(startDate, endDate) {
        const { start, end } = this._getDateRange(startDate, endDate);

        // 1. Revenue from Sales
        const revenueSql = `
            SELECT COALESCE(SUM(total_amount), 0) as total
            FROM orders 
            WHERE order_date BETWEEN :start AND :end 
            AND status != 'cancelled'
        `;
        const revenueRes = await sequelize.query(revenueSql, { replacements: { start, end }, type: QueryTypes.SELECT });
        const revenue = parseFloat(revenueRes[0].total);

        // 2. Cost of Goods Sold (Approximate from Purchase Orders for now, or Product Cost * Sold Qty)
        // Better to use Product Cost * Sold Qty for accurate COGS
        const cogsSql = `
            SELECT COALESCE(SUM(oi.quantity * p.cost_price), 0) as total
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            JOIN products p ON oi.product_id = p.id
            WHERE o.order_date BETWEEN :start AND :end
            AND o.status != 'cancelled'
        `;
        const cogsRes = await sequelize.query(cogsSql, { replacements: { start, end }, type: QueryTypes.SELECT });
        const cogs = parseFloat(cogsRes[0].total);

        // 3. Expenses from Accounting
        const expenseSql = `
            SELECT COALESCE(SUM(amount), 0) as total
            FROM transactions
            WHERE type = 'expense'
            AND date BETWEEN :start AND :end
        `;
        const expenseRes = await sequelize.query(expenseSql, { replacements: { start, end }, type: QueryTypes.SELECT });
        const expenses = parseFloat(expenseRes[0].total);

        return {
            revenue,
            cogs,
            gross_profit: revenue - cogs,
            expenses,
            net_profit: revenue - cogs - expenses
        };
    }
}

module.exports = new ReportService();
