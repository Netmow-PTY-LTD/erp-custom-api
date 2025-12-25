const express = require('express');
const router = express.Router();
const SettingsRepository = require('./settings.repository');
const SettingsService = require('./settings.service');
const SettingsController = require('./settings.controller');
const { verifyToken, checkPermission } = require('../../core/middleware/auth');
const { moduleCheck } = require('../../core/middleware/moduleCheck');
const { handlerWithFields } = require('../../core/utils/zodTypeView');
const validate = require('../../core/middleware/validate');
const {
    updateCompanyProfile,
    createBranch,
    updateBranch,
    updateNumberingSequences,
    updateCurrencySettings,
    updateEmailSettings,
    createTaxRate,
    updateTaxRate,
    createPaymentMethod,
    updatePaymentMethod,
    createShippingMethod,
    updateShippingMethod,
    updateSystemPreferences,
    updateUserPreferences,
} = require('./settings.validation');

// Instantiate controller
const settingsRepository = new SettingsRepository();
const settingsService = new SettingsService(settingsRepository);
const settingsController = new SettingsController(settingsService);

// Module name for routes-tree grouping
router.moduleName = 'Settings';

// Define routes metadata with comprehensive documentation
router.routesMeta = [
    {
        path: '/company/profile',
        method: 'GET',
        middlewares: [], // Public endpoint - no authentication required
        handler: (req, res) => settingsController.getCompanyProfile(req, res),
        description: 'Get company profile information (Public)',
        sampleResponse: {
            status: true,
            data: {
                id: 1,
                company_name: 'ABC Corporation',
                email: 'info@abccorp.com',
                phone: '+1234567890',
                address: '123 Business Street',
                city: 'New York',
                country: 'USA',
                tax_id: 'TAX123456',
                logo_url: '/uploads/logo.png',
                website: 'https://abccorp.com',
                description: 'A leading ERP solutions provider',
                currency: 'USD'
            }
        }
    },
    {
        path: '/company/profile',
        method: 'PUT',
        middlewares: [verifyToken, moduleCheck('settings'), validate(updateCompanyProfile)],
        handler: handlerWithFields((req, res) => settingsController.updateCompanyProfile(req, res), updateCompanyProfile),
        description: 'Update company profile information',
        sampleRequest: {
            company_name: 'ABC Corporation Ltd',
            email: 'contact@abccorp.com',
            phone: '+1234567891',
            website: 'https://www.abccorp.com',
            description: 'Updated description',
            currency: 'EUR',
            logo_url: 'https://example.com/logo.png'
        },
        sampleResponse: {
            status: true,
            message: 'Company profile updated successfully',
            data: {
                id: 1,
                company_name: 'ABC Corporation Ltd',
                updated_at: '2025-12-02T10:00:00.000Z'
            }
        }
    }
];

// Register routes from metadata
router.routesMeta.forEach(r => {
    router[r.method.toLowerCase()](r.path, ...r.middlewares, r.handler);
});

module.exports = router;
