import { Router } from 'express';

const router = Router();

import { postUser, getAllUsers, getUserById, deleteUserById, getUserByEmail, updateUserById, getUserByName } from '../controllers/user.controller'

router.get( "/", getAllUsers);
router.post( "/", postUser );
router.get('/:id', getUserById);
router.get('/name/:name', getUserByName);
router.get('/email/:email', getUserByEmail);
router.put('/:id', updateUserById);
router.delete('/:id', deleteUserById);

export default router;