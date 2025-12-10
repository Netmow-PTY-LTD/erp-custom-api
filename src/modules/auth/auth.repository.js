const { User } = require('../users/user.model');

exports.findByEmail = async (email) => {
  return User.findOne({ where: { email } });
};

exports.findById = async (id) => {
  return User.findByPk(id);
};

exports.create = async (data) => {
  return User.create(data);
};
