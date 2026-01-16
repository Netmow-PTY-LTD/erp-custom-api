var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Product, Category, Unit, ProductImage } = require('./products.model');
const { Op, Sequelize } = require('sequelize');
class ProductRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.category_id) {
                where.category_id = filters.category_id;
            }
            if (filters.is_active !== undefined) {
                where.is_active = filters.is_active;
            }
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { sku: { [Op.like]: `%${filters.search}%` } },
                    { barcode: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Product.findAndCountAll({
                where,
                include: [
                    { model: Category, as: 'category' },
                    { model: Unit, as: 'unit' },
                    {
                        model: ProductImage,
                        as: 'images',
                        order: [['sort_order', 'ASC'], ['is_primary', 'DESC']]
                    }
                ],
                limit,
                offset,
                order: [['created_at', 'DESC']],
                distinct: true
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product.findByPk(id, {
                include: [
                    { model: Category, as: 'category' },
                    { model: Unit, as: 'unit' },
                    {
                        model: ProductImage,
                        as: 'images',
                        order: [['sort_order', 'ASC'], ['is_primary', 'DESC']]
                    }
                ]
            });
        });
    }
    findBySku(sku) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product.findOne({ where: { sku } });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product.findByPk(id);
            if (!product)
                return null;
            return yield product.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield Product.findByPk(id);
            if (!product)
                return null;
            yield product.destroy();
            return product;
        });
    }
    getLowStockProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product.findAll({
                where: {
                    stock_quantity: {
                        [Op.lte]: Sequelize.col('min_stock_level')
                    },
                    is_active: true
                },
                include: [
                    { model: Category, as: 'category' },
                    { model: Unit, as: 'unit' }
                ]
            });
        });
    }
    getStockDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalProducts = yield Product.count({ where: { is_active: true } });
            const lowStockProducts = yield this.getLowStockProducts();
            const totalValueResult = yield Product.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.literal('stock_quantity * COALESCE(cost, 0)')), 'totalValue']
                ],
                where: { is_active: true },
                raw: true
            });
            const totalStockValue = totalValueResult[0].totalValue || 0;
            return {
                total_products: totalProducts,
                low_stock_count: lowStockProducts.length,
                total_stock_value: parseFloat(totalStockValue).toFixed(2),
                low_stock_products: lowStockProducts
            };
        });
    }
}
class CategoryRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = {};
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { description: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Category.findAndCountAll({
                where,
                limit,
                offset,
                order: [['name', 'ASC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category.findByPk(id);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Category.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category.findByPk(id);
            if (!category)
                return null;
            return yield category.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category.findByPk(id);
            if (!category)
                return null;
            yield category.destroy();
            return category;
        });
    }
}
class UnitRepository {
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, limit = 10, offset = 0) {
            const where = { is_active: true };
            if (filters.search) {
                where[Op.or] = [
                    { name: { [Op.like]: `%${filters.search}%` } },
                    { symbol: { [Op.like]: `%${filters.search}%` } }
                ];
            }
            return yield Unit.findAndCountAll({
                where,
                limit,
                offset,
                order: [['name', 'ASC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Unit.findByPk(id);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Unit.create(data);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield Unit.findByPk(id);
            if (!unit)
                return null;
            return yield unit.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield Unit.findByPk(id);
            if (!unit)
                return null;
            yield unit.destroy();
            return unit;
        });
    }
}
class ProductImageRepository {
    findByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductImage.findAll({
                where: { product_id: productId },
                order: [['is_primary', 'DESC'], ['sort_order', 'ASC']]
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductImage.findByPk(id);
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductImage.create(data);
        });
    }
    createMultiple(images) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductImage.bulkCreate(images);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield ProductImage.findByPk(id);
            if (!image)
                return null;
            return yield image.update(data);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield ProductImage.findByPk(id);
            if (!image)
                return null;
            yield image.destroy();
            return image;
        });
    }
    deleteByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductImage.destroy({
                where: { product_id: productId }
            });
        });
    }
    setPrimaryImage(productId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove primary flag from all images of this product
            yield ProductImage.update({ is_primary: false }, { where: { product_id: productId } });
            // Set the specified image as primary
            const image = yield ProductImage.findByPk(imageId);
            if (image && image.product_id === productId) {
                return yield image.update({ is_primary: true });
            }
            return null;
        });
    }
}
module.exports = {
    ProductRepository: new ProductRepository(),
    CategoryRepository: new CategoryRepository(),
    UnitRepository: new UnitRepository(),
    ProductImageRepository: new ProductImageRepository()
};
