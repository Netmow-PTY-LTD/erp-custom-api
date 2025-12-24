var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PayrollService = require('./payroll.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class PayrollController {
    getPayrolls(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    staff_id: req.query.staff_id,
                    month: req.query.month,
                    year: req.query.year,
                    status: req.query.status
                };
                const result = yield PayrollService.getAllPayrolls(filters, page, limit);
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
    getPayrollById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payroll = yield PayrollService.getPayrollById(req.params.id);
                return success(res, 'Payroll record retrieved successfully', payroll);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createPayroll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payroll = yield PayrollService.createPayroll(req.body, req.user.id);
                return success(res, 'Payroll record created successfully', payroll, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updatePayroll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payroll = yield PayrollService.updatePayroll(req.params.id, req.body);
                return success(res, 'Payroll record updated successfully', payroll);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deletePayroll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield PayrollService.deletePayroll(req.params.id);
                return success(res, 'Payroll record deleted successfully');
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new PayrollController();
