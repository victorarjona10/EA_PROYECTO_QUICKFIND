import { Router } from 'express';
import { checkJwt } from '../middleware/session';

const router = Router();

import { postUser, getAllUsers, getUserById, InactivateUserById, getUserByEmail, updateUserById, getUserByName, ativateUserById, getAllActiveUsers, getUsersByFiltration, loginUser  } from '../controllers/user.controller'

router.get( "/ActiveUsers/", checkJwt, getAllActiveUsers);
router.get( "/usersByFiltration/", checkJwt,  getUsersByFiltration);
router.get( "/", checkJwt,  getAllUsers);
router.post( "/", checkJwt,  postUser );
router.get('/:id', checkJwt,  getUserById);
router.get('/name/:name', checkJwt,  getUserByName);
router.get('/email/:email', checkJwt,  getUserByEmail);
router.put('/:id', checkJwt,  updateUserById);
router.put('/InactivateFlag/:id', checkJwt,  InactivateUserById);
router.put('/ActivateFlag/:id', checkJwt,  ativateUserById);

router.post("/login", loginUser);


export default router;