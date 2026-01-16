var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Customer } = require('./customers.model');
const { Op } = require('sequelize');
class CustomerRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.customer_type) {
                where.customer_type = filters.customer_type;
            }
            if (filters.is_active !== undefined) {
                where.is_active = filters.is_active;
            }
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { email: { [Op.like]: `%${filters.search}%` } },
                    { phone: { [Op.like]: `%${filters.search}%` } },
                    { company: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Customer.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Customer.findByPk(id);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Customer.findOne({ where: { email } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Customer.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer.findByPk(id);
            if (!customer)
                return null;
            return yield customer.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield Customer.findByPk(id);
            if (!customer)
                return null;
            yield customer.destroy();
            return customer;
        });
    }
    findCustomersWithLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Customer.findAll({
                where: {
                    latitude: { [Op.ne]: null },
                    longitude: { [Op.ne]: null },
                    is_active: true
                },
                attributes: ['id', 'name', 'company', 'address', 'city', 'latitude', 'longitude', 'phone', 'email']
            });
        });
    }
}
module.exports = new CustomerRepository();
