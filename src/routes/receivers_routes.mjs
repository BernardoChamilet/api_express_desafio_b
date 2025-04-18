import express from 'express';
import * as controllers from '../controllers/receivers_controllers.mjs';
import { verificarToken, verificarTokenEID } from '../middlewares/auth.mjs';

export const receiver_routes = express.Router();

receiver_routes.post('/receiver/:id/:item_id', verificarTokenEID, controllers.receiveItem);

receiver_routes.delete('/receiver/:id/:item_id', verificarTokenEID, controllers.deleteReceiverRelation);

receiver_routes.get('/receiver/receivers_items/:id', verificarTokenEID, controllers.getReceiversItems);

receiver_routes.get('/receiver/items_receivers/:item_id', verificarToken, controllers.getItemsReceivers);