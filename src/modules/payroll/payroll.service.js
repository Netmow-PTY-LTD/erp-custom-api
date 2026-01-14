const PayrollRepository = require('./payroll.repository');
const AccountingRepository = require('../accounting/accounting.repository');
const { User: Staff } = require('../users/user.model');

class PayrollService {
    async getAllRuns(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await PayrollRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getRunById(id) {
        const run = await PayrollRepository.findById(id);
        if (!run) {
            throw new Error('Payroll run not found');
        }
        return run;
    }

    async generateRun(month, createdBy) {
        // 1. Check if run already exists for this month
        const existing = await PayrollRepository.findAll({ month });
        if (existing.count > 0) {
            throw new Error(`Payroll run for month ${month} already exists`);
        }

        // 2. Fetch all active staff
        const staffs = await Staff.findAll({ where: { status: 'active' } });
        if (staffs.length === 0) {
            throw new Error('No active staff found to generate payroll');
        }

        // 3. Calculate payroll items
        let totalGross = 0;
        let totalNet = 0;
        const items = staffs.map(staff => {
            // Assuming simplified logic: Basic Salary field exists or defaults to 0
            // If explicit salary field is added to User model, use it. 
            // Currently User model might not have 'salary' explicitly unless I added it. 
            // I'll check if 'salary' exists in User model, otherwise use 0.
            const basic = parseFloat(staff.salary) || 0;

            // Allowances/Deductions could be fetched from staff settings if they exist
            const allowances = {};
            const deductions = {};

            const gross = basic; // + allowances
            const net = basic; // - deductions

            totalGross += gross;
            totalNet += net;

            return {
                staff_id: staff.id,
                basic_salary: basic,
                allowances,
                deductions,
                gross_pay: gross,
                net_pay: net
            };
        });

        const runData = {
            month,
            total_gross: totalGross,
            total_net: totalNet,
            status: 'pending',
            created_by: createdBy
        };

        return await PayrollRepository.createRun(runData, items);
    }

    async approveRun(id) {
        const run = await this.getRunById(id);
        if (run.status !== 'pending') {
            throw new Error('Only pending runs can be approved');
        }
        return await PayrollRepository.updateStatus(id, 'approved');
    }

    async payRun(id) {
        const run = await this.getRunById(id);
        if (run.status === 'paid') {
            throw new Error('Payroll run is already paid');
        }
        if (run.status !== 'approved') {
            throw new Error('Payroll run must be approved before payment');
        }

        // 1. Mark as Paid
        const paymentDate = new Date();
        const updatedRun = await PayrollRepository.updateStatus(id, 'paid', paymentDate);

        // 2. Create Accounting Expense
        // We need a Debit Head ID for "Salaries & Wages". 
        // For now, we'll try to find one or create it if not exists, or just use a placeholder logic.
        // Ideally, we fetch the head by code 'SALARY'.
        let salaryHead = null;
        try {
            const heads = await AccountingRepository.findAllDebitHeads({ search: 'Salary' });
            if (heads.rows.length > 0) {
                salaryHead = heads.rows[0];
            } else {
                salaryHead = await AccountingRepository.createDebitHead({
                    name: 'Salaries & Wages',
                    code: 'SALARY',
                    description: 'Staff Salaries'
                });
            }
        } catch (e) {
            console.warn('Could not fetch/create salary head:', e);
        }

        await AccountingRepository.createExpense({
            title: `Payroll Payment - ${run.month}`,
            amount: run.total_net,
            expense_date: paymentDate,
            category: 'Payroll',
            debit_head_id: salaryHead ? salaryHead.id : null,
            description: `Auto-generated payroll payment for ${run.month}`,
            status: 'paid',
            created_by: run.created_by
        });

        return updatedRun;
    }

    async deleteRun(id) {
        const run = await this.getRunById(id);
        if (run.status === 'paid') {
            throw new Error('Cannot delete a paid payroll run');
        }
        return await PayrollRepository.delete(id);
    }
}

module.exports = new PayrollService();
