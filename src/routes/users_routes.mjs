import express from 'express';
import * as controllers from '../controllers/users_controllers.mjs';
import { verificarToken, verificarTokenEID } from '../middlewares/auth.mjs';

export const user_routes = express.Router();

user_routes.post('/users', controllers.createUser);

user_routes.get('/users', verificarToken, controllers.getUsers);

user_routes.get('/users/:id', verificarTokenEID, controllers.getUser);

user_routes.put('/users/:id', verificarTokenEID, controllers.updateUser);

user_routes.patch('/users/:id/password', verificarTokenEID, controllers.updatePassword);

user_routes.delete('/users/:id', verificarTokenEID, controllers.deleteUser);