var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { error } = require('../utils/response');
const ModuleCheckService = require('../../modules/common/moduleCheck.service');
/**
 * Middleware to check if a module is active and accessible
 * @param {string} moduleKey - The key of the module to check
 */
const moduleCheck = (moduleKey) => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Skip check for super admin if needed, but for now enforce module status
            const isActive = yield ModuleCheckService.isModuleActive(moduleKey);
            if (!isActive) {
                return error(res, `Module '${moduleKey}' is not active or does not exist`, 403);
            }
            next();
        }
        catch (err) {
            return error(res, 'Error checking module status', 500);
        }
    });
};
module.exports = { moduleCheck };
