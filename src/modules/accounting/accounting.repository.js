const { Income, Expense, Payroll, CreditHead, DebitHead } = require('./accounting.models');
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
        if (filters.credit_head_id) where.credit_head_id = filters.credit_head_id;

        return await Income.findAndCountAll({
            where,
            order: [['income_date', 'DESC']],
            limit,
            offset,
            include: [{
                model: CreditHead,
                as: 'creditHead',
                attributes: ['id', 'name', 'code']
            }]
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
        if (filters.debit_head_id) where.debit_head_id = filters.debit_head_id;

        return await Expense.findAndCountAll({
            where,
            order: [['expense_date', 'DESC']],
            limit,
            offset,
            include: [{
                model: DebitHead,
                as: 'debitHead',
                attributes: ['id', 'name', 'code']
            }]
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

    // --- Credit Head Operations ---
    async findAllCreditHeads(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.is_active !== undefined) where.is_active = filters.is_active;
        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { code: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await CreditHead.findAndCountAll({
            where,
            order: [['name', 'ASC']],
            limit,
            offset
        });
    }

    async findCreditHeadById(id) {
        return await CreditHead.findByPk(id);
    }

    async createCreditHead(data) {
        return await CreditHead.create(data);
    }

    async updateCreditHead(id, data) {
        const creditHead = await CreditHead.findByPk(id);
        if (!creditHead) return null;
        return await creditHead.update(data);
    }

    async deleteCreditHead(id) {
        const creditHead = await CreditHead.findByPk(id);
        if (!creditHead) return null;
        await creditHead.destroy();
        return creditHead;
    }

    // --- Debit Head Operations ---
    async findAllDebitHeads(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.is_active !== undefined) where.is_active = filters.is_active;
        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { code: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await DebitHead.findAndCountAll({
            where,
            order: [['name', 'ASC']],
            limit,
            offset
        });
    }

    async findDebitHeadById(id) {
        return await DebitHead.findByPk(id);
    }

    async createDebitHead(data) {
        return await DebitHead.create(data);
    }

    async updateDebitHead(id, data) {
        const debitHead = await DebitHead.findByPk(id);
        if (!debitHead) return null;
        return await debitHead.update(data);
    }

    async deleteDebitHead(id) {
        const debitHead = await DebitHead.findByPk(id);
        if (!debitHead) return null;
        await debitHead.destroy();
        return debitHead;
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
