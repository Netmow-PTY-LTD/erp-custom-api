const { z } = require('zod');

const generateRun = z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format')
});

module.exports = {
    generateRun
};
