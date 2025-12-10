const AttendanceService = require('./attendance.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class AttendanceController {
    async getAttendances(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                staff_id: req.query.staff_id,
                date: req.query.date,
                status: req.query.status
            };

            const result = await AttendanceService.getAllAttendances(filters, page, limit);
            return successWithPagination(res, 'Attendance records retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getAttendanceById(req, res) {
        try {
            const attendance = await AttendanceService.getAttendanceById(req.params.id);
            return success(res, 'Attendance record retrieved successfully', attendance);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async checkIn(req, res) {
        try {
            const attendance = await AttendanceService.checkIn(req.body, req.user.id);
            return success(res, 'Checked in successfully', attendance, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async checkOut(req, res) {
        try {
            const attendance = await AttendanceService.checkOut(req.body);
            return success(res, 'Checked out successfully', attendance);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateAttendance(req, res) {
        try {
            const attendance = await AttendanceService.updateAttendance(req.params.id, req.body);
            return success(res, 'Attendance updated successfully', attendance);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteAttendance(req, res) {
        try {
            await AttendanceService.deleteAttendance(req.params.id);
            return success(res, 'Attendance deleted successfully');
        } catch (err) {
            return error(res, err.message, 404);
        }
    }
}

module.exports = new AttendanceController();
