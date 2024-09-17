const { request, response } = require("express");

const jwt = require('jsonwebtoken');
const UserModel = require("../../../data/mongo/models/user.models");

class ValidacionEstadoMiddleware {


    static async validateUser(req = request, res = response, next) {

        const authorization = req.header('Authorization');

        const token = authorization.split(' ').at(1) || '';

        // Decodifica el token sin verificar la firma
        const decoded = jwt.decode(token);

        // Accede a la llave específica del payload
        if (decoded) {
            const valorDeLaLlave = decoded['sub']; // Reemplaza 'nombre_de_la_llave' con la llave que deseas obtener
            const usuario = await UserModel.findOne({ email:valorDeLaLlave });

            if(!usuario.estado ){
               return  res.status(403).json({
                    error: true,
                    mensaje: "Acceso restringido, esté usuario ya no hace parte del sistema",
                    code: 403,
        
                });
            }

        } else {
            return  res.status(400).json({
                error: true,
                mensaje: "El token no se puede decodificar",
                code: 400,
    
            });
        }
        
        next();
    }

}

module.exports = ValidacionEstadoMiddleware;
