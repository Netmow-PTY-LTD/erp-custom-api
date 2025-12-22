// role.repository.js (Sequelize-backed)
const { Role, RoleSettings } = require('./role.model');

const parseSettings = (settingsRow) => {
  if (!settingsRow) return {};
  const menu = settingsRow.menu ? JSON.parse(settingsRow.menu) : [];
  const dashboard = settingsRow.dashboard ? JSON.parse(settingsRow.dashboard) : [];
  const custom = settingsRow.custom ? JSON.parse(settingsRow.custom) : {};
  return { menu, dashboard, custom };
};

exports.create = async (data) => {
  const createdRole = await Role.create({
    name: data.role || data.name,
    display_name: data.display_name,
    description: data.description,
    status: data.status || 'active',
    permissions: data.permissions || []
  });
  await RoleSettings.create({
    role_id: createdRole.id,
    menu: JSON.stringify(data.menu || []),
    dashboard: JSON.stringify(data.dashboard || []),
    custom: JSON.stringify(data.custom || {}),
  });

  const settings = await RoleSettings.findOne({ where: { role_id: createdRole.id } });
  return {
    id: createdRole.id,
    role: createdRole.name,
    display_name: createdRole.display_name,
    description: createdRole.description,
    status: createdRole.status,
    permissions: createdRole.permissions,
    settings: parseSettings(settings)
  };
};

exports.findById = async (id) => {
  const role = await Role.findByPk(id, { include: [RoleSettings] });
  if (!role) return null;
  const plain = role.get({ plain: true });
  const settingsRow = plain.RoleSetting || plain.RoleSettings || plain.role_setting || plain.roleSettings;
  return {
    id: plain.id,
    role: plain.name,
    display_name: plain.display_name,
    description: plain.description,
    status: plain.status,
    permissions: role.permissions, // use the getter
    settings: parseSettings(settingsRow)
  };
};

exports.findAll = async (page, limit) => {
  if (page && limit) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Role.findAndCountAll({
      include: [RoleSettings],
      order: [['id', 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });
    const mapped = rows.map(r => {
      const p = r.get({ plain: true });
      const settingsRow = p.RoleSetting || p.RoleSettings || p.role_setting || p.roleSettings;
      return {
        id: p.id,
        role: p.name,
        display_name: p.display_name,
        description: p.description,
        status: p.status,
        permissions: r.permissions, // use the getter from the instance
        settings: parseSettings(settingsRow)
      };
    });
    return { rows: mapped, total: count };
  }

  const rows = await Role.findAll({ include: [RoleSettings], order: [['id', 'DESC']] });
  const mapped = rows.map(r => {
    const p = r.get({ plain: true });
    const settingsRow = p.RoleSetting || p.RoleSettings || p.role_setting || p.roleSettings;
    return {
      id: p.id,
      role: p.name,
      display_name: p.display_name,
      description: p.description,
      status: p.status,
      permissions: r.permissions, // use getter
      settings: parseSettings(settingsRow)
    };
  });
  return { rows: mapped, total: mapped.length };
};

exports.update = async (id, data) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  if (data.role || data.name) await role.update({ name: data.role || data.name });
  if (data.display_name !== undefined) await role.update({ display_name: data.display_name });
  if (data.description !== undefined) await role.update({ description: data.description });
  if (data.status !== undefined) await role.update({ status: data.status });
  if (data.permissions !== undefined) await role.update({ permissions: data.permissions });

  if (data.menu || data.dashboard || data.custom) {
    const settings = await RoleSettings.findOne({ where: { role_id: id } });
    const payload = {
      menu: JSON.stringify(data.menu || []),
      dashboard: JSON.stringify(data.dashboard || []),
      custom: JSON.stringify(data.custom || {}),
    };
    if (settings) {
      await settings.update(payload);
    } else {
      await RoleSettings.create({ role_id: id, ...payload });
    }
  }

  return exports.findById(id);
};

exports.delete = async (id) => {
  await Role.destroy({ where: { id } });
};

// Backwards-compatible alias
exports.remove = exports.delete;

// Backwards-compatible alias
exports.remove = exports.delete;
