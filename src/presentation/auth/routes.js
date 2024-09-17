const { login, signUp, recuperarClave, cambiarClave}  = require('./controller');

const Router = require('express');


class  Authroutes {

  static get routes() {

    const router = Router();

    // Definir las rutas
    router.post('/login', login  );
    router.post('/register', signUp );
    router.post('/recuperarclave', recuperarClave );
    router.post('/reset-password/:token', cambiarClave);
    

    return router;

  }


}

module.exports = Authroutes;