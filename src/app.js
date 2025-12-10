const express = require('express');
const cors = require('cors');



const routes = require('./routes'); // your main API routes
const routesTree = require('./routes/routesTree'); // new routes-tree
require('dotenv').config();

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://test1.miyn.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://erpinleadsit.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
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
