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

    // --- Credit Head ---
    async getAllCreditHeads(filters, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await AccountingRepository.findAllCreditHeads(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getCreditHeadById(id) {
        const creditHead = await AccountingRepository.findCreditHeadById(id);
        if (!creditHead) {
            throw new Error('Credit head not found');
        }
        return creditHead;
    }

    async createCreditHead(data) {
        return await AccountingRepository.createCreditHead(data);
    }

    async updateCreditHead(id, data) {
        const creditHead = await AccountingRepository.updateCreditHead(id, data);
        if (!creditHead) {
            throw new Error('Credit head not found');
        }
        return creditHead;
    }

    async deleteCreditHead(id) {
        const creditHead = await AccountingRepository.deleteCreditHead(id);
        if (!creditHead) {
            throw new Error('Credit head not found');
        }
        return creditHead;
    }

    // --- Debit Head ---
    async getAllDebitHeads(filters, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await AccountingRepository.findAllDebitHeads(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getDebitHeadById(id) {
        const debitHead = await AccountingRepository.findDebitHeadById(id);
        if (!debitHead) {
            throw new Error('Debit head not found');
        }
        return debitHead;
    }

    async createDebitHead(data) {
        return await AccountingRepository.createDebitHead(data);
    }

    async updateDebitHead(id, data) {
        const debitHead = await AccountingRepository.updateDebitHead(id, data);
        if (!debitHead) {
            throw new Error('Debit head not found');
        }
        return debitHead;
    }

    async deleteDebitHead(id) {
        const debitHead = await AccountingRepository.deleteDebitHead(id);
        if (!debitHead) {
            throw new Error('Debit head not found');
        }
        return debitHead;
    }
}

module.exports = new AccountingService();
