const PayrollRepository = require('./payroll.repository');
const { Staff } = require('../staffs/staffs.model');

class PayrollService {
    async getAllPayrolls(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await PayrollRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getPayrollById(id) {
        const payroll = await PayrollRepository.findById(id);
        if (!payroll) {
            throw new Error('Payroll record not found');
        }
        return payroll;
    }

    async createPayroll(data, userId) {
        // Verify staff exists
        const staff = await Staff.findByPk(data.staff_id);
        if (!staff) {
            throw new Error('Staff member not found');
        }

        // Calculate net salary
        // Net = Basic + Allowances - Deductions
        const basic = parseFloat(data.basic_salary) || 0;

        let totalAllowances = 0;
        if (data.allowances) {
            Object.values(data.allowances).forEach(val => {
                totalAllowances += parseFloat(val) || 0;
            });
        }

        let totalDeductions = 0;
        if (data.deductions) {
            Object.values(data.deductions).forEach(val => {
                totalDeductions += parseFloat(val) || 0;
            });
        }

        const netSalary = basic + totalAllowances - totalDeductions;

        const payrollData = {
            ...data,
            net_salary: netSalary,
            created_by: userId
        };

        return await PayrollRepository.create(payrollData);
    }

    async updatePayroll(id, data) {
        // Recalculate net salary if financial fields change
        if (data.basic_salary || data.allowances || data.deductions) {
            const current = await this.getPayrollById(id);

            const basic = parseFloat(data.basic_salary !== undefined ? data.basic_salary : current.basic_salary);

            const allowances = data.allowances || current.allowances || {};
            let totalAllowances = 0;
            Object.values(allowances).forEach(val => totalAllowances += parseFloat(val) || 0);

            const deductions = data.deductions || current.deductions || {};
            let totalDeductions = 0;
            Object.values(deductions).forEach(val => totalDeductions += parseFloat(val) || 0);

            data.net_salary = basic + totalAllowances - totalDeductions;
        }

        const payroll = await PayrollRepository.update(id, data);
        if (!payroll) {
            throw new Error('Payroll record not found');
        }
        return payroll;
    }

    async deletePayroll(id) {
        const payroll = await PayrollRepository.delete(id);
        if (!payroll) {
            throw new Error('Payroll record not found');
        }
        return payroll;
    }
}

module.exports = new PayrollService();
