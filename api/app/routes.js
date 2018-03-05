import { Router } from 'express';

import MainController from './controllers/main.controller';
import AuthController from './controllers/auth.controller';
import AdminController from './controllers/admin.controller';

import errorHandler from './middleware/errorHandler';
import accessControl from './middleware/access-control';

const routes = new Router();

routes.get('/', MainController.index);
routes.get('/user', accessControl, MainController.getUser);

routes.post('/main/contactus', MainController.contactus);
routes.get('/main/confirm/:action/:data', MainController.confirm);
routes.get('/main/resend/:user_id', MainController.resend);
routes.post('/main/subscribe', MainController.subscribe);
routes.post('/main/reset', MainController.reset);
routes.post('/main/register', MainController.register);
routes.post('/auth/login', AuthController.login);
routes.post('/setWallet', accessControl, MainController.setWallet);

//admin routes
routes.post('/admin/login', AdminController.login);
routes.post('/admin/conversion', AdminController.getConversionRate);


routes.use(errorHandler);

export default routes;
