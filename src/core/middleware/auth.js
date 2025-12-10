const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/env');

const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ status: false, message: 'No token' });
    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).json({ status: false, message: 'Token error' });
    const token = parts[1];
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ status: false, message: 'Invalid token' });
  }
};

const checkPermission = (permissions = []) => {
  return (req, res, next) => {
    // Basic implementation - assuming user has a role or permissions in the token
    // For now, just pass through if user is authenticated
    if (!req.user) {
      return res.status(401).json({ status: false, message: 'Unauthorized' });
    }

    // TODO: Implement actual permission checking logic based on user role/permissions
    // const userPermissions = req.user.permissions || [];
    // const hasPermission = permissions.some(p => userPermissions.includes(p));
    // if (!hasPermission) return res.status(403).json({ status: false, message: 'Forbidden' });

    next();
  };
};

module.exports = {
  verifyToken,
  checkPermission
};
