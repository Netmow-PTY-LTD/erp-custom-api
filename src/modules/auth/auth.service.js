const repo = require('./auth.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../../core/config/env');

exports.login = async (email, password) => {
  const user = await repo.findByEmailWithRole(email);
  if (!user) throw { status: 400, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 400, message: 'Invalid credentials' };

  // Generate token
  const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });

  // Get role menus and dashboards
  const roleMenus = await repo.getRoleMenus();
  const roleDashboards = await repo.getRoleDashboards();

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
};

exports.register = async (userData) => {
  // Check if user already exists
  const existing = await repo.findByEmail(userData.email);
  if (existing) throw { status: 400, message: 'Email already registered' };

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = hashedPassword;

  // Create user
  const user = await repo.create(userData);
  delete user.password;

  // Generate token
  const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });

  return { user, token };
};

exports.getCurrentUser = async (userId) => {
  const user = await repo.findByIdWithRole(userId);
  if (!user) throw { status: 404, message: 'User not found' };

  // Get role menus and dashboards
  const roleMenus = await repo.getRoleMenus();
  const roleDashboards = await repo.getRoleDashboards();

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
};

exports.refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const user = await repo.findById(decoded.id);
    if (!user) throw { status: 404, message: 'User not found' };

    const newToken = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });
    return { token: newToken };
  } catch (err) {
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }
};

exports.logout = async (userId) => {
  // In a real implementation, you might want to blacklist the token
  // or clear session data. For now, we'll just return success
  return { message: 'Logged out successfully' };
};
