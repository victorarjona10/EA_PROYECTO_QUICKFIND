import { Request, Response } from 'express';
import { IUser } from '../models/user';
import { UserService } from '../services/user.service';
// para las funciones de addSubjectToUser
import { ObjectId } from 'mongoose';




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
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
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
        const users = await userService.getallUsers();
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
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error });
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
export async function deleteUserById(req: Request, res: Response): Promise<void> {
    try {
        const id = req.params.id;
        const deletedUser = await userService.deleteUserById(id);
        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ message: "Error deleting user", error });
    }
} 


//  add subject to a user
/*export async function addSubjectToUser(req: Request, res: Response): Promise<void> {
    try {
        const { userId, subjectId } = req.body;
        const user = await userService.getUserById(userId);
        const subject = await subjectService.getSubjectById(subjectId);
        if (!user || !subject) {
            res.status(404).json({ message: "User or Subject not found" });
            return;
        }
        
        const UserWithSubjectAdded = await userService.AddSubjectToUser(user, subjectId);

        /*
        user.subjects.push(subjectId);
        await user.userService.updateUserById(userId, user);

        subject.users.push(userId);
        await subject.save(); */

       // res.status(200).json({ message: "Subject added to user successfully" });
   // } catch (error) {
   //     res.status(400).json({ message: "Error adding subject to user", error });
   // }
//} 
