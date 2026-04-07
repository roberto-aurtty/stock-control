import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../src/app.js';
import db from '../src/database/connection.js';
describe('Products E2E Tests', () => {
    before(() => {
        // Database is initialized in app.ts
    });
    after(() => {
        db.exec('DELETE FROM products');
    });
    let createdProductId;
    test('should create a new product', async () => {
        const response = await request(app)
            .post('/products')
            .send({
            name: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            category: 'Test Category',
            stock: 10
        });
        assert.strictEqual(response.status, 201);
        assert.ok(response.body.id);
        assert.strictEqual(response.body.name, 'Test Product');
        assert.strictEqual(response.body.sku.length, 9);
        createdProductId = response.body.id;
    });
    test('should list products with pagination', async () => {
        const response = await request(app)
            .get('/products')
            .query({ page: 1, limit: 10 });
        assert.strictEqual(response.status, 200);
        assert.ok(response.body.data);
        assert.ok(response.body.pagination);
        assert.ok(Array.isArray(response.body.data));
        assert.ok(response.body.data.length > 0);
    });
    test('should get a product by ID', async () => {
        const response = await request(app)
            .get(`/products/${createdProductId}`);
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.id, createdProductId);
        assert.strictEqual(response.body.name, 'Test Product');
    });
    test('should update a product', async () => {
        const response = await request(app)
            .put(`/products/${createdProductId}`)
            .send({
            price: 79.99,
            stock: 5
        });
        assert.strictEqual(response.status, 200);
        assert.strictEqual(response.body.price, 79.99);
        assert.strictEqual(response.body.stock, 5);
    });
    test('should delete a product', async () => {
        const response = await request(app)
            .delete(`/products/${createdProductId}`);
        assert.strictEqual(response.status, 204);
        const getResponse = await request(app)
            .get(`/products/${createdProductId}`);
        assert.strictEqual(getResponse.status, 404);
    });
});
