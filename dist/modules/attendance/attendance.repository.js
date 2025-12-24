var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Attendance } = require('./attendance.model');
const { Staff } = require('../staffs/staffs.model');
class AttendanceRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.staff_id)
                where.staff_id = filters.staff_id;
            if (filters.date)
                where.date = filters.date;
            if (filters.status)
                where.status = filters.status;
            return yield Attendance.findAndCountAll({
                where,
                include: [{
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }],
                order: [['date', 'DESC'], ['check_in', 'ASC']],
                limit,
                offset
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Attendance.findByPk(id, {
                include: [{
                        model: Staff,
                        as: 'staff',
                        attributes: ['id', 'first_name', 'last_name', 'email']
                    }]
            });
        });
    }
    findByStaffAndDate(staffId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Attendance.findOne({
                where: { staff_id: staffId, date }
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Attendance.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield Attendance.findByPk(id);
            if (!attendance)
                return null;
            yield attendance.update(data);
            return yield this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield Attendance.findByPk(id);
            if (!attendance)
                return null;
            yield attendance.destroy();
            return attendance;
        });
    }
}
// Define association
Attendance.belongsTo(Staff, { foreignKey: 'staff_id', as: 'staff' });
module.exports = new AttendanceRepository();
