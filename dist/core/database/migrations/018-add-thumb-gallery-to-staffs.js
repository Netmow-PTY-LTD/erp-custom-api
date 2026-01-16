/**
 * Migration: Add thumb_url and gallery_items to staffs table
 * Adds image fields for staff profile pictures and gallery
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.addColumn('staffs', 'thumb_url', {
            type: Sequelize.STRING(500),
            allowNull: true,
            after: 'notes'
        });
        yield queryInterface.addColumn('staffs', 'gallery_items', {
            type: Sequelize.JSON,
            allowNull: true,
            defaultValue: null,
            after: 'thumb_url'
        });
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        yield queryInterface.removeColumn('staffs', 'gallery_items');
        yield queryInterface.removeColumn('staffs', 'thumb_url');
    })
};
