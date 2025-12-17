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
    const setting = await this.settingsRepository.findByName('company_profile');

    if (setting && setting.description) {
      try {
        return JSON.parse(setting.description);
      } catch (e) {
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
  }

  async updateCompanyProfile(data) {
    const setting = await this.settingsRepository.findByName('company_profile');

    // Convert data to string for storage
    const description = JSON.stringify(data);

    if (setting) {
      // Update existing record
      await this.settingsRepository.update(setting.id, {
        name: 'company_profile',
        description: description,
        status: 'Active'
      });
    } else {
      // Create new record
      await this.settingsRepository.create({
        name: 'company_profile',
        description: description,
        status: 'Active'
      });
    }

    return { ...data, updated_at: new Date() };
  }
}

module.exports = SettingsService;
