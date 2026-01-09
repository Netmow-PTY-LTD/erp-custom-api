const StaffRepository = require('./staffs.repository');
const bcrypt = require('bcrypt');

class StaffService {
    async getAllStaffs(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await StaffRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getStaffById(id) {
        const staff = await StaffRepository.findById(id);
        if (!staff) {
            throw new Error('Staff not found');
        }
        return staff;
    }

    async createStaff(data, userId) {
        if (data.email) {
            const existing = await StaffRepository.findByEmail(data.email);
            if (existing) {
                throw new Error('Staff with this email already exists');
            }
        }

        // Hash password if provided
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        // Sanitize data: convert empty strings to null
        const cleanData = { ...data };
        ['hire_date', 'thumb_url', 'position', 'phone', 'address', 'city', 'state', 'country', 'postal_code', 'notes'].forEach(field => {
            if (cleanData[field] === '') {
                cleanData[field] = null;
            }
        });

        return await StaffRepository.create({ ...cleanData, created_by: userId });
    }

    async updateStaff(id, data) {
        if (data.email) {
            const existing = await StaffRepository.findByEmail(data.email);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error('Staff with this email already exists');
            }
        }

        // Hash password if provided
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        // Sanitize data: convert empty strings to null
        const cleanData = { ...data };
        ['hire_date', 'thumb_url', 'position', 'phone', 'address', 'city', 'state', 'country', 'postal_code', 'notes'].forEach(field => {
            if (cleanData[field] === '') {
                cleanData[field] = null;
            }
        });

        const staff = await StaffRepository.update(id, cleanData);
        if (!staff) {
            throw new Error('Staff not found');
        }
        return staff;
    }

    async deleteStaff(id) {
        const staff = await StaffRepository.delete(id);
        if (!staff) {
            throw new Error('Staff not found');
        }
        return staff;
    }
}

module.exports = new StaffService();
