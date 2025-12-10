const SettingsRepository = require('./settings.repository');

class SettingsService {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository || new SettingsRepository();
  }

  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await this.settingsRepository.findAll(limit, offset);
    return {
      data: result.rows,
      total: result.count
    };
  }

  async getById(id) {
    const setting = await this.settingsRepository.findById(id);
    if (!setting) {
      throw new Error('Setting not found');
    }
    return setting;
  }

  async create(data) {
    return await this.settingsRepository.create(data);
  }

  async update(id, data) {
    const setting = await this.settingsRepository.update(id, data);
    if (!setting) {
      throw new Error('Setting not found');
    }
    return setting;
  }

  async delete(id) {
    const setting = await this.settingsRepository.delete(id);
    if (!setting) {
      throw new Error('Setting not found');
    }
    return setting;
  }

  async getCompanyProfile() {
    // Mock data for now - should be replaced with actual database query
    return {
      company_name: 'ERP Company',
      email: 'info@erpcompany.com',
      phone: '+1234567890',
      address: '123 Business St',
      city: 'New York',
      country: 'USA'
    };
  }

  async updateCompanyProfile(data) {
    // Mock update - should be replaced with actual database update
    return { ...data, updated_at: new Date() };
  }
}

module.exports = SettingsService;
