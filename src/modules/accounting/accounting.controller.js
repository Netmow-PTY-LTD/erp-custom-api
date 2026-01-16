const AccountingService = require('./accounting.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class AccountingController {

    // --- Transactions (Entry Point) ---
    async createTransaction(req, res) {
        try {
            // req.body should contain { type, amount, payment_mode, ... }
            const result = await AccountingService.processTransaction(req.body);
            return success(res, 'Transaction posted and journalized successfully', result, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }
    async createJournalEntry(req, res) {
        try {
            const journal = await AccountingService.createManualJournal(req.body);
            return success(res, 'Journal Entry created successfully', journal, 201);
        } catch (err) {
            const message = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
            return error(res, message, 400);
        }
    }


    async getTransactions(req, res) {
        try {
            const { count, rows } = await AccountingService.getTransactions(req.query);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const pagination = {
                total: count,
                page,
                limit,
                totalPage: Math.ceil(count / limit)
            };
            return successWithPagination(res, 'Transactions retrieved successfully', rows, pagination);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // --- Reports ---
    async getJournalReport(req, res) {
        try {
            const { count, rows } = await AccountingService.getJournalReport(req.query);
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const pagination = {
                total: count,
                page,
                limit,
                totalPage: Math.ceil(count / limit)
            };
            return successWithPagination(res, 'Journal report retrieved successfully', rows, pagination);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getLedgerReport(req, res) {
        try {
            const { id } = req.params; // Account ID
            const { from, to } = req.query;
            const report = await AccountingService.getLedgerReport(id, { from, to, code: req.query.code });
            return success(res, 'Ledger report retrieved successfully', report);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getTrialBalance(req, res) {
        try {
            const { date } = req.query;
            const report = await AccountingService.getTrialBalance(date);
            return success(res, 'Trial Balance retrieved successfully', report);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getProfitAndLoss(req, res) {
        try {
            const { from, to } = req.query;
            const report = await AccountingService.getProfitAndLoss({ from, to });
            return success(res, 'Profit and Loss report retrieved successfully', report);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getOverview(req, res) {
        try {
            const overview = await AccountingService.getOverview();
            return success(res, 'Financial overview retrieved successfully', overview);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // --- Settings / Master Data ---
    async getAccounts(req, res) {
        try {
            const { count, rows } = await AccountingService.getAccounts(req.query);
            const pagination = {
                total: count,
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10
            };
            return successWithPagination(res, 'Chart of Accounts retrieved successfully', rows, pagination);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getIncomeHeads(req, res) {
        try {
            const accounts = await AccountingService.getIncomeHeads();
            return success(res, 'Income Heads retrieved successfully', accounts);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getExpenseHeads(req, res) {
        try {
            const accounts = await AccountingService.getExpenseHeads();
            return success(res, 'Expense Heads retrieved successfully', accounts);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createIncomeHead(req, res) {
        try {
            const account = await AccountingService.createIncomeHead(req.body);
            return success(res, 'Income Head created successfully', account, 201);
        } catch (err) {
            const message = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
            return error(res, message, 400);
        }
    }

    async updateIncomeHead(req, res) {
        try {
            const account = await AccountingService.updateIncomeHead(req.params.id, req.body);
            return success(res, 'Income Head updated successfully', account);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async createExpenseHead(req, res) {
        try {
            const account = await AccountingService.createExpenseHead(req.body);
            return success(res, 'Expense Head created successfully', account, 201);
        } catch (err) {
            const message = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
            return error(res, message, 400);
        }
    }

    async updateExpenseHead(req, res) {
        try {
            const account = await AccountingService.updateExpenseHead(req.params.id, req.body);
            return success(res, 'Expense Head updated successfully', account);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async createAccount(req, res) {
        try {
            const account = await AccountingService.createAccount(req.body);
            return success(res, 'Account created successfully', account, 201);
        } catch (err) {
            const message = err.errors ? err.errors.map(e => e.message).join(', ') : err.message;
            return error(res, message, 400);
        }
    }

    async updateAccount(req, res) {
        try {
            const account = await AccountingService.updateAccount(req.params.id, req.body);
            return success(res, 'Account updated successfully', account);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteAccount(req, res) {
        try {
            await AccountingService.deleteAccount(req.params.id);
            return success(res, 'Account deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async seedAccounts(req, res) {
        try {
            const result = await AccountingService.seedAccounts();
            return success(res, 'Accounts seeded successfully', result, 201);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // --- Chart Data (If needed) ---
    async getChartData(req, res) {
        // Implementation for charts if needed using new tables
        // For now returning basic overview or empty
        return success(res, 'Chart data endpoint pending implementation with new schema', []);
    }
}

module.exports = new AccountingController();
