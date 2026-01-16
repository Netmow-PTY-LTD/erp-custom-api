var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Leave } = require('./leaves.model');
const { Staff } = require('../staffs/staffs.model');
class LeaveRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.staff_id)
                where.staff_id = filters.staff_id;
            if (filters.status)
                where.status = filters.status;
            if (filters.leave_type)
                where.leave_type = filters.leave_type;
            return yield Leave.findAndCountAll({
                where,
                include: [
                    {
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: Staff,
                        as: 'approver',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                ],
                order: [['start_date', 'DESC']],
                limit,
                offset
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Leave.findByPk(id, {
                include: [
                    {
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    },
                    {
                        model: Staff,
                        as: 'approver',
                        attributes: ['id', 'first_name', 'last_name']
                    }
                ]
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Leave.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield Leave.findByPk(id);
            if (!leave)
                return null;
            yield leave.update(data);
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield Leave.findByPk(id);
            if (!leave)
                return null;
            yield leave.destroy();
            return leave;
        });
    }
}
// Define associations
Leave.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });
Leave.belongsTo(Staff, { foreignKey: 'approved_by', as: 'approver' });
module.exports = new LeaveRepository();
