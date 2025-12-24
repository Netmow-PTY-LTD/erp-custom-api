var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const service = require('./auth.service');
const { success } = require('../../core/utils/response');
exports.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield service.login(email, password);
        return success(res, 'Login successful', result);
    }
    catch (err) {
        next(err);
    }
});
exports.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const result = yield service.register(req.body);
        return success(res, 'User registered successfully', result, 201);
    }
    catch (err) {
        next(err);
    }
});
exports.me = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const result = yield service.getCurrentUser(req.user.id);
        return success(res, 'User retrieved successfully', result);
    }
    catch (err) {
        next(err);
    }
});
exports.refresh = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { refreshToken, refresh_token } = req.body;
        const token = refreshToken || refresh_token;
        if (!token) {
            return res.status(400).json({
                status: false,
                message: 'Validation Error',
                errors: [{ path: ['refreshToken'], message: 'Refresh token is required' }]
            });
        }
        const result = yield service.refreshToken(token);
        return success(res, 'Token refreshed successfully', result);
    }
    catch (err) {
        next(err);
    }
});
exports.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield service.logout(req.user.id);
        return success(res, 'Logged out successfully');
    }
    catch (err) {
        next(err);
    }
});
