const AccountingService = require('./accounting.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class AccountingController {
    // --- Overview ---
    async getOverview(req, res) {
        try {
            const { start_date, end_date } = req.query;
            const overview = await AccountingService.getOverview(start_date, end_date);
            return success(res, 'Financial overview retrieved successfully', overview);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // --- Income ---
    async getIncomes(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await AccountingService.getAllIncomes(req.query, page, limit);
            return successWithPagination(res, 'Income records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createIncome(req, res) {
        try {
            const income = await AccountingService.createIncome(req.body, req.user.id);
            return success(res, 'Income record created successfully', income, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    // --- Expense ---
    async getExpenses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await AccountingService.getAllExpenses(req.query, page, limit);
            return successWithPagination(res, 'Expense records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createExpense(req, res) {
        try {
            const expense = await AccountingService.createExpense(req.body, req.user.id);
            return success(res, 'Expense record created successfully', expense, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    // --- Payroll ---
    async getPayrolls(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await AccountingService.getAllPayrolls(req.query, page, limit);
            return successWithPagination(res, 'Payroll records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createPayroll(req, res) {
        try {
            const payroll = await AccountingService.createPayroll(req.body, req.user.id);
            return success(res, 'Payroll record created successfully', payroll, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    // --- Credit Head ---
    async getAllCreditHeads(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                is_active: req.query.is_active,
                search: req.query.search
            };
            const result = await AccountingService.getAllCreditHeads(filters, page, limit);
            return successWithPagination(res, 'Credit heads retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getCreditHeadById(req, res) {
        try {
            const creditHead = await AccountingService.getCreditHeadById(req.params.id);
            return success(res, 'Credit head retrieved successfully', creditHead);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createCreditHead(req, res) {
        try {
            const creditHead = await AccountingService.createCreditHead(req.body);
            return success(res, 'Credit head created successfully', creditHead, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateCreditHead(req, res) {
        try {
            const creditHead = await AccountingService.updateCreditHead(req.params.id, req.body);
            return success(res, 'Credit head updated successfully', creditHead);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteCreditHead(req, res) {
        try {
            await AccountingService.deleteCreditHead(req.params.id);
            return success(res, 'Credit head deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    // --- Debit Head ---
    async getAllDebitHeads(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                is_active: req.query.is_active,
                search: req.query.search
            };
            const result = await AccountingService.getAllDebitHeads(filters, page, limit);
            return successWithPagination(res, 'Debit heads retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getDebitHeadById(req, res) {
        try {
            const debitHead = await AccountingService.getDebitHeadById(req.params.id);
            return success(res, 'Debit head retrieved successfully', debitHead);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createDebitHead(req, res) {
        try {
            const debitHead = await AccountingService.createDebitHead(req.body);
            return success(res, 'Debit head created successfully', debitHead, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateDebitHead(req, res) {
        try {
            const debitHead = await AccountingService.updateDebitHead(req.params.id, req.body);
            return success(res, 'Debit head updated successfully', debitHead);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteDebitHead(req, res) {
        try {
            await AccountingService.deleteDebitHead(req.params.id);
            return success(res, 'Debit head deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    // --- Chart Data ---
    async getChartData(req, res) {
        try {
            const chartData = await AccountingService.getChartData();
            return success(res, 'Accounting chart data retrieved successfully', chartData);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }
}

module.exports = new AccountingController();
