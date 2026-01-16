var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./core/database/sequelize');
const routes = require('./routes'); // your main API routes
const routesTree = require('./routes/routesTree'); // new routes-tree
require('dotenv').config();
const app = express();
// CORS configuration
const allowedOrigins = [
    'http://192.168.0.176:5000',
    'http://192.168.68.103:5000',
    'https://test1.miyn.app',
    'https://test3.miyn.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://erpinleadsit.netlify.app',
    'https://erp.inleadsit.com',
    'http://erp.inleadsit.com'
];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like curl, Postman)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));
app.use('/api', routes);
// Root endpoint
app.get('/', (req, res) => res.json({ ok: true, message: 'ERP API (modular)' }));
// --- DEBUG: View Environment Variables (REMOVE IN PRODUCTION) ---
app.get('/debug-env', (req, res) => {
    const envVars = {
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASSWORD: process.env.DB_PASSWORD, // Showing FULL password for debugging
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV
    };
    res.json(envVars);
});
// --- Public Route: Check Database Status ---
app.get('/check-db-status', (req, res) => __awaiter(this, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        yield sequelize.authenticate();
        res.json({
            status: 'success',
            message: 'Database connection is healthy.',
            config: {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME
            }
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed.',
            reason: error.message,
            error_details: {
                name: error.name,
                code: error.code || ((_a = error.parent) === null || _a === void 0 ? void 0 : _a.code),
                errno: error.errno || ((_b = error.parent) === null || _b === void 0 ? void 0 : _b.errno),
                syscall: error.syscall || ((_c = error.parent) === null || _c === void 0 ? void 0 : _c.syscall),
                hostname: error.address || ((_d = error.parent) === null || _d === void 0 ? void 0 : _d.address),
                port: error.port || ((_e = error.parent) === null || _e === void 0 ? void 0 : _e.port),
                fatal: error.fatal || ((_f = error.parent) === null || _f === void 0 ? void 0 : _f.fatal),
                original: error.original ? error.original.message : undefined
            }
        });
    }
}));
// ----------------------------------------------------------------
// Routes tree page
app.use('/routes-tree', routesTree);
// Architecture visualization page
app.get('/routes-architecture', (req, res) => {
    res.sendFile('architecture_view.html', { root: __dirname + '/..' });
});
// System graph visualization
app.get('/system-graph', (req, res) => {
    res.sendFile('system_graph.html', { root: __dirname + '/..' });
});
// Module documentation pages
app.get('/module-docs', (req, res) => {
    res.sendFile('module_docs/index.html', { root: __dirname + '/..' });
});
// Individual module documentation routes
app.get('/module-docs/auth', (req, res) => {
    res.sendFile('module_docs/auth_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/users', (req, res) => {
    res.sendFile('module_docs/users_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/roles', (req, res) => {
    res.sendFile('module_docs/roles_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/sales', (req, res) => {
    res.sendFile('module_docs/sales_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/purchase', (req, res) => {
    res.sendFile('module_docs/purchase_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/products', (req, res) => {
    res.sendFile('module_docs/products_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/customers', (req, res) => {
    res.sendFile('module_docs/customers_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/suppliers', (req, res) => {
    res.sendFile('module_docs/suppliers_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/accounting', (req, res) => {
    res.sendFile('module_docs/accounting_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/staff', (req, res) => {
    res.sendFile('module_docs/staff_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/departments', (req, res) => {
    res.sendFile('module_docs/departments_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/attendance', (req, res) => {
    res.sendFile('module_docs/attendance_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/leaves', (req, res) => {
    res.sendFile('module_docs/leaves_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/reports', (req, res) => {
    res.sendFile('module_docs/reports_module.html', { root: __dirname + '/..' });
});
app.get('/module-docs/settings', (req, res) => {
    res.sendFile('module_docs/settings_module.html', { root: __dirname + '/..' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ status: false, message: err.message || 'Server error' });
});
module.exports = app;
