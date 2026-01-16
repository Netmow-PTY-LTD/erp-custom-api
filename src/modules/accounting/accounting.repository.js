const { Account, Transaction, Journal, JournalLine } = require('./accounting.models');
const { Op } = require('sequelize');
const { sequelize } = require('../../core/database/sequelize');

class AccountingRepository {

    // --- Transaction Helper ---
    async createTransaction(data, transaction) {
        return await Transaction.create(data, { transaction });
    }

    async findAllTransactions(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.type) where.type = filters.type;

        // Date aliases
        const fromDate = filters.from || filters.start_date;
        const toDate = filters.to || filters.end_date;
        const exactDate = filters.date;

        if (fromDate && toDate) {
            where.date = { [Op.between]: [fromDate, toDate] };
        } else if (exactDate) {
            // Check if exactDate is just YYYY-MM-DD or full timestamp
            // If it's a date string, we might want to search the whole day
            // But 'date' in Transaction model is DATE (with time or without?).
            // In SQL model definition it is DATE (which usually includes time in Sequelize unless DATEONLY).
            // Let's assume DATEONLY behavior for single date query if possible, or exact match.
            // If the DB column is DATETIME, exact match on '2026-01-14' won't work if time differs.
            // For now, let's assume direct equality.
            where.date = exactDate;
        }

