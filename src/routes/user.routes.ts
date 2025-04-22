import { Router } from 'express';
import { checkJwt } from '../middleware/session';
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const router = Router();

import { updateAvatar, refreshAccesToken, postUser, getAllUsers, getUserById, InactivateUserById, getUserByEmail, updateUserById, getUserByName, ativateUserById, getAllActiveUsers, getUsersByFiltration, loginUser  } from '../controllers/user.controller'
import passport from 'passport';
import { generateToken } from '../utils/jwt.handle';

router.get( "/ActiveUsers/", checkJwt, getAllActiveUsers);
router.get( "/usersByFiltration/", checkJwt,  getUsersByFiltration);
router.get( "/", checkJwt,  getAllUsers);
router.post( "/", checkJwt,  postUser );
router.get('/:id', checkJwt,  getUserById);
router.get('/name/:name', checkJwt,  getUserByName);
router.get('/email/:email', checkJwt,  getUserByEmail);
router.put("/uptdateAvatar", checkJwt, updateAvatar);

router.put('/:id', checkJwt,  updateUserById);
router.put('/InactivateFlag/:id', checkJwt,  InactivateUserById);
router.put('/ActivateFlag/:id', checkJwt,  ativateUserById);

router.post("/login", loginUser);


router.get(
  '/auth/google',
  (req, res, next) => {
    const origin = req.query.origin || 'http://localhost:3000';
    const state = JSON.stringify({ origin }); // Incluye el origen en el estado
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
      state, // Pasa el estado a Google
    })(req, res, next);
  }
);
  
router.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/users/login',
    session: false,
  }),
  (req, res) => {
    const state = JSON.parse((req.query.state as string) || '{}'); // Recupera el estado
    const origin = state.origin || 'http://localhost:3000'; // Obtén el origen del estado
    console.log("Origin from state:", origin);

    const user = req.user as any;
    const token = generateToken(user._id.toString(), user.email);

    // Devuelve un HTML que envía el token al frontend
    res.send(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              token: '${token}',
              user: {
                id: '${user._id}',
                name: '${user.name}',
                email: '${user.email}',
                avatar: '${user.avatar || ''}'
              }
            }, '${origin}');
            window.close();
          </script>
        </body>
      </html>
    `);
  }
);
  
router.post('/auth/refresh', refreshAccesToken);
export default router;