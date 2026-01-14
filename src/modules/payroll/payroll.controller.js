const PayrollService = require('./payroll.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class PayrollController {
    async generateRun(req, res) {
        try {
            const { month } = req.body;
            const run = await PayrollService.generateRun(month, req.user.id);
            return success(res, 'Payroll run generated successfully', run, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getRuns(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                month: req.query.month,
                status: req.query.status
            };

            const result = await PayrollService.getAllRuns(filters, page, limit);
            return successWithPagination(res, 'Payroll runs retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getRunById(req, res) {
        try {
            const run = await PayrollService.getRunById(req.params.id);
            return success(res, 'Payroll run retrieved successfully', run);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async approveRun(req, res) {
        try {
            const run = await PayrollService.approveRun(req.params.id);
            return success(res, 'Payroll run approved successfully', run);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async payRun(req, res) {
        try {
            const run = await PayrollService.payRun(req.params.id);
            return success(res, 'Payroll run paid and expense recorded successfully', run);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteRun(req, res) {
        try {
            await PayrollService.deleteRun(req.params.id);
            return success(res, 'Payroll run deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }
}

module.exports = new PayrollController();
