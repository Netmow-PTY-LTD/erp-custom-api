var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SalesRouteService = require('./salesroute.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class SalesRouteController {
    getAllRoutes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield SalesRouteService.getAllRoutes(filters, page, limit);
                return successWithPagination(res, 'Sales routes retrieved successfully', result.data, {
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
    getRouteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield SalesRouteService.getRouteById(req.params.id);
                return success(res, 'Sales route retrieved successfully', route);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield SalesRouteService.createRoute(req.body, req.user.id);
                return success(res, 'Sales route created successfully', route, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const route = yield SalesRouteService.updateRoute(req.params.id, req.body);
                return success(res, 'Sales route updated successfully', route);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteRoute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SalesRouteService.deleteRoute(req.params.id);
                return success(res, 'Sales route deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new SalesRouteController();
