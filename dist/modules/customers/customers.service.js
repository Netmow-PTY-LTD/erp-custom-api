var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CustomerRepository = require('./customers.repository');
class CustomerService {
    getAllCustomers() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            try {
                const offset = (page - 1) * limit;
                const result = yield CustomerRepository.findAll(filters, limit, offset);
                return {
                    data: result.rows,
                    total: result.count
                };
            }
            catch (err) {
                throw new Error(`Failed to get customers: ${err.message}`);
            }
        });
    }
    getCustomerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield CustomerRepository.findById(id);
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        });
    }
    createCustomer(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if email already exists
            if (data.email) {
                const existing = yield CustomerRepository.findByEmail(data.email);
                if (existing) {
                    throw new Error('Customer with this email already exists');
                }
            }
            return yield CustomerRepository.create(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    updateCustomer(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // If email is being updated, check for duplicates
            if (data.email) {
                const existing = yield CustomerRepository.findByEmail(data.email);
                if (existing && existing.id !== parseInt(id)) {
                    throw new Error('Customer with this email already exists');
                }
            }
            const customer = yield CustomerRepository.update(id, data);
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        });
    }
    deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = yield CustomerRepository.delete(id);
            if (!customer) {
                throw new Error('Customer not found');
            }
            return customer;
        });
    }
    getCustomerLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            const customers = yield CustomerRepository.findCustomersWithLocation();
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
        });
    }
}
module.exports = new CustomerService();
