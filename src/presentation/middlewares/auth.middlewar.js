const { request, response } = require("express");
const  JwtAdapter =   require('../../config/jwt.adapter');



class AuthMiddleware {


  static async validateJWT( req = request, res = response, next ) {

    const authorization = req.header('Authorization');
    if( !authorization ) return res.status(401).json({ error: 'No token provided' });
    if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').at(1) || '';


    try {

      const payload = await JwtAdapter.validateToken(token);
      if ( !payload ) return res.status(401).json({ error: 'Invalid token' })
      
    //   const user = await UserModel.findById( payload.id );
    //   if ( !user ) return res.status(401).json({ error: 'Invalid token - user' });

      // todo: validar si el usuario está activo

    //   req.body.user = UserEntity.fromObject(user);

      next();

    } catch (error) {
      
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });

    }
    
  }




}

module.exports = AuthMiddleware;
