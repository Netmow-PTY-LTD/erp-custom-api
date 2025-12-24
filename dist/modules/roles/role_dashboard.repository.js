var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// role_dashboard.repository.js
const { RoleDashboard } = require('./role_dashboard.model');
exports.create = (data) => __awaiter(this, void 0, void 0, function* () {
    return yield RoleDashboard.create(data);
});
exports.findAll = () => __awaiter(this, void 0, void 0, function* () {
    return yield RoleDashboard.findAll({
        order: [['name', 'ASC']]
    });
});
exports.findById = (id) => __awaiter(this, void 0, void 0, function* () {
    return yield RoleDashboard.findByPk(id);
});
exports.update = (id, data) => __awaiter(this, void 0, void 0, function* () {
    const widget = yield RoleDashboard.findByPk(id);
    if (!widget)
        return null;
    return yield widget.update(data);
});
exports.delete = (id) => __awaiter(this, void 0, void 0, function* () {
    const widget = yield RoleDashboard.findByPk(id);
    if (!widget)
        return false;
    yield widget.destroy();
    return true;
});
