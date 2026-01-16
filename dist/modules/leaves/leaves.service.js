var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const LeaveRepository = require('./leaves.repository');
class LeaveService {
    getAllLeaves() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield LeaveRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getLeaveById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield LeaveRepository.findById(id);
            if (!leave) {
                throw new Error('Leave application not found');
            }
            return leave;
        });
    }
    createLeave(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Basic validation: End date >= Start date
            if (new Date(data.end_date) < new Date(data.start_date)) {
                throw new Error('End date cannot be before start date');
            }
            return yield LeaveRepository.create(Object.assign(Object.assign({}, data), { status: 'pending', created_by: userId }));
        });
    }
    updateLeave(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield LeaveRepository.update(id, data);
            if (!leave) {
                throw new Error('Leave application not found');
            }
            return leave;
        });
    }
    updateStatus(id, status, approverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield LeaveRepository.update(id, {
                status,
                approved_by: approverId
            });
            if (!leave) {
                throw new Error('Leave application not found');
            }
            return leave;
        });
    }
    deleteLeave(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const leave = yield LeaveRepository.delete(id);
            if (!leave) {
                throw new Error('Leave application not found');
            }
            return leave;
        });
    }
}
module.exports = new LeaveService();
