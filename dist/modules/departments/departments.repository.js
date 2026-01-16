var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Department } = require('./departments.model');
const { Op } = require('sequelize');
class DepartmentRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.status) {
                where.status = filters.status;
            }
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { description: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Department.findAndCountAll({
                where,
                order: [['name', 'ASC']],
                limit,
                offset
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Department.findByPk(id);
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Department.findOne({ where: { name } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Department.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield Department.findByPk(id);
            if (!department)
                return null;
            yield department.update(data);
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield Department.findByPk(id);
            if (!department)
                return null;
            yield department.destroy();
            return department;
        });
    }
}
module.exports = new DepartmentRepository();
