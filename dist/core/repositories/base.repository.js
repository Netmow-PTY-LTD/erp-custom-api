var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.model.findAll(options);
        });
    }
    findOne() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.model.findOne(options);
        });
    }
    findById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            return yield this.model.findByPk(id, options);
        });
    }
    create(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, options = {}) {
            return yield this.model.create(data, options);
        });
    }
    update(id_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, options = {}) {
            const record = yield this.findById(id);
            if (!record)
                return null;
            return yield record.update(data, options);
        });
    }
    delete(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, options = {}) {
            const record = yield this.findById(id);
            if (!record)
                return null;
            return yield record.destroy(options);
        });
    }
    count() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.model.count(options);
        });
    }
    findAndCountAll() {
        return __awaiter(this, arguments, void 0, function* (options = {}) {
            return yield this.model.findAndCountAll(options);
        });
    }
}
module.exports = BaseRepository;
