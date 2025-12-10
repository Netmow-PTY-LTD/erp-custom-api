/**
 * Seed Script for ERP System
 * Run this to populate the database with test data
 */

const { sequelize } = require('../src/core/database/sequelize');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        // 1. Seed Categories
        console.log('📦 Seeding categories...');
        await sequelize.query(`
      INSERT INTO categories (name, description, created_at) VALUES
      ('Electronics', 'Electronic devices and accessories', NOW()),
      ('Office Supplies', 'Office and stationery items', NOW()),
      ('Furniture', 'Office and home furniture', NOW()),
      ('Software', 'Software licenses and subscriptions', NOW()),
      ('Hardware', 'Computer hardware and peripherals', NOW())
      ON DUPLICATE KEY UPDATE name=name;
    `);
        console.log('✅ Categories seeded\n');

        // 2. Seed Units
        console.log('📏 Seeding units...');
        await sequelize.query(`
      INSERT INTO units (name, symbol, is_active, created_at, updated_at) VALUES
      ('Piece', 'pcs', 1, NOW(), NOW()),
      ('Box', 'box', 1, NOW(), NOW()),
      ('Kilogram', 'kg', 1, NOW(), NOW()),
      ('Liter', 'L', 1, NOW(), NOW()),
      ('Meter', 'm', 1, NOW(), NOW()),
      ('Set', 'set', 1, NOW(), NOW()),
      ('Dozen', 'doz', 1, NOW(), NOW()),
      ('Pack', 'pack', 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE name=name;
    `);
        console.log('✅ Units seeded\n');

        // 3. Seed Suppliers
        console.log('🏭 Seeding suppliers...');
        await sequelize.query(`
      INSERT INTO suppliers (name, contact_person, email, phone, address, city, country, is_active, created_at) VALUES
      ('Tech Supplies Inc', 'John Smith', 'john@techsupplies.com', '+1234567890', '123 Tech Street', 'New York', 'USA', 1, NOW()),
      ('Office Depot Ltd', 'Jane Doe', 'jane@officedepot.com', '+1234567891', '456 Office Ave', 'London', 'UK', 1, NOW()),
      ('Global Hardware Co', 'Bob Wilson', 'bob@globalhw.com', '+1234567892', '789 Hardware Blvd', 'Tokyo', 'Japan', 1, NOW()),
      ('Software Solutions', 'Alice Brown', 'alice@softwaresol.com', '+1234567893', '321 Code Lane', 'Berlin', 'Germany', 1, NOW()),
      ('Furniture World', 'Charlie Davis', 'charlie@furnitureworld.com', '+1234567894', '654 Design St', 'Paris', 'France', 1, NOW())
      ON DUPLICATE KEY UPDATE name=name;
    `);
        console.log('✅ Suppliers seeded\n');

        // 4. Seed Customers
        console.log('👥 Seeding customers...');
        await sequelize.query(`
      INSERT INTO customers (name, email, phone, company, address, city, country, customer_type, is_active, created_at) VALUES
      ('ABC Corporation', 'contact@abc.com', '+1111111111', 'ABC Corp', '100 Business St', 'New York', 'USA', 'business', 1, NOW()),
      ('XYZ Enterprises', 'info@xyz.com', '+2222222222', 'XYZ Ltd', '200 Commerce Ave', 'London', 'UK', 'business', 1, NOW()),
      ('John Individual', 'john.ind@email.com', '+3333333333', NULL, '300 Home St', 'Chicago', 'USA', 'individual', 1, NOW()),
      ('Tech Startup Inc', 'hello@techstartup.com', '+4444444444', 'Tech Startup', '400 Innovation Blvd', 'San Francisco', 'USA', 'business', 1, NOW()),
      ('Jane Smith', 'jane.smith@email.com', '+5555555555', NULL, '500 Residential Rd', 'Boston', 'USA', 'individual', 1, NOW())
      ON DUPLICATE KEY UPDATE name=name;
    `);
        console.log('✅ Customers seeded\n');

        // 5. Seed Departments
        console.log('🏢 Seeding departments...');
        await sequelize.query(`
      INSERT INTO departments (name, description, created_at) VALUES
      ('Sales', 'Sales and customer relations', NOW()),
      ('IT', 'Information Technology', NOW()),
      ('HR', 'Human Resources', NOW()),
      ('Finance', 'Finance and Accounting', NOW()),
      ('Operations', 'Operations and Logistics', NOW())
      ON DUPLICATE KEY UPDATE name=name;
    `);
        console.log('✅ Departments seeded\n');

        // 6. Seed Staff
        console.log('👔 Seeding staff...');
        await sequelize.query(`
      INSERT INTO staffs (first_name, last_name, email, phone, position, department, hire_date, salary, status, created_at, updated_at) VALUES
      ('Michael', 'Johnson', 'michael.j@company.com', '+6666666666', 'Sales Manager', 'Sales', '2023-01-15', 5000.00, 'active', NOW(), NOW()),
      ('Sarah', 'Williams', 'sarah.w@company.com', '+7777777777', 'IT Specialist', 'IT', '2023-02-20', 4500.00, 'active', NOW(), NOW()),
      ('David', 'Brown', 'david.b@company.com', '+8888888888', 'HR Manager', 'HR', '2023-03-10', 4800.00, 'active', NOW(), NOW()),
      ('Emily', 'Davis', 'emily.d@company.com', '+9999999999', 'Accountant', 'Finance', '2023-04-05', 4200.00, 'active', NOW(), NOW()),
      ('James', 'Miller', 'james.m@company.com', '+1010101010', 'Operations Lead', 'Operations', '2023-05-12', 4600.00, 'active', NOW(), NOW())
      ON DUPLICATE KEY UPDATE email=email;
    `);
        console.log('✅ Staff seeded\n');

        // 7. Seed Products
        console.log('🛍️ Seeding products...');
        await sequelize.query(`
      INSERT INTO products (name, sku, description, category_id, unit_id, price, cost, stock_quantity, min_stock_level, is_active, created_at, updated_at) VALUES
      ('Laptop Dell XPS 15', 'LAPTOP-001', 'High-performance laptop', 1, 1, 1500.00, 1000.00, 50, 10, 1, NOW(), NOW()),
      ('Wireless Mouse', 'MOUSE-001', 'Ergonomic wireless mouse', 1, 1, 25.00, 15.00, 200, 50, 1, NOW(), NOW()),
      ('Office Chair', 'CHAIR-001', 'Comfortable office chair', 3, 1, 250.00, 150.00, 30, 5, 1, NOW(), NOW()),
      ('A4 Paper Box', 'PAPER-001', 'Box of 500 sheets A4 paper', 2, 2, 20.00, 12.00, 100, 20, 1, NOW(), NOW()),
      ('USB Cable', 'CABLE-001', 'USB-C to USB-A cable', 5, 1, 10.00, 5.00, 300, 100, 1, NOW(), NOW()),
      ('Monitor 27 inch', 'MONITOR-001', '27 inch 4K monitor', 1, 1, 400.00, 250.00, 40, 10, 1, NOW(), NOW()),
      ('Keyboard Mechanical', 'KEYBOARD-001', 'RGB mechanical keyboard', 1, 1, 120.00, 70.00, 80, 20, 1, NOW(), NOW()),
      ('Desk Lamp', 'LAMP-001', 'LED desk lamp', 3, 1, 35.00, 20.00, 60, 15, 1, NOW(), NOW()),
      ('Notebook Set', 'NOTEBOOK-001', 'Set of 5 notebooks', 2, 6, 15.00, 8.00, 150, 30, 1, NOW(), NOW()),
      ('Pen Box', 'PEN-001', 'Box of 12 pens', 2, 2, 8.00, 4.00, 200, 50, 1, NOW(), NOW())
      ON DUPLICATE KEY UPDATE sku=sku;
    `);
        console.log('✅ Products seeded\n');

        // 8. Seed Roles
        console.log('🔐 Seeding roles...');
        await sequelize.query(`
      INSERT INTO roles (name, created_at) VALUES
      ('Admin', NOW()),
      ('Manager', NOW()),
      ('Staff', NOW()),
      ('Viewer', NOW())
      ON DUPLICATE KEY UPDATE name=name;
    `);
        console.log('✅ Roles seeded\n');

        // 9. Seed Users
        console.log('👤 Seeding users...');
        // Password is 'password123' hashed with bcrypt
        const hashedPassword = '$2b$10$rKJ5qKcVxQ5kqX5qKcVxQeYqKcVxQ5kqX5qKcVxQ5kqX5qKcVxQ5u';
        await sequelize.query(`
      INSERT INTO users (name, email, password, role_id, created_at) VALUES
      ('Admin User', 'admin@erp.com', '${hashedPassword}', 1, NOW()),
      ('Manager User', 'manager@erp.com', '${hashedPassword}', 2, NOW()),
      ('Staff User', 'staff@erp.com', '${hashedPassword}', 3, NOW())
      ON DUPLICATE KEY UPDATE email=email;
    `);
        console.log('✅ Users seeded\n');

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log('   - 5 Categories');
        console.log('   - 8 Units');
        console.log('   - 5 Suppliers');
        console.log('   - 5 Customers');
        console.log('   - 5 Departments');
        console.log('   - 5 Staff members');
        console.log('   - 10 Products');
        console.log('   - 4 Roles');
        console.log('   - 3 Users');
        console.log('\n💡 You can now test all API endpoints with this data!');
        console.log('🔑 Login credentials:');
        console.log('   Email: admin@erp.com');
        console.log('   Password: password123\n');

    } catch (error) {
        console.error('❌ Error seeding database:', error.message);
        throw error;
    } finally {
        await sequelize.close();
    }
}

// Run the seeder
seedDatabase()
    .then(() => {
        console.log('✅ Seeder completed');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Seeder failed:', error);
        process.exit(1);
    });
