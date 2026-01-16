var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const LeaveService = require('./leaves.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class LeaveController {
    getLeaves(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    staff_id: req.query.staff_id,
                    status: req.query.status,
                    leave_type: req.query.leave_type
                };
                const result = yield LeaveService.getAllLeaves(filters, page, limit);
                return successWithPagination(res, 'Leave applications retrieved successfully', result.data, {
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
    getLeaveById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leave = yield LeaveService.getLeaveById(req.params.id);
                return success(res, 'Leave application retrieved successfully', leave);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createLeave(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leave = yield LeaveService.createLeave(req.body, req.user.id);
                return success(res, 'Leave application submitted successfully', leave, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateLeave(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const leave = yield LeaveService.updateLeave(req.params.id, req.body);
                return success(res, 'Leave application updated successfully', leave);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.body;
                const leave = yield LeaveService.updateStatus(req.params.id, status, req.user.id);
                return success(res, `Leave application ${status} successfully`, leave);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteLeave(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield LeaveService.deleteLeave(req.params.id);
                return success(res, 'Leave application deleted successfully');
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new LeaveController();
