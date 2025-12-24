var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { User } = require('./user.model');
const { Role } = require('../roles/role.model');
const { Op } = require('sequelize');
class UserRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.role_id) {
                where.role_id = filters.role_id;
            }
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { email: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield User.findAndCountAll({
                where,
                limit,
                offset,
                include: [{
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name']
                    }],
                attributes: { exclude: ['password'] },
                order: [['created_at', 'DESC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findByPk(id, {
                include: [{
                        model: Role,
                        as: 'role',
                        attributes: ['id', 'name']
                    }]
            });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ where: { email } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findByPk(id);
            if (!user)
                return null;
            return yield user.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.findByPk(id);
            if (!user)
                return null;
            yield user.destroy();
            return user;
        });
    }
}
module.exports = new UserRepository();
