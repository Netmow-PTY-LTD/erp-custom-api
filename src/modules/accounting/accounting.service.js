const AccountingRepository = require('./accounting.repository');
const { sequelize } = require('../../core/database/sequelize');

// Account Code Mapping (Hardcoded for this MVP based on MD)
// In a real app, these would be fetched from DB or config
const ACCOUNTS = {
    CASH: '1000',
    BANK: '1100',
    AR: '1200', // Accounts Receivable
    INVENTORY: '1300',
    AP: '2000', // Accounts Payable
    PAYABLE_SURGEON: '2100',
    OWNER_CAPITAL: '3000',
    SALES: '4000',
    OTHER_INCOME: '4100',
    PURCHASE: '5000',
    SALES_RETURN: '5100',
    OFFICE_EXPENSE: '5200',
    SURGEON_FEE: '5300',
    PURCHASE_RETURN: '5400' // Assuming code for Purchase Return
};

class AccountingService {

    // Helper to get Account ID by Code
    async getAccountId(code) {
        const account = await AccountingRepository.findAccountByCode(code);
        if (!account) throw new Error(`Account with code ${code} not found. Please Seed Accounts.`);
        return account.id;
    }

    // --- Core Transaction Processing ---
    async processTransaction(data) {
        // Run in a transaction block
        return await sequelize.transaction(async (t) => {
            // 1. Create the Single Entry Transaction
            const transaction = await AccountingRepository.createTransaction(data, t);

            // 2. Auto Journal Logic
            let drCode, crCode;
            const amount = parseFloat(data.amount);
            const narration = data.description || `${data.type} Transaction`;

            switch (data.type) {
                case 'SALES':
                    // Cr Sales
                    crCode = ACCOUNTS.SALES;
                    // Dr Cash or AR
                    drCode = (data.payment_mode === 'CASH') ? ACCOUNTS.CASH :
                        (data.payment_mode === 'BANK') ? ACCOUNTS.BANK : ACCOUNTS.AR;
                    break;

                case 'PURCHASE':
                    // Dr Purchase
                    drCode = ACCOUNTS.PURCHASE;
                    // Cr Cash, Bank or AP
                    crCode = (data.payment_mode === 'CASH') ? ACCOUNTS.CASH :
                        (data.payment_mode === 'BANK') ? ACCOUNTS.BANK : ACCOUNTS.AP;
                    break;

                case 'SALES_RETURN':
                    // Dr Sales Return
                    drCode = ACCOUNTS.SALES_RETURN;
                    // Cr Cash or AR (Usually Cash refund)
                    crCode = (data.payment_mode === 'CASH') ? ACCOUNTS.CASH : ACCOUNTS.AR; // Simplified
                    break;

                case 'PURCHASE_RETURN':
                    // Dr Cash or AP
                    drCode = (data.payment_mode === 'CASH') ? ACCOUNTS.CASH : ACCOUNTS.AP;
                    // Cr Purchase Return
                    crCode = ACCOUNTS.PURCHASE_RETURN;
                    break;

                case 'EXPENSE': // Daily Expense
                    // Dr Expense Category (Map 'category' to Code? For now use generic Office Expense)
                    // TODO: In future map data.category to specific expense codes
                    drCode = ACCOUNTS.OFFICE_EXPENSE;
                    // Cr Cash
                    crCode = ACCOUNTS.CASH;
                    break;

                case 'INCOME': // Daily Income
                    // Dr Cash
                    drCode = ACCOUNTS.CASH;
                    // Cr Other Income
                    crCode = ACCOUNTS.OTHER_INCOME;
                    break;

                case 'BANK_DEPOSIT': // Contra
                    // Dr Bank
                    drCode = ACCOUNTS.BANK;
                    // Cr Cash
                    crCode = ACCOUNTS.CASH;
                    break;

                case 'PROFESSIONAL_FEE': // Surgeon Fee
                    if (data.payment_mode === 'DUE') {
                        // Book Liability
                        drCode = ACCOUNTS.SURGEON_FEE;
                        crCode = ACCOUNTS.PAYABLE_SURGEON;
                    } else {
                        // Pay Liability directly? Or Expense -> Cash?
                        // If just paying the liability:
                        // Dr Payable Surgeon
                        // Cr Cash
                        // Check if paying a liability or booking expense
                        if (data.person === 'SURGEON' && data.description?.includes('PAYMENT')) {
                            drCode = ACCOUNTS.PAYABLE_SURGEON;
                            crCode = ACCOUNTS.CASH;
                        } else {
                            // Direct Expense
                            drCode = ACCOUNTS.SURGEON_FEE;
                            crCode = ACCOUNTS.CASH;
                        }
                    }
                    break;

                case 'PAYMENT_OUT': // Paying a Vendor (AP)
                    // Dr Accounts Payable
                    drCode = ACCOUNTS.AP;
                    // Cr Cash or Bank
                    crCode = (data.payment_mode === 'BANK') ? ACCOUNTS.BANK : ACCOUNTS.CASH;
                    break;

                case 'PAYMENT_IN': // Receiving from Customer (AR)
                    // Dr Cash or Bank
                    drCode = (data.payment_mode === 'BANK') ? ACCOUNTS.BANK : ACCOUNTS.CASH;
                    // Cr Accounts Receivable
                    crCode = ACCOUNTS.AR;
                    break;

                default:
                    throw new Error(`Unknown Transaction Type: ${data.type}`);
            }

            // 3. Prepare Journal Entries
            const drAccountId = await this.getAccountId(drCode);
            const crAccountId = await this.getAccountId(crCode);

            const journalData = {
                date: data.date || new Date(),
                reference_type: 'TRANSACTION',
                reference_id: transaction.id,
                narration: narration
            };

            const linesData = [
                { account_id: drAccountId, debit: amount, credit: 0 },
                { account_id: crAccountId, debit: 0, credit: amount }
            ];

            const journal = await AccountingRepository.createJournalEntry(journalData, linesData, t);

            return { transaction, journal };
        });
    }

