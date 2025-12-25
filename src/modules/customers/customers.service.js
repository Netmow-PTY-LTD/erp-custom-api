const CustomerRepository = require('./customers.repository');

class CustomerService {
    async getAllCustomers(filters = {}, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const result = await CustomerRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        } catch (err) {
            throw new Error(`Failed to get customers: ${err.message}`);
        }
    }

    async getCustomerById(id) {
        const customer = await CustomerRepository.findById(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }

    async createCustomer(data, userId) {
        // Check if email already exists
        if (data.email) {
            const existing = await CustomerRepository.findByEmail(data.email);
            if (existing) {
                throw new Error('Customer with this email already exists');
            }
        }

        return await CustomerRepository.create({ ...data, created_by: userId });
    }

    async updateCustomer(id, data) {
        // If email is being updated, check for duplicates
        if (data.email) {
            const existing = await CustomerRepository.findByEmail(data.email);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error('Customer with this email already exists');
            }
        }

        const customer = await CustomerRepository.update(id, data);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }

    async deleteCustomer(id) {
        const customer = await CustomerRepository.delete(id);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return customer;
    }

    async getCustomerLocations() {
        const customers = await CustomerRepository.findCustomersWithLocation();

        return {
            total: customers.length,
            locations: customers.map(customer => ({
                id: customer.id,
                name: customer.name,
                company: customer.company,
                address: customer.address,
                city: customer.city,
                phone: customer.phone,
                email: customer.email,
                coordinates: {
                    lat: parseFloat(customer.latitude),
                    lng: parseFloat(customer.longitude)
                }
            }))
        };
    }

    async getCustomerStats() {
        const stats = await CustomerRepository.getStats();

        // Format to match user request
        return [
            {
                label: "Active Customers",
                value: stats.activeCustomers,
                color: "bg-green-600"
            },
            {
                label: "Total Customers",
                value: stats.totalCustomers,
                color: "bg-blue-600"
            },
            {
                label: "Total Revenue",
                value: stats.totalRevenue.toLocaleString(),
                color: "bg-yellow-600"
            },
            {
                label: "New Customers",
                value: stats.newCustomers,
                color: "bg-purple-600"
            }
        ];
    }
}

module.exports = new CustomerService();
