const AttendanceRepository = require('./attendance.repository');

class AttendanceService {
    async getAllAttendances(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await AttendanceRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getAttendanceById(id) {
        const attendance = await AttendanceRepository.findById(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }

    async checkIn(data, userId) {
        // Check if already checked in for today
        const existing = await AttendanceRepository.findByStaffAndDate(data.staff_id, data.date);
        if (existing) {
            throw new Error('Attendance record already exists for this date');
        }

        return await AttendanceRepository.create({
            ...data,
            status: data.status || 'present',
            created_by: userId
        });
    }

    async checkOut(data) {
        const attendance = await AttendanceRepository.findByStaffAndDate(data.staff_id, data.date);
        if (!attendance) {
            throw new Error('No check-in record found for this date');
        }

        return await AttendanceRepository.update(attendance.id, {
            check_out: data.check_out
        });
    }

    async updateAttendance(id, data) {
        const attendance = await AttendanceRepository.update(id, data);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }

    async deleteAttendance(id) {
        const attendance = await AttendanceRepository.delete(id);
        if (!attendance) {
            throw new Error('Attendance record not found');
        }
        return attendance;
    }
}

module.exports = new AttendanceService();
