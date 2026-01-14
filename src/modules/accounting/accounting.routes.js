const express = require('express');
const router = express.Router();
const accountingController = require('./accounting.controller');
const { verifyToken } = require('../../core/middleware/auth');
const { moduleCheck } = require('../../core/middleware/moduleCheck');
const { handlerWithFields } = require('../../core/utils/zodTypeView');
const validate = require('../../core/middleware/validate');
const { createAccount, updateAccount } = require('./accounting.validation');

// Module name for routes-tree grouping
router.moduleName = 'Accounting';

router.use(verifyToken);
router.use(moduleCheck('accounting'));

// Define routes metadata
router.routesMeta = [
    // --- Transactions (Entry Point) ---
    {
        path: '/transactions',
        method: 'POST',
        middlewares: [],
        handler: (req, res) => accountingController.createTransaction(req, res),
        description: 'Create a new accounting transaction (Single Entry -> Auto Journal)',
        database: {
            tables: ['transactions', 'journals', 'journal_lines'],
            mainTable: 'transactions',
            fields: {
                transactions: ['id', 'type', 'amount', 'payment_mode', 'date', 'description'],
                journals: ['id', 'reference_id', 'narration'],
                journal_lines: ['account_id', 'debit', 'credit']
            },
            relationships: ['transactions.id -> journals.reference_id (One-to-One)', 'journals.id -> journal_lines.journal_id (One-to-Many)']
        },
        examples: [
            {
                title: 'Create Cash Sale',
                description: 'Record a cash sale transaction which automatically creates journal entries',
                url: '/api/accounting/transactions',
                method: 'POST',
                request: {
                    type: 'SALES',
                    amount: 10000,
                    payment_mode: 'CASH',
                    date: '2026-01-14',
                    description: 'Sales Invoice #123'
                },
                response: {
                    status: true,
                    message: 'Transaction posted and journalized successfully',
                    data: {
                        transaction: { id: 1, type: 'SALES', amount: 10000 },
                        journal: { id: 5, narration: 'Sales Invoice #123' }
                    }
                }
            }
        ]
    },
    {
        path: '/transactions',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getTransactions(req, res),
        description: 'Get list of Transactions with pagination',
        database: {
            tables: ['transactions'],
            fields: {
                transactions: ['id', 'type', 'amount', 'date', 'description', 'payment_mode']
            }
        },
        queryParams: {
            page: 'Page number (default 1)',
            limit: 'Items per page (default 20)',
            from: 'Start Date',
            to: 'End Date',
            type: 'Transaction Type Filter'
        },
        examples: [
            {
                title: 'List Transactions',
                description: 'Get paginated list of past transactions',
                url: '/api/accounting/transactions?page=1&limit=10',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Transactions retrieved successfully',
                    processed: {
                        currentPage: 1,
                        totalPages: 5,
                        totalItems: 50,
                        itemsPerPage: 10
                    },
                    data: [
                        { id: 10, type: 'SALES', amount: 500 }
                    ]
                }
            }
        ]
    },

    // --- Reports ---
    {
        path: '/reports/journal',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getJournalReport(req, res),
        description: 'Get Journal Report with filtering',
        database: {
            tables: ['journals', 'journal_lines', 'accounts'],
            mainTable: 'journals',
            fields: {
                journals: ['date', 'narration'],
                journal_lines: ['debit', 'credit'],
                accounts: ['code', 'name']
            },
            relationships: ['journals.id -> journal_lines.journal_id', 'journal_lines.account_id -> accounts.id']
        },
        queryParams: {
            from: 'Start Date (YYYY-MM-DD)',
            to: 'End Date (YYYY-MM-DD)'
        },
        examples: [
            {
                title: 'Get Journal Report',
                description: 'Retrieve journal entries within a date range',
                url: '/api/accounting/reports/journal?from=2026-01-01&to=2026-01-31',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Journal report retrieved successfully',
                    data: [
                        {
                            id: 1,
                            date: '2026-01-14',
                            entries: [
                                { account: { code: '1000', name: 'Cash' }, debit: 10000, credit: 0 },
                                { account: { code: '4000', name: 'Sales' }, debit: 0, credit: 10000 }
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
        path: '/reports/ledger/:id',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getLedgerReport(req, res),
        description: 'Get Ledger Report for a specific Account',
        database: {
            tables: ['accounts', 'journal_lines', 'journals'],
            mainTable: 'journal_lines',
            fields: {
                journal_lines: ['debit', 'credit'],
                journals: ['date', 'narration']
            }
        },
        queryParams: {
            from: 'Start Date',
            to: 'End Date'
        },
        examples: [
            {
                title: 'Get Cash Ledger',
                description: 'View running balance history for Cash Account (ID: 1)',
                url: '/api/accounting/reports/ledger/1?from=2026-01-01&to=2026-01-31',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Ledger report retrieved successfully',
                    data: {
                        account: '1',
                        opening_balance: 0,
                        closing_balance: 10000,
                        transactions: [
                            { date: '2026-01-14', debit: 10000, credit: 0, balance: 10000, narration: 'Sales' }
                        ]
                    }
                }
            }
        ]
    },
    {
        path: '/reports/trial-balance',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getTrialBalance(req, res),
        description: 'Get Trial Balance Summary',
        database: {
            tables: ['accounts', 'journal_lines'],
            mainTable: 'accounts',
            fields: {
                accounts: ['code', 'name', 'type'],
                journal_lines: ['debit', 'credit']
            },
            sideEffects: ['Aggregates all debits and credits per account']
        },
        queryParams: {
            date: 'As of Date (YYYY-MM-DD)'
        },
        examples: [
            {
                title: 'Get Trial Balance',
                description: 'Check if total Debits equal total Credits',
                url: '/api/accounting/reports/trial-balance?date=2026-01-31',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Trial Balance retrieved successfully',
                    data: {
                        trial_balance: [
                            { code: '1000', account: 'Cash', debit: 15000, credit: 0 },
                            { code: '4000', account: 'Sales', debit: 0, credit: 15000 }
                        ],
                        total_debit: 15000,
                        total_credit: 15000,
                        status: 'BALANCED'
                    }
                }
            }
        ]
    },
    {
        path: '/reports/profit-and-loss',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getProfitAndLoss(req, res),
        description: 'Get Profit and Loss Statement',
        database: {
            tables: ['accounts', 'journal_lines'],
            mainTable: 'accounts',
            fields: {
                accounts: ['code', 'name', 'type'],
                journal_lines: ['debit', 'credit']
            },
            sideEffects: ['Aggregates Income and Expense accounts']
        },
        queryParams: {
            from: 'Start Date (YYYY-MM-DD)',
            to: 'End Date (YYYY-MM-DD)'
        },
        examples: [
            {
                title: 'Get P&L',
                description: 'View Income vs Expense statement',
                url: '/api/accounting/reports/profit-and-loss?from=2026-01-01&to=2026-01-31',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Profit and Loss report retrieved successfully',
                    data: {
                        income: [{ code: '4000', name: 'Sales', amount: 50000 }],
                        expense: [{ code: '5000', name: 'Purchase', amount: 20000 }],
                        total_income: 50000,
                        total_expense: 20000,
                        net_profit: 30000
                    }
                }
            }
        ]
    },
    {
        path: '/overview',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getOverview(req, res),
        description: 'Get Financial Overview (Income vs Expense)',
        database: {
            tables: ['accounts', 'journal_lines'],
            sideEffects: ['Sums Income and Expense account balances']
        },
        examples: [
            {
                title: 'Get Financial Dashboard',
                description: 'Quick stats for dashboard',
                url: '/api/accounting/overview',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Financial overview retrieved successfully',
                    data: {
                        total_income: 50000,
                        total_expense: 20000,
                        net_profit: 30000
                    }
                }
            }
        ]
    },

    // --- Master Data ---
    {
        path: '/accounts',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => accountingController.getAccounts(req, res),
        description: 'Get Chart of Accounts',
        database: {
            tables: ['accounts'],
            mainTable: 'accounts',
            fields: {
                accounts: ['id', 'code', 'name', 'type', 'parent_id']
            }
        },
        examples: [
            {
                title: 'List Accounts',
                description: 'Get all available accounts for dropdowns',
                url: '/api/accounting/accounts',
                method: 'GET',
                response: {
                    status: true,
                    message: 'Chart of Accounts retrieved successfully',
                    data: [
                        { id: 1, code: '1000', name: 'Cash', type: 'ASSET' },
                        { id: 2, code: '4000', name: 'Sales', type: 'INCOME' }
                    ]
                }
            }
        ]
    },
    {
        path: '/accounts',
        method: 'POST',
        middlewares: [validate(createAccount)],
        handler: handlerWithFields((req, res) => accountingController.createAccount(req, res), createAccount),
        description: 'Create a new Account (Sub-account or Root)',
        database: {
            tables: ['accounts'],
            requiredFields: ['code', 'name', 'type'],
            optionalFields: ['parent_id', 'description']
        },
        examples: [
            {
                title: 'Create Sub-Account',
                description: 'Create "Office Rent" as a sub-account of "Office Expense" (ID 100)',
                url: '/api/accounting/accounts',
                method: 'POST',
                request: {
                    code: '5201',
                    name: 'Rent Expense',
                    type: 'EXPENSE',
                    parent_id: 100
                },
                response: {
                    status: true,
                    message: 'Account created successfully'
                }
            }
        ]
    },
    {
        path: '/accounts/:id',
        method: 'PUT',
        middlewares: [validate(updateAccount)],
        handler: handlerWithFields((req, res) => accountingController.updateAccount(req, res), updateAccount),
        description: 'Update Account details',
        database: {
            tables: ['accounts'],
            updatableFields: ['name', 'parent_id', 'type', 'description']
        },
        examples: [
            {
                title: 'Update Parent ID',
                description: 'Move an account under a new parent',
                url: '/api/accounting/accounts/5',
                method: 'PUT',
                request: {
                    parent_id: 102
                },
                response: {
                    status: true,
                    message: 'Account updated successfully'
                }
            }
        ]
    },
    {
        path: '/accounts/:id',
        method: 'DELETE',
        middlewares: [],
        handler: (req, res) => accountingController.deleteAccount(req, res),
        description: 'Delete an Account',
        database: {
            tables: ['accounts'],
            sideEffects: ['Deletes the account. Ensure no transactions exist first.']
        },
        examples: [
            {
                title: 'Delete Account',
                description: 'Remove an unused account',
                url: '/api/accounting/accounts/10',
                method: 'DELETE',
                response: {
                    status: true,
                    message: 'Account deleted successfully'
                }
            }
        ]
    },
    {
        path: '/accounts/seed',
        method: 'POST',
        middlewares: [],
        handler: (req, res) => accountingController.seedAccounts(req, res),
        description: 'Seed default Chart of Accounts',
        database: {
            tables: ['accounts'],
            sideEffects: ['Inserts default accounts if missing']
        },
        examples: [
            {
                title: 'Seed Accounts',
                description: 'Initialize the system with default accounts',
                url: '/api/accounting/accounts/seed',
                method: 'POST',
                response: {
                    status: true,
                    message: 'Accounts seeded successfully'
                }
            }
        ]
    }
];

// Register routes
router.routesMeta.forEach(r => {
    router[r.method.toLowerCase()](r.path, ...r.middlewares, r.handler);
});

module.exports = router;
