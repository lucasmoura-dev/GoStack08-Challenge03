import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';
import MeetupController from './app/controllers/MeetupController';
import OrganizingController from './app/controllers/OrganizingController';
import SubscriptionController from './app/controllers/SubscriptionController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Somente para as rotas abaixo

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

/* Meetups */
routes.get('/meetups', MeetupController.index);
routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
// adicionar o delete

routes.get('/organizing', OrganizingController.index);
routes.delete('/organizing/:id', OrganizingController.delete);

/* Subscriptions */
routes.get('/subscriptions', SubscriptionController.index);
// olhar aqui abaixo
routes.post('/subscriptions', SubscriptionController.store);

export default routes;
