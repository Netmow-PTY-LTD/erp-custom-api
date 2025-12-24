var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AttendanceService = require('./attendance.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class AttendanceController {
    getAttendances(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    staff_id: req.query.staff_id,
                    date: req.query.date,
                    status: req.query.status
                };
                const result = yield AttendanceService.getAllAttendances(filters, page, limit);
                return successWithPagination(res, 'Attendance records retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getAttendanceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendance = yield AttendanceService.getAttendanceById(req.params.id);
                return success(res, 'Attendance record retrieved successfully', attendance);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    checkIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendance = yield AttendanceService.checkIn(req.body, req.user.id);
                return success(res, 'Checked in successfully', attendance, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    checkOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendance = yield AttendanceService.checkOut(req.body);
                return success(res, 'Checked out successfully', attendance);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateAttendance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attendance = yield AttendanceService.updateAttendance(req.params.id, req.body);
                return success(res, 'Attendance updated successfully', attendance);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteAttendance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield AttendanceService.deleteAttendance(req.params.id);
                return success(res, 'Attendance deleted successfully');
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new AttendanceController();
