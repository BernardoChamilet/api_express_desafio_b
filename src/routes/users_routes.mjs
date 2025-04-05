import express from 'express';
import * as controllers from '../controllers/users_controllers.mjs';

export const user_routes = express.Router();

user_routes.post('/users', controllers.createUser);

user_routes.get('/users', controllers.getUsers);

user_routes.get('/users/:id', controllers.getUser);

user_routes.put('/users/:id', controllers.updateUser);

user_routes.patch('/users/:id/password', controllers.updatePassword);