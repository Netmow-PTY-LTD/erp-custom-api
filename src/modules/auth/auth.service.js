const repo = require('./auth.repository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../../core/config/env');

exports.login = async (email, password) => {
  const user = await repo.findByEmail(email);
  if (!user) throw { status: 400, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 400, message: 'Invalid credentials' };
  const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, jwtSecret, { expiresIn: jwtExpiresIn });
  delete user.password;
  return { user, token };
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
  const user = await repo.findById(userId);
  if (!user) throw { status: 404, message: 'User not found' };
  delete user.password;
  return user;
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
