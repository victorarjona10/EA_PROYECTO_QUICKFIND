import { UserModel } from './../models/user';
import { Request, Response } from "express";
import { IUser } from "../models/user";
import { UserService } from "../services/user.service";
// para las funciones de addSubjectToUser
import { ObjectId } from "mongoose";
import { RequestExt } from "../middleware/session";

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

        // Validar que los datos requeridos estén presentes
        if (!user.email || !user.password) {
            res.status(400).json({ message: "Email y contraseña son obligatorios" });
        }

        const newUser = await userService.postUser(user);
        res.status(201).json(newUser);
    } catch (error: any) {
        if (error.code === 11000) {
            // Error de duplicado en MongoDB
            res.status(403).json({ message: "El email ya está registrado" });
        } else if (error.name === "ValidationError") {
            // Error de validación de Mongoose
            res.status(400).json({ message: "Datos inválidos", details: error.errors });
        } else {
            // Error genérico
            res.status(500).json({ message: "Error al crear el usuario", error: error.message });
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
    res.status(500).json({ message: "Error getting users", error });
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

        // Validar que el ID sea válido
        if (!id || id.length !== 24) {
            res.status(400).json({ message: "ID inválido" });
        }

        const user = await userService.getUserById(id);
        if (!user) {
            res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el usuario", error: (error as any).message });
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
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
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
    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
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

        // Validar que el ID sea válido
        if (!id || id.length !== 24) {
           res.status(400).json({ message: "ID inválido" });
        }

        // Validar que los datos requeridos estén presentes
        if (!user.email) {
           res.status(400).json({ message: "El email es obligatorio" });
        }

        const updatedUser = await userService.updateUserById(id, user);
        if (!updatedUser) {
           res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error.code === 11000) {
            res.status(403).json({ message: "El email ya está registrado" });
        } else {
            res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
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
    if (!id || id.length !== 24) {
      res.status(400).json({ message: "ID inválido" });
    }

    const desactivatedUser = await userService.InactivateUserById(id);
    if (!desactivatedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json(desactivatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}

export async function ativateUserById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const activatedUser = await userService.ativateUserById(id);
    if (!activatedUser) {
      res.status(404).json({ message: "Usuario no encontrado" });

    }
    res.status(200).json(activatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}

export async function getAllActiveUsers(
  req: RequestExt,
  res: Response
): Promise<void> {
  try {
    const activeUsers = await userService.getAllActiveUsers();
    if (!activeUsers) {
      res.status(404).json({ message: "No hay usuarios activos" });

    }
    res.status(200).json(activeUsers);
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
}

export async function getUsersByFiltration(req: Request, res: Response): Promise<void> {
  try {
    const filters = req.query; // Obtener filtros desde los query parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const users = await userService.getUsersByFiltration(filters, page, limit);
    res.status(200).json(users);
} catch (error) {
    res.status(500).json({ message: "Error getting users by filtration", error });
}
}
