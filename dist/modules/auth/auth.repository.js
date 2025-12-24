var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { User } = require('../users/user.model');
const { Role, RoleSettings } = require('../roles/role.model');
const { RoleMenu } = require('../roles/role_menu.model');
const { RoleDashboard } = require('../roles/role_dashboard.model');
exports.findByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
    return User.findOne({ where: { email } });
});
exports.findByEmailWithRole = (email) => __awaiter(this, void 0, void 0, function* () {
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
});
exports.findById = (id) => __awaiter(this, void 0, void 0, function* () {
    return User.findByPk(id);
});
exports.findByIdWithRole = (id) => __awaiter(this, void 0, void 0, function* () {
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
});
exports.create = (data) => __awaiter(this, void 0, void 0, function* () {
    return User.create(data);
});
exports.getRoleMenus = () => __awaiter(this, void 0, void 0, function* () {
    return RoleMenu.findAll({
        where: { is_active: true },
        order: [
            ['sort_order', 'ASC'],
            ['id', 'ASC']
        ]
    });
});
exports.getRoleDashboards = () => __awaiter(this, void 0, void 0, function* () {
    return RoleDashboard.findAll({
        where: { is_active: true },
        order: [['id', 'ASC']]
    });
});
