const SupplierRepository = require('./suppliers.repository');

class SupplierService {
    async getAllSuppliers(filters = {}, page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const result = await SupplierRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        } catch (err) {
            throw new Error(`Failed to get suppliers: ${err.message}`);
        }
    }

    async getSupplierById(id) {
        const supplier = await SupplierRepository.findById(id);
        if (!supplier) {
            throw new Error('Supplier not found');
        }

        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;

        if (supplierData.latitude) {
            supplierData.latitude = parseFloat(supplierData.latitude);
        }
        if (supplierData.longitude) {
            supplierData.longitude = parseFloat(supplierData.longitude);
        }

        return supplierData;
    }

    async createSupplier(data, userId) {
        // Check if code already exists
        if (data.code) {
            const existing = await SupplierRepository.findByCode(data.code);
            if (existing) {
                throw new Error('Supplier with this code already exists');
            }
        }

        // Check if email already exists (if provided)
        if (data.email) {
            const existing = await SupplierRepository.findByEmail(data.email);
            if (existing) {
                throw new Error('Supplier with this email already exists');
            }
        }

        return await SupplierRepository.create({ ...data, created_by: userId });
    }

    async updateSupplier(id, data) {
        // If code is being updated, check for duplicates
        if (data.code) {
            const existing = await SupplierRepository.findByCode(data.code);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error('Supplier with this code already exists');
            }
        }

        // If email is being updated, check for duplicates
        if (data.email) {
            const existing = await SupplierRepository.findByEmail(data.email);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error('Supplier with this email already exists');
            }
        }

        const supplier = await SupplierRepository.update(id, data);
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return supplier;
    }

    async deleteSupplier(id) {
        const supplier = await SupplierRepository.delete(id);
        if (!supplier) {
            throw new Error('Supplier not found');
        }
        return supplier;
    }
}

module.exports = new SupplierService();
