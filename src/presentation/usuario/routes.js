const Router = require('express');

const { usuariosDelete, usuariosGet, usuariosPatch, usuariosPut, usuarioGetById } =  require('./contoller');
const ValidacionMiddleware = require('./middlewares/validateusertoken');

 class Usuarioroutes {

  static get routes() {

    const router = Router();
    
    // Definir las rutas
    router.put('/update/:id', [ValidacionMiddleware.validateUser ], usuariosPut  );
    router.delete('/delete/:id', [ValidacionMiddleware.validateUser ], usuariosDelete );
    router.get('/', usuariosGet );
    router.get('/:id', usuarioGetById);
    router.patch('/', usuariosPatch )
    
    // router.get('/validate-email/:token', controller.validateEmail );

    return router;
  }

}

module.exports = Usuarioroutes;