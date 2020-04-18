import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import MobileSessionController from './app/controllers/MobileSessionController';
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

routes.post('/sessions', SessionController.store);
routes.post('/sessions/mobile', MobileSessionController.store);

routes.get('/recipients', RecipientController.index);
routes.get('/recipients/:id', RecipientController.show);

routes.use(authMiddleware);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymen', DeliverymanController.index);
routes.get('/deliverymen/:id', DeliverymanController.show);
routes.post('/deliverymen', DeliverymanController.store);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliveries', DeliveryController.index);
routes.get('/deliverymen/:id/deliveries', DeliveryController.index);
routes.get('/deliveries/:id', DeliveryController.show);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:id', DeliveryController.update);
routes.delete('/deliveries/:id', DeliveryController.delete);

routes.put('/deliveries/:id/start', StartDeliveryController.update);

routes.put('/deliveries/:id/finish', FinishDeliveryController.update);

routes.get('/problems', DeliveryProblemController.index);
routes.get('/deliveries/:id/problems', DeliveryProblemController.index);
routes.post('/problems', DeliveryProblemController.store);

routes.get('/problems/deliveries', DeliveryWithProblem.index);
routes.delete('/problems/:id/cancel-delivery', DeliveryWithProblem.delete);

export default routes;
