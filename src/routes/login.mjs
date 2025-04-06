import express from 'express';
import * as controllers from '../controllers/login.mjs';

export const login_route = express.Router();

login_route.post('/login', controllers.login);