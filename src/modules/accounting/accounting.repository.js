const { Income, Expense, Payroll } = require('./accounting.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

class AccountingRepository {
    // --- Income Operations ---
    async findAllIncomes(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.start_date && filters.end_date) {
            where.income_date = { [Op.between]: [filters.start_date, filters.end_date] };
        }
        if (filters.category) where.category = filters.category;

        return await Income.findAndCountAll({
            where,
            order: [['income_date', 'DESC']],
            limit,
            offset
        });
    }

    async createIncome(data) {
        return await Income.create(data);
    }

    // --- Expense Operations ---
    async findAllExpenses(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.start_date && filters.end_date) {
            where.expense_date = { [Op.between]: [filters.start_date, filters.end_date] };
        }
        if (filters.category) where.category = filters.category;
        if (filters.status) where.status = filters.status;

        return await Expense.findAndCountAll({
            where,
            order: [['expense_date', 'DESC']],
            limit,
            offset
        });
    }

    async createExpense(data) {
        return await Expense.create(data);
    }

    // --- Payroll Operations ---
    async findAllPayrolls(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.salary_month) where.salary_month = filters.salary_month;
        if (filters.staff_id) where.staff_id = filters.staff_id;
        if (filters.status) where.status = filters.status;

        return await Payroll.findAndCountAll({
            where,
            order: [['salary_month', 'DESC']],
            limit,
            offset
        });
    }

    async createPayroll(data) {
        return await Payroll.create(data);
    }

    // --- Overview Operations ---
    async getFinancialOverview(startDate, endDate) {
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter[Op.between] = [startDate, endDate];
        }

        const totalIncome = await Income.sum('amount', {
            where: startDate && endDate ? { income_date: dateFilter } : {}
        }) || 0;

        const totalExpense = await Expense.sum('amount', {
            where: startDate && endDate ? { expense_date: dateFilter } : {}
        }) || 0;

        const totalPayroll = await Payroll.sum('net_salary', {
            where: {
                status: 'paid',
                ...(startDate && endDate ? { payment_date: dateFilter } : {})
            }
        }) || 0;

        return {
            total_income: totalIncome,
            total_expense: totalExpense,
            total_payroll: totalPayroll,
            net_profit: totalIncome - totalExpense - totalPayroll
        };
    }
}

module.exports = new AccountingRepository();
