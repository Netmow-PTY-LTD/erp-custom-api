var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AccountingService = require('./accounting.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class AccountingController {
    // --- Overview ---
    getOverview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { start_date, end_date } = req.query;
                const overview = yield AccountingService.getOverview(start_date, end_date);
                return success(res, 'Financial overview retrieved successfully', overview);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // --- Income ---
    getIncomes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield AccountingService.getAllIncomes(req.query, page, limit);
                return successWithPagination(res, 'Income records retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    createIncome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const income = yield AccountingService.createIncome(req.body, req.user.id);
                return success(res, 'Income record created successfully', income, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // --- Expense ---
    getExpenses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield AccountingService.getAllExpenses(req.query, page, limit);
                return successWithPagination(res, 'Expense records retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    createExpense(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const expense = yield AccountingService.createExpense(req.body, req.user.id);
                return success(res, 'Expense record created successfully', expense, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // --- Payroll ---
    getPayrolls(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield AccountingService.getAllPayrolls(req.query, page, limit);
                return successWithPagination(res, 'Payroll records retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    createPayroll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payroll = yield AccountingService.createPayroll(req.body, req.user.id);
                return success(res, 'Payroll record created successfully', payroll, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // --- Credit Head ---
    getAllCreditHeads(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield AccountingService.getAllCreditHeads(filters, page, limit);
                return successWithPagination(res, 'Credit heads retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getCreditHeadById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const creditHead = yield AccountingService.getCreditHeadById(req.params.id);
                return success(res, 'Credit head retrieved successfully', creditHead);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createCreditHead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const creditHead = yield AccountingService.createCreditHead(req.body);
                return success(res, 'Credit head created successfully', creditHead, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateCreditHead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const creditHead = yield AccountingService.updateCreditHead(req.params.id, req.body);
                return success(res, 'Credit head updated successfully', creditHead);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteCreditHead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield AccountingService.deleteCreditHead(req.params.id);
                return success(res, 'Credit head deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    // --- Debit Head ---
    getAllDebitHeads(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield AccountingService.getAllDebitHeads(filters, page, limit);
                return successWithPagination(res, 'Debit heads retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getDebitHeadById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const debitHead = yield AccountingService.getDebitHeadById(req.params.id);
                return success(res, 'Debit head retrieved successfully', debitHead);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createDebitHead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const debitHead = yield AccountingService.createDebitHead(req.body);
                return success(res, 'Debit head created successfully', debitHead, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateDebitHead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const debitHead = yield AccountingService.updateDebitHead(req.params.id, req.body);
                return success(res, 'Debit head updated successfully', debitHead);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteDebitHead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield AccountingService.deleteDebitHead(req.params.id);
                return success(res, 'Debit head deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new AccountingController();
