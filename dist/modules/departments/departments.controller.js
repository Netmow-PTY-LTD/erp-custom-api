var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DepartmentService = require('./departments.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class DepartmentController {
    getDepartments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    status: req.query.status,
                    search: req.query.search
                };
                const result = yield DepartmentService.getAllDepartments(filters, page, limit);
                return successWithPagination(res, 'Departments retrieved successfully', result.data, {
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
    getDepartmentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const department = yield DepartmentService.getDepartmentById(req.params.id);
                return success(res, 'Department retrieved successfully', department);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const department = yield DepartmentService.createDepartment(req.body, req.user.id);
                return success(res, 'Department created successfully', department, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const department = yield DepartmentService.updateDepartment(req.params.id, req.body);
                return success(res, 'Department updated successfully', department);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield DepartmentService.deleteDepartment(req.params.id);
                return success(res, 'Department deleted successfully');
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new DepartmentController();
