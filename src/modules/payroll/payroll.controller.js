const PayrollService = require('./payroll.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class PayrollController {
    async getPayrolls(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                staff_id: req.query.staff_id,
                month: req.query.month,
                year: req.query.year,
                status: req.query.status
            };

            const result = await PayrollService.getAllPayrolls(filters, page, limit);
            return successWithPagination(res, 'Payroll records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getPayrollById(req, res) {
        try {
            const payroll = await PayrollService.getPayrollById(req.params.id);
            return success(res, 'Payroll record retrieved successfully', payroll);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createPayroll(req, res) {
        try {
            const payroll = await PayrollService.createPayroll(req.body, req.user.id);
            return success(res, 'Payroll record created successfully', payroll, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updatePayroll(req, res) {
        try {
            const payroll = await PayrollService.updatePayroll(req.params.id, req.body);
            return success(res, 'Payroll record updated successfully', payroll);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deletePayroll(req, res) {
        try {
            await PayrollService.deletePayroll(req.params.id);
            return success(res, 'Payroll record deleted successfully');
        } catch (err) {
            return error(res, err.message, 404);
        }
    }
}

module.exports = new PayrollController();
