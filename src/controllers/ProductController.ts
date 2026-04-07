import { Request, Response } from 'express';
import ProductService from '../services/ProductService.js';
import { ProductFilters } from '../models/Product.js';

class ProductController {
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, price } = req.body;

      if (!name || price === undefined) {
        res.status(400).json({ error: 'Name and price are required' });
        return;
      }

      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public list(req: Request, res: Response): void {
    try {
      const filters: ProductFilters = {
        name: req.query.name as string,
        category: req.query.category as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 10
      };

      const result = ProductService.listProducts(filters);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public getById(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const product = ProductService.getProductById(id);

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public update(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const updatedProduct = ProductService.updateProduct(id, req.body);

      if (!updatedProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  public delete(req: Request, res: Response): void {
    try {
      const id = parseInt(req.params.id);
      const deleted = ProductService.deleteProduct(id);

      if (!deleted) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new ProductController();
