const { request, response } = require("express");
const UserModel = require("../../data/mongo/models/user.models");


const usuariosGet = async (req = request, res = response) => {


    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    if (!Number.isInteger(Number(limite)) || !Number.isInteger(Number(desde)) ) {
        res.status(400).json({
            error: true,
            mensaje: "Los valores de la paginación deben ser numeros enteros",
            code: 400,

        })

        return;
      }

    if(limite < 0 || desde < 0){

        res.status(400).json({
            error: true,
            mensaje: "No se pueden enviar valores negativos en la paginación",
            code: 400,

        })
        return;
    }

    const [total, usuarios] = await Promise.all([
        UserModel.countDocuments(query),
        UserModel.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        offset: desde,
        usuarios,

    });
}

const usuarioGetById = async (req = request, res = response) => {


    const { id } = req.params;

    const usuario = await UserModel.findById(id);

    if (!usuario || !usuario.estado) {
        res.status(404).json({
            error: true,
            mensaje: "El usuario no existe",
            code: 404,

        })

        return;
    }

    // const [total,usuarios] = await Promise.all([
    //     UserModel.countDocuments(query),
    //     UserModel.find(query)
    //         .skip(Number(desde))
    //         .limit(Number(limite))
    // ]);
    res.status(200).json({
        usuario,
        error: false,
        mensaje: "",
        code: 200
    }

    );
}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { password, email, ...resto } = req.body;

    //Todo validar contra base de datos


    if (password) {

        // const salt = bcrypt.genSaltSync();
        // //Se establece el cambio en resto
        // resto.password = bcrypt.hashSync(password, salt);
        resto.password = password

    }

    const usuario = await UserModel.findByIdAndUpdate(id, resto);

    if (!usuario || !usuario.estado) {

        res.status(404).json({
            error: true,
            mensaje: "El usuario no existe",
            code: 404,

        })

        return; 
    }

    res.status(200).json({
        usuario,
        error: false,
        mensaje: "",
        code: 200
    })
}

const usuariosPatch = (req, res) => {
    res.satus(200).json({

        "msg": "patch API - controlador"
    });
}

const usuariosDelete = async (req, res) => {

    const { id } = req.params;



    //Se borrar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);


    const usuario = await UserModel.findByIdAndUpdate(id, { estado: false });

    if (!usuario) {

        res.status(404).json({
            error: true,
            mensaje: "El usuario no existe",
            code: 404,

        });

        return
    }


    // usuarioAutenticado = req.usuario

    res.status(200).json({
        usuario,
        error: false,
        mensaje: "",
        code: 200
    }

    );
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    usuarioGetById
}