var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const service = require('./role.service');
const { success, successWithPagination } = require('../../core/utils/response');
exports.list = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { rows, total } = yield service.list(page, limit);
        return successWithPagination(res, 'Roles retrieved successfully', rows, {
            total,
            page,
            limit
        });
    }
    catch (err) {
        next(err);
    }
});
exports.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const row = yield service.get(req.params.id);
        return success(res, 'Role retrieved successfully', row);
    }
    catch (err) {
        next(err);
    }
});
exports.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const row = yield service.create(req.body);
        return success(res, 'Role created successfully', row, 201);
    }
    catch (err) {
        next(err);
    }
});
exports.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const row = yield service.update(req.params.id, req.body);
        return success(res, 'Role updated successfully', row);
    }
    catch (err) {
        next(err);
    }
});
exports.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield service.remove(req.params.id);
        return success(res, 'Role deleted successfully', null);
    }
    catch (err) {
        next(err);
    }
});
