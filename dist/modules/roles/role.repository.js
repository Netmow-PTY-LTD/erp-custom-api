var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// role.repository.js (Sequelize-backed)
const { Role, RoleSettings } = require('./role.model');
const parseSettings = (settingsRow) => {
    if (!settingsRow)
        return {};
    const menu = settingsRow.menu ? JSON.parse(settingsRow.menu) : [];
    const dashboard = settingsRow.dashboard ? JSON.parse(settingsRow.dashboard) : [];
    const custom = settingsRow.custom ? JSON.parse(settingsRow.custom) : {};
    return { menu, dashboard, custom };
};
exports.create = (data) => __awaiter(this, void 0, void 0, function* () {
    const createdRole = yield Role.create({
        name: data.role || data.name,
        display_name: data.display_name,
        description: data.description,
        status: data.status || 'active',
        permissions: data.permissions || []
    });
    yield RoleSettings.create({
        role_id: createdRole.id,
        menu: JSON.stringify(data.menu || []),
        dashboard: JSON.stringify(data.dashboard || []),
        custom: JSON.stringify(data.custom || {}),
    });
    const settings = yield RoleSettings.findOne({ where: { role_id: createdRole.id } });
    return {
        id: createdRole.id,
        role: createdRole.name,
        display_name: createdRole.display_name,
        description: createdRole.description,
        status: createdRole.status,
        permissions: createdRole.permissions,
        settings: parseSettings(settings)
    };
});
exports.findById = (id) => __awaiter(this, void 0, void 0, function* () {
    const role = yield Role.findByPk(id, { include: [RoleSettings] });
    if (!role)
        return null;
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
});
exports.findAll = (page, limit) => __awaiter(this, void 0, void 0, function* () {
    if (page && limit) {
        const offset = (page - 1) * limit;
        const { rows, count } = yield Role.findAndCountAll({
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
    const rows = yield Role.findAll({ include: [RoleSettings], order: [['id', 'DESC']] });
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
});
exports.update = (id, data) => __awaiter(this, void 0, void 0, function* () {
    const role = yield Role.findByPk(id);
    if (!role)
        return null;
    const roleUpdatePayload = {};
    if (data.role || data.name)
        roleUpdatePayload.name = data.role || data.name;
    if (data.display_name !== undefined)
        roleUpdatePayload.display_name = data.display_name;
    if (data.description !== undefined)
        roleUpdatePayload.description = data.description;
    if (data.status !== undefined)
        roleUpdatePayload.status = data.status;
    if (data.permissions !== undefined)
        roleUpdatePayload.permissions = data.permissions;
    if (Object.keys(roleUpdatePayload).length > 0) {
        yield role.update(roleUpdatePayload);
    }
    if (data.menu || data.dashboard || data.custom) {
        const settings = yield RoleSettings.findOne({ where: { role_id: id } });
        const payload = {};
        if (data.menu !== undefined)
            payload.menu = JSON.stringify(data.menu || []);
        if (data.dashboard !== undefined)
            payload.dashboard = JSON.stringify(data.dashboard || []);
        if (data.custom !== undefined)
            payload.custom = JSON.stringify(data.custom || {});
        if (settings) {
            yield settings.update(payload);
        }
        else {
            yield RoleSettings.create(Object.assign({ role_id: id }, payload));
        }
    }
    return exports.findById(id);
});
exports.delete = (id) => __awaiter(this, void 0, void 0, function* () {
    yield Role.destroy({ where: { id } });
});
// Backwards-compatible alias
exports.remove = exports.delete;
// Backwards-compatible alias
exports.remove = exports.delete;
