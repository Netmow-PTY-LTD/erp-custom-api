var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const SettingsRepository = require('./settings.repository');
class SettingsService {
    constructor(settingsRepository) {
        this.settingsRepository = settingsRepository || new SettingsRepository();
    }
    getAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield this.settingsRepository.findAll(limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.settingsRepository.findById(id);
            if (!setting) {
                throw new Error('Setting not found');
            }
            return setting;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.settingsRepository.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.settingsRepository.update(id, data);
            if (!setting) {
                throw new Error('Setting not found');
            }
            return setting;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.settingsRepository.delete(id);
            if (!setting) {
                throw new Error('Setting not found');
            }
            return setting;
        });
    }
    getCompanyProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.settingsRepository.findByName('company_profile');
            if (setting && setting.description) {
                try {
                    return JSON.parse(setting.description);
                }
                catch (e) {
                    console.error('Error parsing company profile:', e);
                }
            }
            // Default data if no profile exists
            return {
                company_name: 'ERP Company',
                email: 'info@erpcompany.com',
                phone: '+1234567890',
                address: '123 Business St',
                city: 'New York',
                country: 'USA',
                website: 'https://erpcompany.com',
                description: 'A leading ERP solutions provider',
                currency: 'USD',
                logo_url: null
            };
        });
    }
    updateCompanyProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield this.settingsRepository.findByName('company_profile');
            // Convert data to string for storage
            const description = JSON.stringify(data);
            if (setting) {
                // Update existing record
                yield this.settingsRepository.update(setting.id, {
                    name: 'company_profile',
                    description: description,
                    status: 'Active'
                });
            }
            else {
                // Create new record
                yield this.settingsRepository.create({
                    name: 'company_profile',
                    description: description,
                    status: 'Active'
                });
            }
            return Object.assign(Object.assign({}, data), { updated_at: new Date() });
        });
    }
}
module.exports = SettingsService;
