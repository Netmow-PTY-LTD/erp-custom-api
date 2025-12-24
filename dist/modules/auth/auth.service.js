var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const repo = require('./auth.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../../core/config/env');
exports.login = (email, password) => __awaiter(this, void 0, void 0, function* () {
    const user = yield repo.findByEmailWithRole(email);
    if (!user)
        throw { status: 400, message: 'Invalid credentials' };
    const ok = yield bcrypt.compare(password, user.password);
    if (!ok)
        throw { status: 400, message: 'Invalid credentials' };
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });
    // Get role menus and dashboards
    const roleMenus = yield repo.getRoleMenus();
    const roleDashboards = yield repo.getRoleDashboards();
    // Build hierarchical menu structure
    const buildMenuTree = (menus, parentId = null) => {
        return menus
            .filter(menu => menu.parent_id === parentId)
            .map(menu => ({
            id: menu.id,
            title: menu.title,
            icon: menu.icon,
            path: menu.path,
            parent_id: menu.parent_id,
            sort_order: menu.sort_order,
            is_active: menu.is_active,
            children: buildMenuTree(menus, menu.id)
        }));
    };
    const menuTree = buildMenuTree(roleMenus);
    // Prepare user data
    const userData = user.toJSON();
    delete userData.password;
    return {
        user: userData,
        token,
        menus: menuTree,
        dashboards: roleDashboards
    };
});
exports.register = (userData) => __awaiter(this, void 0, void 0, function* () {
    // Check if user already exists
    const existing = yield repo.findByEmail(userData.email);
    if (existing)
        throw { status: 400, message: 'Email already registered' };
    // Hash password
    const hashedPassword = yield bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    // Create user
    const user = yield repo.create(userData);
    delete user.password;
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });
    return { user, token };
});
exports.getCurrentUser = (userId) => __awaiter(this, void 0, void 0, function* () {
    const user = yield repo.findByIdWithRole(userId);
    if (!user)
        throw { status: 404, message: 'User not found' };
    // Get role menus and dashboards
    const roleMenus = yield repo.getRoleMenus();
    const roleDashboards = yield repo.getRoleDashboards();
    // Build hierarchical menu structure
    const buildMenuTree = (menus, parentId = null) => {
        return menus
            .filter(menu => menu.parent_id === parentId)
            .map(menu => ({
            id: menu.id,
            title: menu.title,
            icon: menu.icon,
            path: menu.path,
            parent_id: menu.parent_id,
            sort_order: menu.sort_order,
            is_active: menu.is_active,
            children: buildMenuTree(menus, menu.id)
        }));
    };
    const menuTree = buildMenuTree(roleMenus);
    // Prepare user data
    const userData = user.toJSON();
    delete userData.password;
    return {
        user: userData,
        menus: menuTree,
        dashboards: roleDashboards
    };
});
exports.refreshToken = (token) => __awaiter(this, void 0, void 0, function* () {
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = yield repo.findById(decoded.id);
        if (!user)
            throw { status: 404, message: 'User not found' };
        const newToken = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });
        return { token: newToken };
    }
    catch (err) {
        throw { status: 401, message: 'Invalid or expired refresh token' };
    }
});
exports.logout = (userId) => __awaiter(this, void 0, void 0, function* () {
    // In a real implementation, you might want to blacklist the token
    // or clear session data. For now, we'll just return success
    return { message: 'Logged out successfully' };
});
