var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const PurchaseService = require('./purchase.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class PurchaseController {
    // Purchase Orders
    getPurchaseOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    status: req.query.status,
                    supplier_id: req.query.supplier_id,
                    search: req.query.search
                };
                const result = yield PurchaseService.getAllPurchaseOrders(filters, page, limit);
                return successWithPagination(res, 'Purchase orders retrieved successfully', result.data, {
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
    getPurchaseOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const po = yield PurchaseService.getPurchaseOrderById(req.params.id);
                return success(res, 'Purchase order retrieved successfully', po);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createPurchaseOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const po = yield PurchaseService.createPurchaseOrder(req.body, req.user.id);
                return success(res, 'Purchase order created successfully', po, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updatePurchaseOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const po = yield PurchaseService.updatePurchaseOrder(req.params.id, req.body);
                return success(res, 'Purchase order updated successfully', po);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deletePurchaseOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield PurchaseService.deletePurchaseOrder(req.params.id);
                return success(res, 'Purchase order deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    // Purchase Invoices
    getAllPurchaseInvoices(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    status: req.query.status,
                    supplier_id: req.query.supplier_id,
                    search: req.query.search,
                    id: req.query.id
                };
                const result = yield PurchaseService.getAllPurchaseInvoices(filters, page, limit);
                return successWithPagination(res, 'Purchase invoices retrieved successfully', result.data, {
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
    getPurchaseInvoiceById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = yield PurchaseService.getPurchaseInvoiceById(req.params.id);
                return success(res, 'Purchase invoice retrieved successfully', invoice);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createPurchaseInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = yield PurchaseService.createPurchaseInvoice(req.body, req.user.id);
                return success(res, 'Purchase invoice created successfully', invoice, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updatePurchaseInvoice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const invoice = yield PurchaseService.updatePurchaseInvoice(req.params.id, req.body);
                return success(res, 'Purchase invoice updated successfully', invoice);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // Purchase Payments
    getAllPurchasePayments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    purchase_order_id: req.query.purchase_order_id,
                    payment_method: req.query.payment_method,
                    search: req.query.search
                };
                const result = yield PurchaseService.getAllPurchasePayments(filters, page, limit);
                return successWithPagination(res, 'Purchase payments retrieved successfully', result.data, {
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
    getPurchasePaymentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield PurchaseService.getPurchasePaymentById(req.params.id);
                return success(res, 'Purchase payment retrieved successfully', payment);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createPurchasePayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield PurchaseService.createPurchasePayment(req.body, req.user.id);
                return success(res, 'Purchase payment recorded successfully', payment, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // Purchase Receipts
    createPurchaseReceipt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const receipt = yield PurchaseService.createPurchaseReceipt(req.params.id, req.body, req.user.id);
                return success(res, 'Purchase receipt recorded successfully', receipt, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    // Map Locations
    getPurchaseOrderLocations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield PurchaseService.getPurchaseOrderLocations();
                return success(res, 'Purchase order locations retrieved successfully', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
}
module.exports = new PurchaseController();
