import express from 'express';
import * as controllers from '../controllers/tags_controllers.mjs';
import { verificarToken } from '../middlewares/auth.mjs';

export const tags_routes = express.Router();

tags_routes.post('/tags', verificarToken, controllers.createTag);

tags_routes.get('/tags', verificarToken, controllers.getTags);

tags_routes.get('/tags/:id', verificarToken, controllers.getTag);
