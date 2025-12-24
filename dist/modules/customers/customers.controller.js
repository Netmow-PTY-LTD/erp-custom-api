var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const CustomerService = require('./customers.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class CustomerController {
    getAllCustomers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    customer_type: req.query.customer_type,
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield CustomerService.getAllCustomers(filters, page, limit);
                return successWithPagination(res, 'Customers retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getCustomerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield CustomerService.getCustomerById(req.params.id);
                return success(res, 'Customer retrieved successfully', customer);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield CustomerService.createCustomer(req.body, req.user.id);
                return success(res, 'Customer created successfully', customer, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield CustomerService.updateCustomer(req.params.id, req.body);
                return success(res, 'Customer updated successfully', customer);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield CustomerService.deleteCustomer(req.params.id);
                return success(res, null, 'Customer deleted successfully');
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    getCustomerLocations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield CustomerService.getCustomerLocations();
                return success(res, 'Customer locations retrieved successfully', locations);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
}
module.exports = new CustomerController();
