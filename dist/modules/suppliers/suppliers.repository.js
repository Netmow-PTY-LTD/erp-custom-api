var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Supplier } = require('./suppliers.model');
const { Op } = require('sequelize');
class SupplierRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.is_active !== undefined) {
                where.is_active = filters.is_active;
            }
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { email: { [Op.like]: `%${filters.search}%` } },
                    { contact_person: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Supplier.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Supplier.findByPk(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Supplier.findOne({ where: { email } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Supplier.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield Supplier.findByPk(id);
            if (!supplier)
                return null;
            return yield supplier.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = yield Supplier.findByPk(id);
            if (!supplier)
                return null;
            yield supplier.destroy();
            return supplier;
        });
    }
    findSuppliersWithLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Supplier.findAll({
                where: {
                    latitude: { [Op.ne]: null },
                    longitude: { [Op.ne]: null },
                    is_active: true
                },
                attributes: ['id', 'name', 'contact_person', 'address', 'city', 'latitude', 'longitude', 'phone', 'email']
            });
        });
    }
}
module.exports = new SupplierRepository();
