var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const StaffRepository = require('./staffs.repository');
class StaffService {
    getAllStaffs() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield StaffRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getStaffById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield StaffRepository.findById(id);
            if (!staff) {
                throw new Error('Staff not found');
            }
            return staff;
        });
    }
    createStaff(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.email) {
                const existing = yield StaffRepository.findByEmail(data.email);
                if (existing) {
                    throw new Error('Staff with this email already exists');
                }
            }
            return yield StaffRepository.create(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    updateStaff(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.email) {
                const existing = yield StaffRepository.findByEmail(data.email);
                if (existing && existing.id !== parseInt(id)) {
                    throw new Error('Staff with this email already exists');
                }
            }
            const staff = yield StaffRepository.update(id, data);
            if (!staff) {
                throw new Error('Staff not found');
            }
            return staff;
        });
    }
    deleteStaff(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const staff = yield StaffRepository.delete(id);
            if (!staff) {
                throw new Error('Staff not found');
            }
            return staff;
        });
    }
}
module.exports = new StaffService();
