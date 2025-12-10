// role.validation.js
const { z } = require('zod');

exports.createSchema = z.object({
  name: z.string(),
  menu: z.array(z.string()).optional(),
  dashboard: z.array(z.string()).optional(),
  custom: z.record(z.any()).optional(),
});

exports.updateSchema = z.object({
  name: z.string().optional(),
  menu: z.array(z.string()).optional(),
  dashboard: z.array(z.string()).optional(),
  custom: z.record(z.any()).optional(),
});
