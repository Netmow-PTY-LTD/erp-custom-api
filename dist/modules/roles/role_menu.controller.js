var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const service = require('./role_menu.service');
const { success } = require('../../core/utils/response');
exports.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield service.create(req.body);
        success(res, 'Menu item created successfully', data, 201);
    }
    catch (err) {
        next(err);
    }
});
exports.list = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield service.list();
        success(res, 'Menu items retrieved successfully', data);
    }
    catch (err) {
        next(err);
    }
});
exports.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield service.get(req.params.id);
        success(res, 'Menu item retrieved successfully', data);
    }
    catch (err) {
        next(err);
    }
});
exports.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const data = yield service.update(req.params.id, req.body);
        success(res, 'Menu item updated successfully', data);
    }
    catch (err) {
        next(err);
    }
});
exports.remove = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield service.remove(req.params.id);
        success(res, 'Menu item deleted successfully', null);
    }
    catch (err) {
        next(err);
    }
});
