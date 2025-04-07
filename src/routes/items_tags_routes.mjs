import express from 'express';
import * as controllers from '../controllers/items_tags_controllers.mjs';
import { verificarToken } from '../middlewares/auth.mjs';

export const items_tags_routes = express.Router();

items_tags_routes.post('/items_tags/:item_id/:tag_id', verificarToken, controllers.tagItem);