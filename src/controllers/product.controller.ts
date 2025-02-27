import {Request, Response} from 'express';
import {IProduct} from '../models/Products';
import {ProductService} from '../services/product.service';

const productService = new ProductService();

/**
 * @swagger
 * /api/subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       201:
 *         description: The subject was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error creating subject
 */



export async function postProduct(req: Request, res: Response): Promise<void> {
    try {
        const product = req.body as IProduct;
        const newProduct = await productService.postProduct(product);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error });
    }
}

/**
 * @swagger
 * /api/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: List of all subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error getting subjects
 */

export async function getAllProducts(req: Request, res: Response): Promise<void> {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: "Error getting products", error });
    }
}

/**
 * @swagger
 * /api/subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The subject description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error getting subject
 */


export async function getProductById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const product = await productService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: "Error getting product", error });
    }
}

/**
 * @swagger
 * /api/subjects/{id}:
 *   put:
 *     summary: Update a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subject'
 *     responses:
 *       200:
 *         description: The updated subject
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error updating subject
 */

export async function updateProductById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const product = req.body as IProduct;
        const updatedProduct = await productService.updateProductById(id, product);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error updating product", error });
    }
}

/**
 * @swagger
 * /api/subjects/{id}:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: The deleted subject
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Error deleting subject
 */

export async function deleteProductById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const deletedProduct = await productService.deleteProductById(id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error deleting product", error });
    }
}


