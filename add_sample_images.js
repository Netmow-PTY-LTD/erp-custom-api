const { sequelize } = require('./src/core/database/sequelize');

async function addSampleProductImages() {
    try {
        // Add sample images for product ID 1
        await sequelize.query(`
            INSERT INTO product_images (product_id, image_url, is_primary, sort_order, caption, created_at, updated_at)
            VALUES 
                (1, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', true, 0, 'Main product image', NOW(), NOW()),
                (1, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', false, 1, 'Side view', NOW(), NOW()),
                (1, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', false, 2, 'Detail view', NOW(), NOW())
        `);

        console.log('✅ Sample product images added successfully');

        // Check the images
        const [results] = await sequelize.query(`
            SELECT * FROM product_images WHERE product_id = 1 ORDER BY sort_order
        `);

        console.log(`\n📸 Found ${results.length} images for product 1:`);
        results.forEach(img => {
            console.log(`- ${img.caption} (${img.is_primary ? 'PRIMARY' : 'Gallery'}) - ${img.image_url}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

addSampleProductImages();
