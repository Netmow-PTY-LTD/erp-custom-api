var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SupplierService = require('./suppliers.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class SupplierController {
    getAllSuppliers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield SupplierService.getAllSuppliers(filters, page, limit);
                return successWithPagination(res, 'Suppliers retrieved successfully', result.data, {
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
    getSupplierById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supplier = yield SupplierService.getSupplierById(req.params.id);
                return success(res, 'Supplier retrieved successfully', supplier);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createSupplier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supplier = yield SupplierService.createSupplier(req.body, req.user.id);
                return success(res, 'Supplier created successfully', supplier, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateSupplier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const supplier = yield SupplierService.updateSupplier(req.params.id, req.body);
                return success(res, 'Supplier updated successfully', supplier);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteSupplier(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield SupplierService.deleteSupplier(req.params.id);
                return success(res, null, 'Supplier deleted successfully');
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new SupplierController();
