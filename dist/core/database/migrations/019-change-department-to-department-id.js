/**
 * Migration: Change department string to department_id foreign key
 * Converts the department column from STRING to department_id INTEGER with FK
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
        // First, drop the old department column
        yield queryInterface.removeColumn('staffs', 'department');
        // Add the new department_id column with foreign key
        yield queryInterface.addColumn('staffs', 'department_id', {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'departments',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
            after: 'position'
        });
        // Add index for better query performance
        yield queryInterface.addIndex('staffs', ['department_id']);
    }),
    down: (queryInterface, Sequelize) => __awaiter(this, void 0, void 0, function* () {
        // Remove the foreign key column
        yield queryInterface.removeColumn('staffs', 'department_id');
        // Restore the old department string column
        yield queryInterface.addColumn('staffs', 'department', {
            type: Sequelize.STRING(100),
            allowNull: true,
            after: 'position'
        });
    })
};
