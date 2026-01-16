var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Income, Expense, Payroll, CreditHead, DebitHead } = require('./accounting.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');
class AccountingRepository {
    // --- Income Operations ---
    findAllIncomes() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.start_date && filters.end_date) {
                where.income_date = { [Op.between]: [filters.start_date, filters.end_date] };
            }
            if (filters.category)
                where.category = filters.category;
            if (filters.credit_head_id)
                where.credit_head_id = filters.credit_head_id;
            return yield Income.findAndCountAll({
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
        });
    }
    createIncome(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Income.create(data);
        });
    }
    // --- Expense Operations ---
    findAllExpenses() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.start_date && filters.end_date) {
                where.expense_date = { [Op.between]: [filters.start_date, filters.end_date] };
            }
            if (filters.category)
                where.category = filters.category;
            if (filters.status)
                where.status = filters.status;
            if (filters.debit_head_id)
                where.debit_head_id = filters.debit_head_id;
            return yield Expense.findAndCountAll({
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
        });
    }
    createExpense(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Expense.create(data);
        });
    }
    // --- Payroll Operations ---
    findAllPayrolls() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.salary_month)
                where.salary_month = filters.salary_month;
            if (filters.staff_id)
                where.staff_id = filters.staff_id;
            if (filters.status)
                where.status = filters.status;
            return yield Payroll.findAndCountAll({
                where,
                order: [['salary_month', 'DESC']],
                limit,
                offset
            });
        });
    }
    createPayroll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payroll.create(data);
        });
    }
    // --- Credit Head Operations ---
    findAllCreditHeads() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.is_active !== undefined)
                where.is_active = filters.is_active;
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { code: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield CreditHead.findAndCountAll({
                where,
                order: [['name', 'ASC']],
                limit,
                offset
            });
        });
    }
    findCreditHeadById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CreditHead.findByPk(id);
        });
    }
    createCreditHead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CreditHead.create(data);
        });
    }
    updateCreditHead(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const creditHead = yield CreditHead.findByPk(id);
            if (!creditHead)
                return null;
            return yield creditHead.update(data);
        });
    }
    deleteCreditHead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const creditHead = yield CreditHead.findByPk(id);
            if (!creditHead)
                return null;
            yield creditHead.destroy();
            return creditHead;
        });
    }
    // --- Debit Head Operations ---
    findAllDebitHeads() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.is_active !== undefined)
                where.is_active = filters.is_active;
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { code: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield DebitHead.findAndCountAll({
                where,
                order: [['name', 'ASC']],
                limit,
                offset
            });
        });
    }
    findDebitHeadById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DebitHead.findByPk(id);
        });
    }
    createDebitHead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DebitHead.create(data);
        });
    }
    updateDebitHead(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const debitHead = yield DebitHead.findByPk(id);
            if (!debitHead)
                return null;
            return yield debitHead.update(data);
        });
    }
    deleteDebitHead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const debitHead = yield DebitHead.findByPk(id);
            if (!debitHead)
                return null;
            yield debitHead.destroy();
            return debitHead;
        });
    }
    // --- Overview Operations ---
    getFinancialOverview(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dateFilter = {};
            if (startDate && endDate) {
                dateFilter[Op.between] = [startDate, endDate];
            }
            const totalIncome = (yield Income.sum('amount', {
                where: startDate && endDate ? { income_date: dateFilter } : {}
            })) || 0;
            const totalExpense = (yield Expense.sum('amount', {
                where: startDate && endDate ? { expense_date: dateFilter } : {}
            })) || 0;
            const totalPayroll = (yield Payroll.sum('net_salary', {
                where: Object.assign({ status: 'paid' }, (startDate && endDate ? { payment_date: dateFilter } : {}))
            })) || 0;
            return {
                total_income: totalIncome,
                total_expense: totalExpense,
                total_payroll: totalPayroll,
                net_profit: totalIncome - totalExpense - totalPayroll
            };
        });
    }
}
module.exports = new AccountingRepository();
