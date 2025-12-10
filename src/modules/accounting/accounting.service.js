const AccountingRepository = require('./accounting.repository');

class AccountingService {
    // --- Income ---
    async getAllIncomes(filters, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await AccountingRepository.findAllIncomes(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async createIncome(data, userId) {
        return await AccountingRepository.createIncome({ ...data, created_by: userId });
    }

    // --- Expense ---
    async getAllExpenses(filters, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await AccountingRepository.findAllExpenses(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async createExpense(data, userId) {
        return await AccountingRepository.createExpense({ ...data, created_by: userId });
    }

    // --- Payroll ---
    async getAllPayrolls(filters, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await AccountingRepository.findAllPayrolls(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async createPayroll(data, userId) {
        // Calculate net salary
        const basic = parseFloat(data.basic_salary);
        const allowances = parseFloat(data.allowances || 0);
        const deductions = parseFloat(data.deductions || 0);
        const netSalary = basic + allowances - deductions;

        return await AccountingRepository.createPayroll({
            ...data,
            net_salary: netSalary,
            created_by: userId
        });
    }

    // --- Overview ---
    async getOverview(startDate, endDate) {
        return await AccountingRepository.getFinancialOverview(startDate, endDate);
    }
}

module.exports = new AccountingService();
