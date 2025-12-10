const { SalesRoute } = require('./sales.models');
const { Op } = require('sequelize');

class SalesRouteRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { description: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await SalesRoute.findAndCountAll({
            where,
            limit,
            offset,
            order: [['created_at', 'DESC']]
        });
    }

    async findById(id) {
        return await SalesRoute.findByPk(id);
    }

    async create(data) {
        return await SalesRoute.create(data);
    }

    async update(id, data) {
        const route = await SalesRoute.findByPk(id);
        if (!route) return null;
        return await route.update(data);
    }

    async delete(id) {
        const route = await SalesRoute.findByPk(id);
        if (!route) return null;
        await route.destroy();
        return route;
    }
}

module.exports = new SalesRouteRepository();
