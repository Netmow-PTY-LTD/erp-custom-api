const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false, // set true to see SQL queries
  }
);

console.log(`Sequelize initializing with Host: ${process.env.DB_HOST}, Port: ${process.env.DB_PORT} (parsed: ${parseInt(process.env.DB_PORT || '3306', 10)})`);


// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected (Sequelize)');
  } catch (err) {
    console.error('Sequelize connection error:', err);
  }
})();

module.exports = { sequelize };
