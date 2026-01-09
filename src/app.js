const express = require('express');
const cors = require('cors');



const { sequelize } = require('./core/database/sequelize');
const routes = require('./routes'); // your main API routes
const routesTree = require('./routes/routesTree'); // new routes-tree
require('dotenv').config();

// Load associations after models are defined
require('./core/database/associations');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://192.168.68.119:5000',
  'http://192.168.0.176:5000',
  'http://192.168.68.103:5000',
  'https://test1.miyn.app',
  'https://test3.miyn.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://erpinleadsit.netlify.app',
  'https://erp.inleadsit.com',
  'http://erp.inleadsit.com',
  'https://test.inleadsit.com',
  'https://consultant.inleadsit.com',
  'https://apiconsultant.inleadsit.com',
  'http://192.168.68.102:5000',
  'http://192.168.0.176:5000',
  'https://carwash.inleadsit.com',
  'https://lawfirm.inleadsit.com'
];


app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
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
    DB_SOCKET_PATH: process.env.DB_SOCKET_PATH, // Added for debugging socket issues
    DB_PASSWORD: process.env.DB_PASSWORD ? '****' : undefined, // Masked
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV
  };
  res.json(envVars);
});

// --- Public Route: Check Database Status ---
app.get('/check-db-status', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: 'success',
      message: 'Database connection is healthy.',
      config: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed.',
      reason: error.message,
      error_details: {
        name: error.name,
        code: error.code || error.parent?.code,
        errno: error.errno || error.parent?.errno,
        syscall: error.syscall || error.parent?.syscall,
        hostname: error.address || error.parent?.address,
        port: error.port || error.parent?.port,
        fatal: error.fatal || error.parent?.fatal,
        original: error.original ? error.original.message : undefined
      }
    });
  }
});
// ----------------------------------------------------------------

// --- Auto-Initialize Superadmin ---
app.use(async (req, res, next) => {
  try {
    // Only run this check occasionally or on specific paths if performance is a concern
    // For now, we'll do a quick check on start or lazily
    // Better yet, just run it once on server start (but app.js exports app, doesn't listen directly except in index.js)
    // Let's attach it to a specific request or just run it as a floating promise on valid requests?
    // Ideally, this should be in index.js, but user asked "when run server" and we are in app.js
    // We will add a self-invoking function here that runs once when the module is loaded?
    // No, `app.js` is imported by `index.js`.
    // Let's modify index.js or add a startup script.
    // User said: "ensure 1 superadmin user exist or create automatically"

    // We'll add a helper function and call it.
    const { Role, RoleSettings } = require('./modules/roles/role.model');
    const { User } = require('./modules/users/user.model');
    const bcrypt = require('bcrypt'); // Make sure bcrypt is available

    // Check/Create Role
    let superRole = await Role.findOne({ where: { name: 'Superadmin' } });
    if (!superRole) {
      superRole = await Role.create({
        name: 'Superadmin',
        display_name: 'Super Administrator',
        description: 'God mode access',
        status: 'active',
        permissions: ['*']
      });
      await RoleSettings.create({
        role_id: superRole.id,
        menu: JSON.stringify(['all']),
        dashboard: JSON.stringify(['all']),
        custom: JSON.stringify({ theme: 'system' })
      });
      console.log('✅ Auto-created Superadmin Role');
    }

    // Check/Create User
    const adminEmail = 'admin@gmail.com';
    let adminUser = await User.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role_id: superRole.id
      });
      console.log('✅ Auto-created Superadmin User: admin@gmail.com / password123');
    }
  } catch (err) {
    console.error('⚠️ Auto-Init Superadmin Failed:', err.message);
  }
  next();
});

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
