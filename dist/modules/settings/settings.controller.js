var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SettingsService = require('./settings.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class SettingsController {
    constructor(settingsService) {
        this.settingsService = settingsService || SettingsService;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield this.settingsService.getAll(page, limit);
                return successWithPagination(res, 'Settings retrieved successfully', result.data, {
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
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setting = yield this.settingsService.getById(req.params.id);
                return success(res, 'Setting retrieved successfully', setting);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setting = yield this.settingsService.create(req.body);
                return success(res, 'Setting created successfully', setting, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setting = yield this.settingsService.update(req.params.id, req.body);
                return success(res, 'Setting updated successfully', setting);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.settingsService.delete(req.params.id);
                return success(res, 'Setting deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    getCompanyProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.settingsService.getCompanyProfile();
                return success(res, 'Company profile retrieved successfully', profile);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    updateCompanyProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.settingsService.updateCompanyProfile(req.body);
                return success(res, 'Company profile updated successfully', profile);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
}
module.exports = SettingsController;