    // --- Reports ---
    async getJournalReport(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const offset = (page - 1) * limit;

        const filters = {
            from: query.from,
            to: query.to
        };

        return await AccountingRepository.getJournalReport(filters, limit, offset);
    }

    async getTransactions(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 20;
        const offset = (page - 1) * limit;

        const filters = {
            from: query.from,
            to: query.to,
            type: query.type
        };

        return await AccountingRepository.findAllTransactions(filters, limit, offset);
    }

    async getLedgerReport(accountId, filters) {
        // Calculate running balance in Service or Repo? 
        // Repo returns { openingBalance, lines }
        const { openingBalance, lines } = await AccountingRepository.getLedgerReport(accountId, filters);

        // Transform to add running balance
        let currentBalance = openingBalance;
        const account = await AccountingRepository.findAccountByCode(filters.code); // Assuming we identify debit nature
        // Actually we need to fetch account details if we didn't pass it. 
        // Repo already handled account finding internally? No, Repo takes ID.
        // Let's assume we know nature for now.

        // We need account type to know direction of balance
        // If we don't have it easily, assume Debit increases Balance

        const enhancedLines = lines.map(line => {
            const dr = parseFloat(line.debit);
            const cr = parseFloat(line.credit);
            // Standard Logic: Asset/Exp/Drawings: Dr +, Cr -
            // Liab/Eq/Rev: Cr +, Dr -
            // For simple display, usually Dr is + and Cr is -
            currentBalance += (dr - cr);

            return {
                date: line.Journal.date,
                narration: line.Journal.narration,
                debit: dr,
                credit: cr,
                balance: currentBalance,
                type: line.Journal.reference_type
            };
        });

        return {
            account: accountId, // Should probably return account name too
            opening_balance: openingBalance,
            closing_balance: currentBalance,
            transactions: enhancedLines
        };
    }

    async getTrialBalance(date) {
        const data = await AccountingRepository.getTrialBalance(date);

        const totalDebit = data.reduce((sum, row) => sum + row.debit, 0);
        const totalCredit = data.reduce((sum, row) => sum + row.credit, 0);

        return {
            trial_balance: data,
            total_debit: totalDebit,
            total_credit: totalCredit,
            status: (Math.abs(totalDebit - totalCredit) < 0.01) ? 'BALANCED' : 'UNBALANCED'
        };
    }

    async getAccounts() {
        return await AccountingRepository.findAllAccounts();
    }

    async createAccount(data) {
        return await AccountingRepository.createAccount(data);
    }

    async updateAccount(id, data) {
        return await AccountingRepository.updateAccount(id, data);
    }

    async deleteAccount(id) {
        return await AccountingRepository.deleteAccount(id);
    }

    async seedAccounts() {
        // Default Accounts based on MD
        const seeds = [
            { code: ACCOUNTS.CASH, name: 'Cash', type: 'ASSET' },
            { code: ACCOUNTS.BANK, name: 'Bank', type: 'ASSET' },
            { code: ACCOUNTS.AR, name: 'Accounts Receivable', type: 'ASSET' },
            { code: ACCOUNTS.INVENTORY, name: 'Inventory', type: 'ASSET' },
            { code: ACCOUNTS.AP, name: 'Accounts Payable', type: 'LIABILITY' },
            { code: ACCOUNTS.PAYABLE_SURGEON, name: 'Payable - Surgeon', type: 'LIABILITY' },
            { code: ACCOUNTS.OWNER_CAPITAL, name: 'Owner Capital', type: 'EQUITY' },
            { code: ACCOUNTS.SALES, name: 'Sales', type: 'INCOME' },
            { code: ACCOUNTS.OTHER_INCOME, name: 'Other Income', type: 'INCOME' },
            { code: ACCOUNTS.PURCHASE, name: 'Purchase', type: 'EXPENSE' },
            { code: ACCOUNTS.SALES_RETURN, name: 'Sales Return', type: 'EXPENSE' }, // Contra-Revenue but handled as Expense type for simplicity or specific logic
            { code: ACCOUNTS.OFFICE_EXPENSE, name: 'Office Expense', type: 'EXPENSE' },
            { code: ACCOUNTS.SURGEON_FEE, name: 'Surgeon Fee', type: 'EXPENSE' },
            { code: ACCOUNTS.PURCHASE_RETURN, name: 'Purchase Return', type: 'EXPENSE' } // Contra-Expense
        ];

        const { Account } = require('./accounting.models'); // Import here to avoid circular dep if any, or strictly use Repo
        // Better use Repo, but for seeding direct model usage is often easier if Repo doesn't have createMany/upsert

        // We'll use a loop to findOrCreate
        const results = [];
        for (const seed of seeds) {
            const [account, created] = await Account.findOrCreate({
                where: { code: seed.code },
                defaults: seed
            });
            results.push(account);
        }
        return results;
    }

    async getProfitAndLoss(filters) {
        return await AccountingRepository.getProfitAndLoss(filters);
    }

    async getOverview() {
        return await AccountingRepository.getFinancialOverview();
    }
}

module.exports = new AccountingService();
