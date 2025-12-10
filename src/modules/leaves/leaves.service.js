const LeaveRepository = require('./leaves.repository');

class LeaveService {
    async getAllLeaves(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await LeaveRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getLeaveById(id) {
        const leave = await LeaveRepository.findById(id);
        if (!leave) {
            throw new Error('Leave application not found');
        }
        return leave;
    }

    async createLeave(data, userId) {
        // Basic validation: End date >= Start date
        if (new Date(data.end_date) < new Date(data.start_date)) {
            throw new Error('End date cannot be before start date');
        }

        return await LeaveRepository.create({
            ...data,
            status: 'pending',
            created_by: userId
        });
    }

    async updateLeave(id, data) {
        const leave = await LeaveRepository.update(id, data);
        if (!leave) {
            throw new Error('Leave application not found');
        }
        return leave;
    }

    async updateStatus(id, status, approverId) {
        const leave = await LeaveRepository.update(id, {
            status,
            approved_by: approverId
        });
        if (!leave) {
            throw new Error('Leave application not found');
        }
        return leave;
    }

    async deleteLeave(id) {
        const leave = await LeaveRepository.delete(id);
        if (!leave) {
            throw new Error('Leave application not found');
        }
        return leave;
    }
}

module.exports = new LeaveService();
