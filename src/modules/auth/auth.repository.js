const { User } = require('../users/user.model');
const { Role, RoleSettings } = require('../roles/role.model');
const { RoleMenu } = require('../roles/role_menu.model');
const { RoleDashboard } = require('../roles/role_dashboard.model');

exports.findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

exports.findByEmailWithRole = async (email) => {
  return User.findOne({
    where: { email },
    include: [
      {
        model: Role,
        as: 'role',
        include: [
          {
            model: RoleSettings,
            required: false
          }
        ]
      }
    ]
  });
};

exports.findById = async (id) => {
  return User.findByPk(id);
};

exports.findByIdWithRole = async (id) => {
  return User.findByPk(id, {
    include: [
      {
        model: Role,
        as: 'role',
        include: [
          {
            model: RoleSettings,
            required: false
          }
        ]
      }
    ]
  });
};

exports.create = async (data) => {
  return User.create(data);
};

exports.getRoleMenus = async () => {
  return RoleMenu.findAll({
    where: { is_active: true },
    order: [
      ['sort_order', 'ASC'],
      ['id', 'ASC']
    ]
  });
};

exports.getRoleDashboards = async () => {
  return RoleDashboard.findAll({
    where: { is_active: true },
    order: [['id', 'ASC']]
  });
};
