HMS Modular Backend (MySQL + JavaScript + Zod)

Quick start:
1. copy .env.example to .env and fill DB values
2. npm install
3. run migrations/schema.sql in MySQL to create tables
4. start server: npm run dev

Notes:
- All list endpoints support pagination via query params: ?page=1&limit=10
- Validation uses Zod. Validation middleware parses and returns structured errors.
- Routes auto-load modules placed under src/modules/*

Included modules:
- auth (POST /api/auth/login)
- roles (GET /api/role/list, POST /api/role/add, ...)
- users (GET /api/user/list, POST /api/user/add, ...)
- lab/cbc (POST /api/cbc, GET /api/cbc, GET /api/cbc/:id)




3️⃣ Protect Routes by Role

Example for your Users API:

const auth = require('../../core/middleware/auth');
const role = require('../../core/middleware/role');

// Only admins (role_id = 1) can create users
router.post('/add', auth, role([1]), validate(createSchema), handlerWithFields(controller.create, createSchema));

// Admins and managers (role_id = 1,2) can update users
router.put('/update/:id', auth, role([1, 2]), validate(updateSchema), handlerWithFields(controller.update, updateSchema));

// All authenticated users can view
router.get('/list', auth, controller.list);
router.get('/get/:id', auth, controller.get);


You can replace role_id with a role name string if you prefer (role: 'Admin').


4️⃣ Dynamic Role Permissions (Optional)

If you want per-route permissions stored in DB:

roles table: id, name

role_permissions table: role_id, module, action

Then your middleware can check the requested module/action against DB.

// role middleware example
const hasPermission = await checkPermission(user.role_id, req.moduleName, req.method);
if (!hasPermission) return res.status(403).json({ status: false, message: 'Forbidden' });


This is useful if you want menu settings and API permissions to match dynamically.