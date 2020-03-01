import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './middlewares/auth';

const routes = new Router();

routes.get('/recipients', RecipientController.index);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);

routes.put('/recipients/:id', RecipientController.update);

routes.delete('/recipients/:id', RecipientController.delete);

export default routes;
