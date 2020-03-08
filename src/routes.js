import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import StartDeliveryController from './app/controllers/StartDeliveryController';
import FinishDeliveryController from './app/controllers/FinishDeliveryController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliveryWithProblem from './app/controllers/DeliveryWithProblem';

import authMiddleware from './middlewares/auth';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/recipients', RecipientController.index);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id/deliveries', DeliveryController.index);
routes.get(
  '/deliverymen/:id/finished-deliveries',
  FinishDeliveryController.index
);
routes.get('/deliveries/:id/problems', DeliveryProblemController.index);
routes.get('/problems/deliveries', DeliveryWithProblem.index);

routes.post('/recipients', RecipientController.store);
routes.post('/deliverymen', DeliverymanController.store);
routes.post('/files', upload.single('file'), FileController.store);
routes.post('/deliveries', DeliveryController.store);
routes.post('/deliveries/:id/problems', DeliveryProblemController.store);

routes.put('/recipients/:id', RecipientController.update);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.put('/deliveries/:delivery_id/start', StartDeliveryController.update);
routes.put('/deliveries/:delivery_id/finish', FinishDeliveryController.update);

routes.delete('/recipients/:id', RecipientController.delete);
routes.delete('/deliverymen/:id', DeliverymanController.delete);
routes.delete('/deliveries/:id', DeliveryController.delete);
routes.delete('/problems/:id/cancel-delivery', DeliveryWithProblem.delete);

export default routes;
