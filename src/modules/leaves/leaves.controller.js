const LeaveService = require('./leaves.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class LeaveController {
    async getLeaves(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                staff_id: req.query.staff_id,
                status: req.query.status,
                leave_type: req.query.leave_type
            };

            const result = await LeaveService.getAllLeaves(filters, page, limit);
            return successWithPagination(res, 'Leave applications retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getLeaveById(req, res) {
        try {
            const leave = await LeaveService.getLeaveById(req.params.id);
            return success(res, 'Leave application retrieved successfully', leave);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createLeave(req, res) {
        try {
            const leave = await LeaveService.createLeave(req.body, req.user.id);
            return success(res, 'Leave application submitted successfully', leave, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateLeave(req, res) {
        try {
            const leave = await LeaveService.updateLeave(req.params.id, req.body);
            return success(res, 'Leave application updated successfully', leave);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const leave = await LeaveService.updateStatus(req.params.id, status, req.user.id);
            return success(res, `Leave application ${status} successfully`, leave);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteLeave(req, res) {
        try {
            await LeaveService.deleteLeave(req.params.id);
            return success(res, 'Leave application deleted successfully');
        } catch (err) {
            return error(res, err.message, 404);
        }
    }
}

module.exports = new LeaveController();
