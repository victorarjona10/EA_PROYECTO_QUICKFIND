import { Router } from 'express';

const router = Router();

import { postUser, getAllUsers, getUserById, InactivateUserById, getUserByEmail, updateUserById, getUserByName, ativateUserById, getAllActiveUsers, getUsersByFiltration  } from '../controllers/user.controller'

router.get( "/ActiveUsers/", getAllActiveUsers);
router.get( "/usersByFiltration/", getUsersByFiltration);
router.get( "/", getAllUsers);
router.post( "/", postUser );
router.get('/:id', getUserById);
router.get('/name/:name', getUserByName);
router.get('/email/:email', getUserByEmail);
router.put('/:id', updateUserById);
router.put('/InactivateFlag/:id', InactivateUserById);
router.put('/ActivateFlag/:id', ativateUserById);

export default router;