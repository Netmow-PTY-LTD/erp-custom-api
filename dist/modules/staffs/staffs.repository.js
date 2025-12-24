var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Staff } = require('./staffs.model');
const { Department } = require('../departments/departments.model');
const { Op } = require('sequelize');
class StaffRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.department_id) {
                where.department_id = filters.department_id;
            }
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.search) {
                where[Op.or] = [
                    { first_name: { [Op.like]: `%${filters.search}%` } },
                    { last_name: { [Op.like]: `%${filters.search}%` } },
                    { email: { [Op.like]: `%${filters.search}%` } },
                    { position: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Staff.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']],
                include: [{
                        model: Department,
                        as: 'department',
                        attributes: ['id', 'name', 'description']
                    }]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Staff.findByPk(id, {
                include: [{
                        model: Department,
                        as: 'department',
                        attributes: ['id', 'name', 'description']
                    }]
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Staff.findOne({ where: { email } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Staff.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield Staff.findByPk(id);
            if (!staff)
                return null;
            return yield staff.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield Staff.findByPk(id);
            if (!staff)
                return null;
            yield staff.destroy();
            return staff;
        });
    }
}
module.exports = new StaffRepository();
