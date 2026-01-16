var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PayrollRepository = require('./payroll.repository');
const { Staff } = require('../staffs/staffs.model');
class PayrollService {
    getAllPayrolls() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield PayrollRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getPayrollById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payroll = yield PayrollRepository.findById(id);
            if (!payroll) {
                throw new Error('Payroll record not found');
            }
            return payroll;
        });
    }
    createPayroll(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify staff exists
            const staff = yield Staff.findByPk(data.staff_id);
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
            const payrollData = Object.assign(Object.assign({}, data), { net_salary: netSalary, created_by: userId });
            return yield PayrollRepository.create(payrollData);
        });
    }
    updatePayroll(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Recalculate net salary if financial fields change
            if (data.basic_salary || data.allowances || data.deductions) {
                const current = yield this.getPayrollById(id);
                const basic = parseFloat(data.basic_salary !== undefined ? data.basic_salary : current.basic_salary);
                const allowances = data.allowances || current.allowances || {};
                let totalAllowances = 0;
                Object.values(allowances).forEach(val => totalAllowances += parseFloat(val) || 0);
                const deductions = data.deductions || current.deductions || {};
                let totalDeductions = 0;
                Object.values(deductions).forEach(val => totalDeductions += parseFloat(val) || 0);
                data.net_salary = basic + totalAllowances - totalDeductions;
            }
            const payroll = yield PayrollRepository.update(id, data);
            if (!payroll) {
                throw new Error('Payroll record not found');
            }
            return payroll;
        });
    }
    deletePayroll(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payroll = yield PayrollRepository.delete(id);
            if (!payroll) {
                throw new Error('Payroll record not found');
            }
            return payroll;
        });
    }
}
module.exports = new PayrollService();
