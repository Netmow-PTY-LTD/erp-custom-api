var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AttendanceRepository = require('./attendance.repository');
class AttendanceService {
    getAllAttendances() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield AttendanceRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getAttendanceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield AttendanceRepository.findById(id);
            if (!attendance) {
                throw new Error('Attendance record not found');
            }
            return attendance;
        });
    }
    checkIn(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if already checked in for today
            const existing = yield AttendanceRepository.findByStaffAndDate(data.staff_id, data.date);
            if (existing) {
                throw new Error('Attendance record already exists for this date');
            }
            return yield AttendanceRepository.create(Object.assign(Object.assign({}, data), { status: data.status || 'present', created_by: userId }));
        });
    }
    checkOut(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield AttendanceRepository.findByStaffAndDate(data.staff_id, data.date);
            if (!attendance) {
                throw new Error('No check-in record found for this date');
            }
            return yield AttendanceRepository.update(attendance.id, {
                check_out: data.check_out
            });
        });
    }
    updateAttendance(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield AttendanceRepository.update(id, data);
            if (!attendance) {
                throw new Error('Attendance record not found');
            }
            return attendance;
        });
    }
    deleteAttendance(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const attendance = yield AttendanceRepository.delete(id);
            if (!attendance) {
                throw new Error('Attendance record not found');
            }
            return attendance;
        });
    }
}
module.exports = new AttendanceService();
