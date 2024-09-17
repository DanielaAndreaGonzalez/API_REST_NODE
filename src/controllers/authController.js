const jwt = require('jsonwebtoken');

const signToken = (user) => {
    return jwt.sign(
        user, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_TIME_EXPIRATION}
    );
}

const createToken = (user, status, res) => {
    const token = signToken(user);
    res.status(status).json({
        status: 'success',
        data: {
            token
        }
    });
}

exports.login = async (req, res, next) => {
    const user = {
        email: 'fortest@gmail.com',
        password: '1234'
    }
    //Logica para buscar el usuario en la base de datos.
    createToken(user, 200, res);
}

exports.signUp = async (req, res, next) => {
    //Logica para registrar, simulado por ahora.
    const user = req.body;
    //guardar el usuario
    //Logica para el token
    res.status(201).json({
        status: 'success',
        data: {
            user
        }
    });
}