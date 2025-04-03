import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;
        console.log('Fetched products:', products);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const createProduct = async (req, res) => {
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const product = await sql`
            INSERT INTO products (name, price, image)
            VALUES (${name}, ${price}, ${image})
            RETURNING *
        `;
        console.log('Product created successfully!', product);
        res.status(201).json({ success: true, data: product[0] });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const getProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    try {
        const product = await sql`
            SELECT * FROM products
            WHERE id = ${id}
        `;
        console.log('Fetched product:', product);
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, data: product[0] });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    try {
        const product = await sql`
            UPDATE products
            SET name = ${name}, price = ${price}, image = ${image}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING *
        `;
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        console.log('Product updated successfully!', product);
        res.json({ success: true, data: product[0] });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }
    try {
        const product = await sql`
            DELETE FROM products
            WHERE id = ${id}
            RETURNING *
        `;
        if (product.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        console.log('Product deleted successfully!', product);
        res.json({ success: true, data: product[0] });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}