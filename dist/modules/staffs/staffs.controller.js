var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const StaffService = require('./staffs.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class StaffController {
    getAllStaffs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    department_id: req.query.department_id,
                    status: req.query.status,
                    search: req.query.search
                };
                const result = yield StaffService.getAllStaffs(filters, page, limit);
                return successWithPagination(res, 'Staff members retrieved successfully', result.data, {
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
    getStaffById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staff = yield StaffService.getStaffById(req.params.id);
                return success(res, 'Staff retrieved successfully', staff);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staff = yield StaffService.createStaff(req.body, req.user.id);
                return success(res, 'Staff created successfully', staff, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const staff = yield StaffService.updateStaff(req.params.id, req.body);
                return success(res, 'Staff updated successfully', staff);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteStaff(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield StaffService.deleteStaff(req.params.id);
                return success(res, 'Staff deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new StaffController();
