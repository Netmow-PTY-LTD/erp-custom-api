var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'mysql',
        logging: false
    })
    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
        dialect: 'mysql',
        logging: false, // set true to see SQL queries
    });
console.log(`Sequelize initializing with Host: ${process.env.DB_HOST}, Port: ${process.env.DB_PORT} (parsed: ${parseInt(process.env.DB_PORT || '3306', 10)})`);
// Test connection
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log('MySQL connected (Sequelize)');
    }
    catch (err) {
        console.error('Sequelize connection error:', err);
    }
}))();
module.exports = { sequelize };
