const { Supplier } = require('./suppliers.model');
const { Op } = require('sequelize');

class SupplierRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { email: { [Op.like]: `%${filters.search}%` } },
                { contact_person: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Supplier.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await Supplier.findByPk(id);
    }

    async findByEmail(email) {
        return await Supplier.findOne({ where: { email } });
    }

    async create(data) {
        return await Supplier.create(data);
    }

    async update(id, data) {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) return null;
        return await supplier.update(data);
    }

    async delete(id) {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) return null;
        await supplier.destroy();
        return supplier;
    }

    async findSuppliersWithLocation() {
        return await Supplier.findAll({
            where: {
                latitude: { [Op.ne]: null },
                longitude: { [Op.ne]: null },
                is_active: true
            },
            attributes: ['id', 'name', 'contact_person', 'address', 'city', 'latitude', 'longitude', 'phone', 'email']
        });
    }
}

module.exports = new SupplierRepository();
