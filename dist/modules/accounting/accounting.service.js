var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AccountingRepository = require('./accounting.repository');
class AccountingService {
    // --- Income ---
    getAllIncomes(filters_1) {
        return __awaiter(this, arguments, void 0, function* (filters, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield AccountingRepository.findAllIncomes(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    createIncome(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AccountingRepository.createIncome(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    // --- Expense ---
    getAllExpenses(filters_1) {
        return __awaiter(this, arguments, void 0, function* (filters, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield AccountingRepository.findAllExpenses(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    createExpense(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AccountingRepository.createExpense(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    // --- Payroll ---
    getAllPayrolls(filters_1) {
        return __awaiter(this, arguments, void 0, function* (filters, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield AccountingRepository.findAllPayrolls(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    createPayroll(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Calculate net salary
            const basic = parseFloat(data.basic_salary);
            const allowances = parseFloat(data.allowances || 0);
            const deductions = parseFloat(data.deductions || 0);
            const netSalary = basic + allowances - deductions;
            return yield AccountingRepository.createPayroll(Object.assign(Object.assign({}, data), { net_salary: netSalary, created_by: userId }));
        });
    }
    // --- Overview ---
    getOverview(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AccountingRepository.getFinancialOverview(startDate, endDate);
        });
    }
    // --- Credit Head ---
    getAllCreditHeads(filters_1) {
        return __awaiter(this, arguments, void 0, function* (filters, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield AccountingRepository.findAllCreditHeads(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getCreditHeadById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const creditHead = yield AccountingRepository.findCreditHeadById(id);
            if (!creditHead) {
                throw new Error('Credit head not found');
            }
            return creditHead;
        });
    }
    createCreditHead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AccountingRepository.createCreditHead(data);
        });
    }
    updateCreditHead(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const creditHead = yield AccountingRepository.updateCreditHead(id, data);
            if (!creditHead) {
                throw new Error('Credit head not found');
            }
            return creditHead;
        });
    }
    deleteCreditHead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const creditHead = yield AccountingRepository.deleteCreditHead(id);
            if (!creditHead) {
                throw new Error('Credit head not found');
            }
            return creditHead;
        });
    }
    // --- Debit Head ---
    getAllDebitHeads(filters_1) {
        return __awaiter(this, arguments, void 0, function* (filters, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield AccountingRepository.findAllDebitHeads(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getDebitHeadById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const debitHead = yield AccountingRepository.findDebitHeadById(id);
            if (!debitHead) {
                throw new Error('Debit head not found');
            }
            return debitHead;
        });
    }
    createDebitHead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield AccountingRepository.createDebitHead(data);
        });
    }
    updateDebitHead(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const debitHead = yield AccountingRepository.updateDebitHead(id, data);
            if (!debitHead) {
                throw new Error('Debit head not found');
            }
            return debitHead;
        });
    }
    deleteDebitHead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const debitHead = yield AccountingRepository.deleteDebitHead(id);
            if (!debitHead) {
                throw new Error('Debit head not found');
            }
            return debitHead;
        });
    }
}
module.exports = new AccountingService();
