var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SalesRouteRepository = require('./salesroute.repository');
class SalesRouteService {
    getAllRoutes() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield SalesRouteRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getRouteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield SalesRouteRepository.findById(id);
            if (!route) {
                throw new Error('Sales route not found');
            }
            return route;
        });
    }
    createRoute(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield SalesRouteRepository.create(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    updateRoute(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield SalesRouteRepository.update(id, data);
            if (!route) {
                throw new Error('Sales route not found');
            }
            return route;
        });
    }
    deleteRoute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const route = yield SalesRouteRepository.delete(id);
            if (!route) {
                throw new Error('Sales route not found');
            }
            return route;
        });
    }
}
module.exports = new SalesRouteService();
