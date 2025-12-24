var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Payroll } = require('./payroll.models');
const { Staff } = require('../staffs/staffs.model');
class PayrollRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.staff_id)
                where.staff_id = filters.staff_id;
            if (filters.month)
                where.month = filters.month;
            if (filters.year)
                where.year = filters.year;
            if (filters.status)
                where.status = filters.status;
            return yield Payroll.findAndCountAll({
                where,
                include: [{
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email', 'position']
                    }],
                order: [['created_at', 'DESC']],
                limit,
                offset
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payroll.findByPk(id, {
                include: [{
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email', 'position']
                    }]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payroll.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payroll = yield Payroll.findByPk(id);
            if (!payroll)
                return null;
            yield payroll.update(data);
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payroll = yield Payroll.findByPk(id);
            if (!payroll)
                return null;
            yield payroll.destroy();
            return payroll;
        });
    }
}
// Define association here to ensure it's registered
Payroll.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });
module.exports = new PayrollRepository();
