var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DepartmentRepository = require('./departments.repository');
class DepartmentService {
    getAllDepartments() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield DepartmentRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getDepartmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield DepartmentRepository.findById(id);
            if (!department) {
                throw new Error('Department not found');
            }
            return department;
        });
    }
    createDepartment(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check duplicate name
            const existing = yield DepartmentRepository.findByName(data.name);
            if (existing) {
                throw new Error('Department with this name already exists');
            }
            return yield DepartmentRepository.create(Object.assign(Object.assign({}, data), { created_by: userId }));
        });
    }
    updateDepartment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.name) {
                const existing = yield DepartmentRepository.findByName(data.name);
                if (existing && existing.id !== parseInt(id)) {
                    throw new Error('Department with this name already exists');
                }
            }
            const department = yield DepartmentRepository.update(id, data);
            if (!department) {
                throw new Error('Department not found');
            }
            return department;
        });
    }
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield DepartmentRepository.delete(id);
            if (!department) {
                throw new Error('Department not found');
            }
            return department;
        });
    }
}
module.exports = new DepartmentService();
