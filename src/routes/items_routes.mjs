import express from 'express';
import * as controllers from '../controllers/items_controllers.mjs';
import { verificarToken } from '../middlewares/auth.mjs';

export const items_routes = express.Router();

items_routes.post('/items', verificarToken, controllers.createItem);

items_routes.get('/items/:id', verificarToken, controllers.getItem);

items_routes.get('/items', verificarToken, controllers.getItems);

items_routes.get('/items/creator/:creator_id', verificarToken, controllers.getCreatorItems);