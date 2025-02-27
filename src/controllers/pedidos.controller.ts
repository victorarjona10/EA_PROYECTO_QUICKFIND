import { Request, Response } from 'express';
import { IPedido } from '../models/pedidos';
import { PedidosService } from '../services/pedidos.service';

const pedidosService = new PedidosService();

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Create a new order
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: The order was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error creating order
 */
export async function postPedido(req: Request, res: Response): Promise<void> {
    try {
        const pedido = req.body as IPedido;
        const newPedido = await pedidosService.postPedido(pedido);
        res.status(201).json(newPedido);
    } catch (error) {
        res.status(400).json({ message: "Error creating order", error });
    }
}


/**
 * @swagger
 * /api/pedidos/usuario/{idUsuario}:
 *   get:
 *     summary: Get all orders by user ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: idUsuario
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of all orders by user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error getting orders
 */
export async function getPedidosByUserId(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.params.idUsuario;
        const pedidos = await pedidosService.getPedidosByUserId(userId);
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(400).json({ message: "Error getting orders", error });
    }
}


/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The order description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error getting order
 */
export async function getPedidoById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const pedido = await pedidosService.getPedidoById(id);
        res.status(200).json(pedido);
    } catch (error) {
        res.status(400).json({ message: "Error getting order", error });
    }
}

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: The updated order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error updating order
 */
export async function updatePedidoById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const pedido = req.body as IPedido;
        const updatedPedido = await pedidosService.updatePedidoById(id, pedido);
        res.status(200).json(updatedPedido);
    } catch (error) {
        res.status(400).json({ message: "Error updating order", error });
    }
}

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order ID
 *     responses:
 *       200:
 *         description: The deleted order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Error deleting order
 */
export async function deletePedidoById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const deletedPedido = await pedidosService.deletePedidoById(id);
        res.status(200).json(deletedPedido);
    } catch (error) {
        res.status(400).json({ message: "Error deleting order", error });
    }
}
