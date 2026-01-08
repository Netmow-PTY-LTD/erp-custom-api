const CustomerRepository = require('./customers.repository');

class CustomerService {
    // Helper method to transform customer data same as product
    _transformCustomer(customer) {
        const customerData = customer.toJSON ? customer.toJSON() : customer;

        const transformed = {
            ...customerData,
            thumb_url: customerData.image_url || null,
            // Ensure numeric fields are numbers
            credit_limit: customerData.credit_limit ? parseFloat(customerData.credit_limit) : 0,
            outstanding_balance: customerData.outstanding_balance ? parseFloat(customerData.outstanding_balance) : 0,
            latitude: customerData.latitude ? parseFloat(customerData.latitude) : null,
            longitude: customerData.longitude ? parseFloat(customerData.longitude) : null
        };

        // Remove image_url from response
        delete transformed.image_url;

        // Transform images array to gallery_items (array of URLs)
        if (customerData.images && Array.isArray(customerData.images)) {
            transformed.gallery_items = customerData.images.map(img => img.image_url);
            delete transformed.images;
        }

        return transformed;
    }

    async getAllCustomers(filters = {}, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const result = await CustomerRepository.findAll(filters, limit, offset);

            // Transform each customer
            const transformedData = result.rows.map(customer => this._transformCustomer(customer));

            return {
                data: transformedData,
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
        return this._transformCustomer(customer);
    }

    async createCustomer(data, userId) {
        // Check if email already exists
        if (data.email) {
            const existing = await CustomerRepository.findByEmail(data.email);
            if (existing) {
                throw new Error('Customer with this email already exists');
            }
        }

        const { thumb_url, gallery_items, ...customerData } = data;

        // Map thumb_url to image_url
        if (thumb_url && !customerData.image_url) {
            customerData.image_url = thumb_url;
        }

        // Map gallery_items (strings) to images (objects) for repository
        let images = [];
        if (gallery_items && Array.isArray(gallery_items) && gallery_items.length > 0) {
            images = gallery_items.map((url, index) => ({
                image_url: url,
                sort_order: index,
                is_primary: false
            }));
        }

        const customer = await CustomerRepository.create({ ...customerData, images, created_by: userId });
        return this._transformCustomer(customer);
    }

    async updateCustomer(id, data) {
        // If email is being updated, check for duplicates
        if (data.email) {
            const existing = await CustomerRepository.findByEmail(data.email);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error('Customer with this email already exists');
            }
        }

        const { thumb_url, gallery_items, ...customerData } = data;

        // Map thumb_url to image_url
        if (thumb_url && !customerData.image_url) {
            customerData.image_url = thumb_url;
        }

        // Map gallery_items if provided
        if (gallery_items && Array.isArray(gallery_items)) {
            customerData.images = gallery_items.map((url, index) => ({
                image_url: url,
                sort_order: index,
                is_primary: false
            }));
        }

        const customer = await CustomerRepository.update(id, customerData);
        if (!customer) {
            throw new Error('Customer not found');
        }
        return this._transformCustomer(customer);
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
