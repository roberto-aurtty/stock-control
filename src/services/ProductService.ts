import db from "../database/connection.js";
import { Product, ProductFilters } from "../models/Product.js";
import logger from "../config/logger.js";

class ProductService {
  private generateSKU(): string {
    // Generates a 9-digit random numeric SKU
    let sku = "";
    for (let i = 0; i < 9; i++) {
      sku += Math.floor(Math.random() * 10).toString();
    }
    return sku;
  }

  private async isSKUUnique(sku: string): Promise<boolean> {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM products WHERE sku = ?",
    );
    const result = query.get(sku) as { count: number };
    return result.count === 0;
  }

  public async createProduct(
    productData: Omit<Product, "id" | "sku" | "created_at">,
  ): Promise<Product> {
    let sku = this.generateSKU();

    // Ensure SKU is unique
    while (!(await this.isSKUUnique(sku))) {
      sku = this.generateSKU();
    }

    const query = db.prepare(`
      INSERT INTO products (name, description, price, sku, category, stock)
      VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `);

    const result = query.get(
      productData.name,
      productData.description || null,
      productData.price,
      sku,
      productData.category || null,
      productData.stock || 0,
    ) as Product;

    logger.info(`Produto criado: ${result.name} (SKU: ${result.sku})`);
    return result;
  }

  public listProducts(filters: ProductFilters) {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = filters;
    const offset = (page - 1) * limit;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];

    if (name) {
      sql += " AND name LIKE ?";
      params.push(`%${name}%`);
    }

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    if (minPrice !== undefined) {
      sql += " AND price >= ?";
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      sql += " AND price <= ?";
      params.push(maxPrice);
    }

    // Count total for pagination
    const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total");
    const totalResult = db.prepare(countSql).get(...params) as {
      total: number;
    };

    // Add pagination
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    const products = db.prepare(sql).all(...params) as Product[];

    return {
      data: products,
      pagination: {
        total: totalResult.total,
        page,
        limit,
        totalPages: Math.ceil(totalResult.total / limit),
      },
    };
  }

  public getProductById(id: number): Product | null {
    const query = db.prepare("SELECT * FROM products WHERE id = ?");
    return query.get(id) as Product | null;
  }

  public updateProduct(
    id: number,
    productData: Partial<Omit<Product, "id" | "sku" | "created_at">>,
  ): Product | null {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const fields = Object.keys(productData);
    if (fields.length === 0) return existing;

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const params = [...Object.values(productData), id];

    const query = db.prepare(`
      UPDATE products 
      SET ${setClause}
      WHERE id = ?
      RETURNING *
    `);

    return query.get(...params) as Product;
  }

  public deleteProduct(id: number): boolean {
    const query = db.prepare("DELETE FROM products WHERE id = ?");
    const result = query.run(id);
    return result.changes > 0;
  }
}

export default new ProductService();
