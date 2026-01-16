var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const UserRepository = require('./user.repository');
const bcrypt = require('bcrypt');
class UserService {
    getAllUsers() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield UserRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository.findById(id);
            if (!user) {
                throw new Error('User not found');
            }
            // Remove password from response
            const _a = user.toJSON(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            return userWithoutPassword;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if email already exists
            const existing = yield UserRepository.findByEmail(data.email);
            if (existing) {
                throw new Error('User with this email already exists');
            }
            // Hash password
            const hashedPassword = yield bcrypt.hash(data.password, 10);
            const userData = Object.assign(Object.assign({}, data), { password: hashedPassword });
            const user = yield UserRepository.create(userData);
            const _a = user.toJSON(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            return userWithoutPassword;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // If email is being updated, check for duplicates
            if (data.email) {
                const existing = yield UserRepository.findByEmail(data.email);
                if (existing && existing.id !== parseInt(id)) {
                    throw new Error('User with this email already exists');
                }
            }
            // Hash password if being updated
            if (data.password) {
                data.password = yield bcrypt.hash(data.password, 10);
            }
            const user = yield UserRepository.update(id, data);
            if (!user) {
                throw new Error('User not found');
            }
            const _a = user.toJSON(), { password } = _a, userWithoutPassword = __rest(_a, ["password"]);
            return userWithoutPassword;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserRepository.delete(id);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        });
    }
}
module.exports = new UserService();