        return await Transaction.findAndCountAll({
            where,
            limit,
            offset,
            order: [['date', 'DESC'], ['id', 'DESC']]
        });
    }

    // --- Account Operations ---
    async findAccountByCode(code) {
        return await Account.findOne({ where: { code } });
    }

    async findAccountById(id) {
        return await Account.findByPk(id);
    }

    async findAccountByName(name) {
        return await Account.findOne({ where: { name } });
    }

    async findAllAccounts(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { code: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        const options = {
            where,
            order: [['code', 'ASC']]
        };

        if (limit) {
            options.limit = parseInt(limit);
            options.offset = parseInt(offset);
        }

        return await Account.findAndCountAll(options);
    }

    async findAccountsByTypes(types) {
        return await Account.findAll({
            where: {
                type: {
                    [Op.in]: types
                }
            },
            order: [['code', 'ASC']]
        });
    }

    async createAccount(data) {
        return await Account.create(data);
    }

    async updateAccount(id, data) {
        const account = await Account.findByPk(id);
        if (!account) throw new Error('Account not found');
        return await account.update(data);
    }

    async deleteAccount(id) {
        const account = await Account.findByPk(id);
        if (!account) throw new Error('Account not found');
        return await account.destroy();
    }

    // --- Journal Operations (Core) ---
    async createJournalEntry(journalData, linesData, transaction) {
        // 1. Create Journal Header
        const journal = await Journal.create(journalData, { transaction });

        // 2. Create Journal Lines
        const lines = linesData.map(line => ({
            ...line,
            journal_id: journal.id
        }));

        await JournalLine.bulkCreate(lines, { transaction });

        return journal;
    }

    // --- Reports ---

    // 1. Journal Report
    async getJournalReport(filters = {}, limit = 10, offset = 0) {
        const where = {};
        if (filters.from && filters.to) {
            where.date = { [Op.between]: [filters.from, filters.to] };
        }

        return await Journal.findAndCountAll({
            where,
            include: [{
                model: JournalLine,
                as: 'entries',
                include: [{
                    model: Account,
                    as: 'account',
                    attributes: ['code', 'name']
                }]
            }],
            limit,
            offset,
            distinct: true, // Ensure correct count of journals despite includes
            order: [['date', 'DESC'], ['id', 'DESC']]
        });
    }

    // 2. Ledger Report
    async getLedgerReport(accountId, filters = {}) {
        // We need to calculate opening balance if 'from' date is provided
        let openingBalance = 0;

        if (filters.from) {
            const prevLines = await JournalLine.findAll({
                where: { account_id: accountId },
                include: [{
                    model: Journal,
                    where: {
                        date: { [Op.lt]: filters.from }
                    }
                }]
            });

            // Calc opening balance
            // Asset/Expense: Dr + Cr -
            // Liability/Income/Equity: Cr + Dr -
            // For simplicity, we usually store as Dr-Cr or based on account type.
            // Let's get account type first.
            const account = await Account.findByPk(accountId);
            const isDebitNature = ['ASSET', 'EXPENSE'].includes(account.type);

            prevLines.forEach(line => {
                const debit = parseFloat(line.debit) || 0;
                const credit = parseFloat(line.credit) || 0;
                if (isDebitNature) {
                    openingBalance += (debit - credit);
                } else {
                    openingBalance += (credit - debit);
                }
            });
        }

        // Get transactions in range
        const where = { account_id: accountId };
        const journalWhere = {};
        if (filters.from && filters.to) {
            journalWhere.date = { [Op.between]: [filters.from, filters.to] };
        }

        const lines = await JournalLine.findAll({
            where,
            include: [{
                model: Journal,
                where: journalWhere,
                attributes: ['id', 'date', 'narration', 'reference_type', 'reference_id']
            }],
            order: [[Journal, 'date', 'ASC']]
        });

        return { openingBalance, lines };
    }

    // 3. Trial Balance
    async getTrialBalance(date) {
        // Sum all debits and credits for each account up to 'date'
        const where = {};
        if (date) {
            where.date = { [Op.lte]: date };
        }

        const accounts = await Account.findAll({
            include: [{
                model: JournalLine,
                include: [{
                    model: Journal,
                    where,
                    attributes: []
                }],
                attributes: ['debit', 'credit']
            }]
        });

        const trialBalance = accounts.map(acc => {
            let totalDebit = 0;
            let totalCredit = 0;

            acc.JournalLines.forEach(line => {
                totalDebit += parseFloat(line.debit) || 0;
                totalCredit += parseFloat(line.credit) || 0;
            });

            // If balanced, debit == credit, net is 0. 
            // Usually TB shows totals or net balance. 
            // Let's show totals as per spec.
            return {
                account: acc.name,
                code: acc.code,
                type: acc.type,
                debit: totalDebit,
                credit: totalCredit
            };
        });

        return trialBalance;
    }

    async createManualJournal(data) {
        return await sequelize.transaction(async (t) => {
            const journal = await Journal.create({
                date: data.date,
                narration: data.narration,
                reference_type: 'MANUAL',
            }, { transaction: t });

            const lines = data.entries.map(e => ({
                journal_id: journal.id,
                account_id: e.account_id,
                debit: e.debit,
                credit: e.credit
            }));

            await JournalLine.bulkCreate(lines, { transaction: t });
            return journal;
        });
    }

    // Re-implemented Overview for Dashboard using new tables
    async getTotalsByDateRange(startDate, endDate) {
        const whereDate = {};
        if (startDate && endDate) {
            whereDate.date = { [Op.between]: [startDate, endDate] };
        } else if (startDate) {
            whereDate.date = { [Op.gte]: startDate };
        }

        const getSumByType = async (type) => {
            const accounts = await Account.findAll({ where: { type } });
            const accountIds = accounts.map(a => a.id);

            if (accountIds.length === 0) return 0;

            // We need to join with Journal to filter by date
            const result = await JournalLine.findAll({
                attributes: [[sequelize.fn('SUM', sequelize.col(type === 'INCOME' ? 'credit' : 'debit')), 'total']],
                where: { account_id: { [Op.in]: accountIds } },
                include: [{
                    model: Journal,
                    attributes: [],
                    where: whereDate
                }],
                raw: true
            });

            // Result is [{ total: 1234 }]
            return result[0].total ? parseFloat(result[0].total) : 0;
        };

        const totalIncome = await getSumByType('INCOME');
        const totalExpense = await getSumByType('EXPENSE');

        // For Income: Credit - Debit (Logic used in P&L, though getSumByType only took credit. 
        // If we want Net Income for that account, we should do Credit - Debit. 
        // But for simplicity/speed in overview, usually Income accounts just have Credit and Expense just have Debit.
        // Let's refine for accuracy: Income = Sum(Credit) - Sum(Debit)

        const getNetSumByType = async (type) => {
            const accounts = await Account.findAll({ where: { type } });
            const accountIds = accounts.map(a => a.id);
            if (accountIds.length === 0) return 0;

            const result = await JournalLine.findAll({
                attributes: [
                    [sequelize.fn('SUM', sequelize.col('debit')), 'totalDebit'],
                    [sequelize.fn('SUM', sequelize.col('credit')), 'totalCredit']
                ],
                where: { account_id: { [Op.in]: accountIds } },
                include: [{
                    model: Journal,
                    attributes: [],
                    where: whereDate
                }],
                raw: true
            });

            const debit = result[0].totalDebit ? parseFloat(result[0].totalDebit) : 0;
            const credit = result[0].totalCredit ? parseFloat(result[0].totalCredit) : 0;

            if (type === 'INCOME') return credit - debit;
            if (type === 'EXPENSE') return debit - credit;
            return 0;
        }

        const netIncome = await getNetSumByType('INCOME');
        const netExpense = await getNetSumByType('EXPENSE');

        return {
            income: netIncome,
            expense: netExpense,
            net: netIncome - netExpense
        };
    }

    async getProfitAndLoss(filters = {}) {
        const where = {};
        if (filters.from && filters.to) {
            where.date = { [Op.between]: [filters.from, filters.to] };
        }

        const accounts = await Account.findAll({
            where: {
                type: { [Op.in]: ['INCOME', 'EXPENSE'] }
            },
            include: [{
                model: JournalLine,
                include: [{
                    model: Journal,
                    where,
                    attributes: []
                }],
                attributes: ['debit', 'credit']
            }]
        });

        const report = {
            income: [],
            expense: [],
            total_income: 0,
            total_expense: 0,
            net_profit: 0
        };

        accounts.forEach(acc => {
            let balance = 0;
            acc.JournalLines.forEach(line => {
                const debit = parseFloat(line.debit) || 0;
                const credit = parseFloat(line.credit) || 0;
                // Income: Credit +, Debit -
                // Expense: Debit +, Credit -
                if (acc.type === 'INCOME') {
                    balance += (credit - debit);
                } else {
                    balance += (debit - credit);
                }
            });

            if (balance !== 0) {
                const entry = { code: acc.code, name: acc.name, amount: balance };
                if (acc.type === 'INCOME') {
                    report.income.push(entry);
                    report.total_income += balance;
                } else {
                    report.expense.push(entry);
                    report.total_expense += balance;
                }
            }
        });

        report.net_profit = report.total_income - report.total_expense;
        return report;
    }
}

module.exports = new AccountingRepository();
