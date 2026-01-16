var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { sequelize } = require('../../core/database/sequelize');
class SettingsRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (limit = 10, offset = 0) {
            const query = 'SELECT * FROM settingss LIMIT ? OFFSET ?';
            const [rows] = yield sequelize.query(query, {
                replacements: [limit, offset]
            });
            const [countResult] = yield sequelize.query('SELECT COUNT(*) as count FROM settingss');
            return { rows, count: countResult[0].count };
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM settingss WHERE id = ?';
            const [rows] = yield sequelize.query(query, {
                replacements: [id]
            });
            return rows[0] || null;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM settingss WHERE name = ?';
            const [rows] = yield sequelize.query(query, {
                replacements: [name]
            });
            return rows[0] || null;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'INSERT INTO settingss (name, description, status) VALUES (?, ?, ?)';
            const [result] = yield sequelize.query(query, {
                replacements: [data.name, data.description, data.status || 'Active']
            });
            return this.findById(result);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'UPDATE settingss SET name = ?, description = ?, status = ? WHERE id = ?';
            yield sequelize.query(query, {
                replacements: [data.name, data.description, data.status, id]
            });
            return this.findById(id);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = yield this.findById(id);
            if (!record)
                return null;
            const query = 'DELETE FROM settingss WHERE id = ?';
            yield sequelize.query(query, {
                replacements: [id]
            });
            return record;
        });
    }
}
module.exports = SettingsRepository;
