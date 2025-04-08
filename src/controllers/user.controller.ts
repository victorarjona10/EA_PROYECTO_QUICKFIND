import { Request, Response } from "express";
import { IUser } from "../models/user";
import { UserService } from "../services/user.service";
// para las funciones de addSubjectToUser
import { ObjectId } from "mongoose";

const userService = new UserService();

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error creating user
 */

export async function postUser(req: Request, res: Response): Promise<void> {
    try {
        const user = req.body as IUser;
        const newUser = await userService.postUser(user);
        res.status(201).json(newUser);
    } catch (error: any) {
        if (error.message === "El email ya está registrado") {
            // Enviar una respuesta clara para el error de email duplicado
            res.status(400).json({ message: error.message });
        } else {
            // Manejo genérico de errores
            res.status(500).json({ message: "Error al crear el usuario", error });
        }
    }
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Error getting users
 */

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const users = await userService.getAllUsers(page, limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error getting users", error });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error getting user
 */
export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: "Error getting user", error });
  }
}

/**
 * @swagger
 * /api/users/name/{name}:
 *   get:
 *     summary: Get a user by name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user name
 *     responses:
 *       200:
 *         description: The user description by name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error getting user
 */
export async function getUserByName(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const name = req.params.name;
    const user = await userService.getUserByName(name);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error getting user", error });
  }
}

/**
 * @swagger
 * /api/users/email/{email}:
 *   get:
 *     summary: Get a user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user email
 *     responses:
 *       200:
 *         description: The user description by email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error getting user
 */
export async function getUserByEmail(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: "Error getting user", error });
  }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error updating user
 */
export async function updateUserById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const user = req.body as IUser;
        const updatedUser = await userService.updateUserById(id, user);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error.message === "El email ya está registrado") {
            // Enviar una respuesta clara para el error de email duplicado
            res.status(400).json({ message: error.message });
        } else {
            // Manejo genérico de errores
            res.status(500).json({ message: "Error al actualizar el usuario", error });
        }
    }
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The deleted user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error deleting user
 */
export async function InactivateUserById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const desactivatedUser = await userService.InactivateUserById(id);
    res.status(200).json(desactivatedUser);
  } catch (error) {
    res.status(400).json({ message: "Error deleting user", error });
  }
}

export async function ativateUserById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const activatedUser = await userService.ativateUserById(id);
    res.status(200).json(activatedUser);
  } catch (error) {
    res.status(400).json({ message: "Error deleting user", error });
  }
}

export async function getAllActiveUsers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const activeUsers = await userService.getAllActiveUsers();
    res.status(200).json(activeUsers);
  } catch (error) {
    res.status(400).json({ message: "Error getting users", error });
  }
}

export async function getUsersByFiltration(req: Request, res: Response): Promise<void> {
  try {
    const filters = req.query; // Obtener filtros desde los query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const users = await userService.getUsersByFiltration(filters, page, limit);
    res.status(200).json(users);
} catch (error) {
    res.status(400).json({ message: "Error getting users by filtration", error });
}

}

export async function loginUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser(email, password);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}



