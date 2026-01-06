const ProductionRepository = require('./production.repository');
const { ProductRepository } = require('../products/products.repository');

class ProductionService {
    // --- BOMs ---
    async getAllBOMs(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await ProductionRepository.findAllBOMs(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getBOMById(id) {
        const bom = await ProductionRepository.findBOMById(id);
        if (!bom) throw new Error('BOM not found');
        return bom;
    }

    async createBOM(data) {
        // Validation: verify product exists and is finished good
        const product = await ProductRepository.findById(data.product_id);
        if (!product) throw new Error('Product not found');
        if (product.product_type !== 'finished_good') {
            // throw new Error('BOM can only be created for finished goods');
            // Relaxing checking for now as we just introduced the field
        }

        return await ProductionRepository.createBOM(data, data.items);
    }

    async updateBOM(id, data) {
        return await ProductionRepository.updateBOM(id, data, data.items);
    }

    async deleteBOM(id) {
        return await ProductionRepository.deleteBOM(id);
    }

    // --- Production Runs ---
    async getAllRuns(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await ProductionRepository.findAllRuns(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getRunById(id) {
        const run = await ProductionRepository.findRunById(id);
        if (!run) throw new Error('Production run not found');
        return run;
    }

    async createRun(data, userId) {
        // Auto-generate run number
        const run_number = `RUN-${Date.now()}`;

        // Populate BOM id if not provided but product has one?
        // For simple implementation, require manual BOM selection or default to latest active BOM for product

        const runData = {
            ...data,
            run_number,
            created_by: userId,
            status: 'scheduled' // Default
        };

        return await ProductionRepository.createRun(runData);
    }

    async updateRun(id, data) {
        // Logic to handle status transitions (e.g. consuming stock when Completed) could go here
        return await ProductionRepository.updateRun(id, data);
    }

    async deleteRun(id) {
        return await ProductionRepository.deleteRun(id);
    }

    // --- Finished Goods (Proxy to Products) ---
    async getAllFinishedGoods(filters = {}, page = 1, limit = 10) {
        filters.product_type = 'finished_good';
        const offset = (page - 1) * limit;
        const result = await ProductRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async createFinishedGood(data) {
        data.product_type = 'finished_good';
        return await ProductRepository.create(data);
    }

    async getFinishedGoodById(id) {
        const product = await ProductRepository.findById(id);
        if (!product || product.product_type !== 'finished_good') {
            // throw new Error('Finished good not found');
        }
        return product;
    }

    async updateFinishedGood(id, data) {
        return await ProductRepository.update(id, data);
    }

    async deleteFinishedGood(id) {
        return await ProductRepository.delete(id);
    }
}

module.exports = new ProductionService();
