var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const UserService = require('./user.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class UserController {
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    role_id: req.query.role_id,
                    search: req.query.search
                };
                const result = yield UserService.getAllUsers(filters, page, limit);
                return successWithPagination(res, 'Users retrieved successfully', result.data, {
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
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserService.getUserById(req.params.id);
                return success(res, 'User retrieved successfully', user);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserService.createUser(req.body);
                return success(res, 'User created successfully', user, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserService.updateUser(req.params.id, req.body);
                return success(res, 'User updated successfully', user);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield UserService.deleteUser(req.params.id);
                return success(res, 'User deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new UserController();
