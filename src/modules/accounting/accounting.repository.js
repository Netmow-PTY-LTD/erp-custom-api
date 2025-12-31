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
    async getFinancialOverview() {
        // Helper to format date as YYYY-MM-DD
        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 1. Daily (Today)
        const todayStr = formatDate(now);

        // 2. Weekly (Current Week - Starting Monday)
        const startOfWeek = new Date(now);
        const dayOfWeek = startOfWeek.getDay() || 7; // Make Sunday 7, Mon 1
        startOfWeek.setDate(now.getDate() - dayOfWeek + 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startOfWeekStr = formatDate(startOfWeek);
        const endOfWeekStr = formatDate(endOfWeek);

        // 3. Monthly (Current Month)
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

        const startOfMonthStr = formatDate(startOfMonth);
        const endOfMonthStr = formatDate(endOfMonth);

        // 4. Yearly (Current Year)
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31);

        const startOfYearStr = formatDate(startOfYear);
        const endOfYearStr = formatDate(endOfYear);

        // Define helper for sums
        const getSum = async (model, dateField, start, end) => {
            const where = {};
            if (start === end) {
                where[dateField] = start;
            } else {
                where[dateField] = { [Op.between]: [start, end] };
            }
            return await model.sum('amount', { where }) || 0;
        };

        const [
            dailyIncome, dailyExpense,
            weeklyIncome, weeklyExpense,
            monthlyIncome, monthlyExpense,
            yearlyIncome, yearlyExpense
        ] = await Promise.all([
            getSum(Income, 'income_date', todayStr, todayStr),
            getSum(Expense, 'expense_date', todayStr, todayStr),

            getSum(Income, 'income_date', startOfWeekStr, endOfWeekStr),
            getSum(Expense, 'expense_date', startOfWeekStr, endOfWeekStr),

            getSum(Income, 'income_date', startOfMonthStr, endOfMonthStr),
            getSum(Expense, 'expense_date', startOfMonthStr, endOfMonthStr),

            getSum(Income, 'income_date', startOfYearStr, endOfYearStr),
            getSum(Expense, 'expense_date', startOfYearStr, endOfYearStr)
        ]);

        return {
            daily: {
                income: dailyIncome,
                expense: dailyExpense
            },
            weekly: {
                income: weeklyIncome,
                expense: weeklyExpense
            },
            monthly: {
                income: monthlyIncome,
                expense: monthlyExpense
            },
            yearly: {
                income: yearlyIncome,
                expense: yearlyExpense
            }
        };
    }

    // --- Chart Data Operations ---
    async getChartData() {
        // Helper to format date as YYYY-MM-DD
        const formatDate = (date) => {
            const d = new Date(date);
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        // Calculate date range (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29); // 30 days including today

        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        // Fetch income data grouped by date
        const incomeData = await Income.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('income_date')), 'date'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total']
            ],
            where: {
                income_date: {
                    [Op.between]: [startDateStr, endDateStr]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('income_date'))],
            raw: true
        });

        // Fetch expense data grouped by date
        const expenseData = await Expense.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('expense_date')), 'date'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total']
            ],
            where: {
                expense_date: {
                    [Op.between]: [startDateStr, endDateStr]
                }
            },
            group: [sequelize.fn('DATE', sequelize.col('expense_date'))],
            raw: true
        });

        // Create a map for quick lookup
        const incomeMap = {};
        incomeData.forEach(item => {
            incomeMap[item.date] = parseFloat(item.total) || 0;
        });

        const expenseMap = {};
        expenseData.forEach(item => {
            expenseMap[item.date] = parseFloat(item.total) || 0;
        });

        // Generate array for all 30 days
        const chartData = [];
        const currentDate = new Date(startDate);

        for (let i = 0; i < 30; i++) {
            const dateStr = formatDate(currentDate);
            chartData.push({
                date: dateStr,
                income: incomeMap[dateStr] || 0,
                expense: expenseMap[dateStr] || 0
            });
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return chartData;
    }
}

module.exports = new AccountingRepository();
