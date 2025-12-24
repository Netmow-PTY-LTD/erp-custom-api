var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// role_menu.repository.js
const { RoleMenu } = require('./role_menu.model');
exports.create = (data) => __awaiter(this, void 0, void 0, function* () {
    return yield RoleMenu.create(data);
});
exports.findAll = () => __awaiter(this, void 0, void 0, function* () {
    // Get hierarchy
    const menus = yield RoleMenu.findAll({
        where: { parent_id: null },
        include: [
            {
                model: RoleMenu,
                as: 'children',
                include: [{ model: RoleMenu, as: 'children' }] // 2 levels deep
            }
        ],
        order: [['sort_order', 'ASC'], [{ model: RoleMenu, as: 'children' }, 'sort_order', 'ASC']]
    });
    return menus;
});
exports.findById = (id) => __awaiter(this, void 0, void 0, function* () {
    return yield RoleMenu.findByPk(id, {
        include: [{ model: RoleMenu, as: 'children' }]
    });
});
exports.update = (id, data) => __awaiter(this, void 0, void 0, function* () {
    const menu = yield RoleMenu.findByPk(id);
    if (!menu)
        return null;
    return yield menu.update(data);
});
exports.delete = (id) => __awaiter(this, void 0, void 0, function* () {
    const menu = yield RoleMenu.findByPk(id);
    if (!menu)
        return false;
    yield menu.destroy();
    return true;
});
