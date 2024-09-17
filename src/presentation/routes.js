const  AuthMiddleware  =  require('./middlewares/auth.middlewar');

const { Router }  =  require( 'express');

const  Authroutes   =   require('./auth/routes');
const  Usuarioroutes  = require('./usuario/routes');
const ValidacionEstadoMiddleware = require('./usuario/middlewares/validateEstadomiddleware');




class AppRoutes {

  static get routes() {

    const router = Router();

    // Definir las rutas
    router.use('/api/auth', Authroutes.routes);
    router.use('/api/usuario',[ AuthMiddleware.validateJWT, ValidacionEstadoMiddleware.validateUser ],  Usuarioroutes.routes);

    return router;
  }


}

module.exports = AppRoutes