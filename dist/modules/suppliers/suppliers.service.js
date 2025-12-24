var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SupplierRepository = require('./suppliers.repository');
class SupplierService {
    getAllSuppliers() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            try {
                const offset = (page - 1) * limit;
                const result = yield SupplierRepository.findAll(filters, limit, offset);
                return {
                    data: result.rows,
                    total: result.count
                };
            }
            catch (err) {
                throw new Error(`Failed to get suppliers: ${err.message}`);
            }
        });
    }
    getSupplierById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield SupplierRepository.findById(id);
            if (!supplier) {
                throw new Error('Supplier not found');
            }
            return supplier;
        });
    }
    createSupplier(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if email already exists (if provided)
            if (data.email) {
                const existing = yield SupplierRepository.findByEmail(data.email);
                if (existing) {
                    throw new Error('Supplier with this email already exists');
                }
            }
            return yield SupplierRepository.create(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    updateSupplier(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // If email is being updated, check for duplicates
            if (data.email) {
                const existing = yield SupplierRepository.findByEmail(data.email);
                if (existing && existing.id !== parseInt(id)) {
                    throw new Error('Supplier with this email already exists');
                }
            }
            const supplier = yield SupplierRepository.update(id, data);
            if (!supplier) {
                throw new Error('Supplier not found');
            }
            return supplier;
        });
    }
    deleteSupplier(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield SupplierRepository.delete(id);
            if (!supplier) {
                throw new Error('Supplier not found');
            }
            return supplier;
        });
    }
}
module.exports = new SupplierService();
