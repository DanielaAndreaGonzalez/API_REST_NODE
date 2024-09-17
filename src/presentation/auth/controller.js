const { request, response } = require("express");
const UserModel = require("../../data/mongo/models/user.models");
const JwtAdapter = require("../../config/jwt.adapter");
const crypto = require('crypto');
const EmailService = require("../services/email.service");


exports.login = async (req = request, res = response) => {

    const { email, password } = req.body;
    try {

        //Verificar si el email existe
        const usuario = await UserModel.findOne({ email, estado:true });

        if (!usuario) {
            return res.status(401).json({
                error: true,
                mensaje: "credenciales incorrectas",
                code: 404,

            })
        }

        if (usuario.password != password) {
            return res.status(401).json({
                error: true,
                mensaje: "credenciales incorrectas",
                code: 404,

            })
        }

        //Verificar actividad usuario

        // if(!usuario.estado){
        //     return res.status(400).json( {
        //         msg: 'Usuarios / password no son correctos - estado : false'
        //     });
        // }

        //Verificar la contraseña

        // const validPassword = bcryptjs.compareSync(password,usuario.password);
        // if(!validPassword){
        //     return res.status(400).json( {
        //         msg: 'Usuarios / password no son correctos - estado : password'
        //     });
        // }

        //Generar jWT
        const token = await JwtAdapter.generateToken({sub: email });

        return res.status(200).json({
            usuario,
            token,
            error: false,
            mensaje: "",
            code: 200
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            mensaje: "error en el servidor. Hable con el administrador",
            code: 404,

        })
    }


}



exports.signUp = async (req = request, res = response) => {


    const { name, email, password, role } = req.body;

    console.log(email);

    const user = await UserModel.findOne({ email });

    console.log(user);

    if (user) {
        return res.status(409).json({
            error: true,
            mensaje: "El usuario con este correo ya existe",
            code: 404,

        });
    }

    const usuario = new UserModel({ name, email, password, role });



    //Verificar si el correo existe

    //Guardar en BD
    await usuario.save();

    return res.status(200).json({
        usuario,
        error: false,
        mensaje: "",
        code: 200
    });
}

exports.recuperarClave = async (req = request, res = response) => {

    const { email } = req.body;

    // Buscar usuario por email
    const user = await UserModel.findOne({ email });

    if (!user) {

        return res.status(404).json({
            error: true,
            mensaje: "El usuario con este correo no existe",
            code: 404,

        });
    }

    const token = crypto.randomBytes(32).toString('hex');

    // Establecer el token y la expiración en el usuario
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora desde ahora

    await user.save();

    const emailService = new EmailService();

    const mailOptions = {
        to: user.email,
        from: process.env.MAILER_EMAIL,
        subject: 'Soy Miguel :D, Password Reset',
        text: `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/api/auth/reset-password/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    emailService.sendEmail(mailOptions);

    return res.status(200).json({
        error: false,
        mensaje: "Se envió el correo correctamente",
        code: 200
    });

}
exports.cambiarClave = async (req = request, res = response) => {

    const { token } = req.params;
    const { newPassword } = req.body;

    // Buscar al usuario por el token y asegurarse de que no haya expirado
    const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }, // Verifica que el token no haya expirado
    });

    if (!user) {
        return res.status(400).json(
            {
                error: true,
                mensaje: "El token ya no es valido o ya expiró",
                code: 404,
    
            }
        );
    }

    // Establecer la nueva contraseña
    user.password = newPassword; // Asegúrate de tener un método para hashear la contraseña
    user.resetPasswordToken = undefined; // Eliminar el token
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
        error: false,
        mensaje: "Se cambio la clave correctamente",
        code: 200
    });
}