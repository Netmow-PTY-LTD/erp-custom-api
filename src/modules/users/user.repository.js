const { User } = require('./user.model');
const { Role } = require('../roles/role.model');
const { Op } = require('sequelize');

class UserRepository {
  async findAll(filters = {}, limit = 10, offset = 0) {
    const where = {};

    if (filters.role_id) {
      where.role_id = filters.role_id;
    }

    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${filters.search}%` } },
        { email: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    return await User.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'name']
        }
      ],
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }

  async findById(id) {
    return await User.findByPk(id, {
      include: [{
        model: Role,
        as: 'role',
        attributes: ['id', 'name']
      }]
    });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update(data);
  }

  async delete(id) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }
}

module.exports = new UserRepository();
