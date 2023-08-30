const { response, request } = require('express');
const  bcryptjs = require('bcryptjs');

const User = require('../models/user');


const usersGet = async(req = request, res = response) => {

    //const { q, nombre, apikey } = req.query;
    const query = { status: true }
    const { limit = 5, from = 0 } = req.query;
    //const users = await User.find(query)
    //    .skip(Number(from))
    //    .limit(Number(limit));

    //const total = await User.countDocuments(query);

    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ])

    res.json({
        total,
        users
    });
}

const usersPut = async(req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra bd
    if ( password ) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const user = await User.findByIdAndUpdate( id, resto );


    res.status(200).json({
        user
    });
}

const usersPost = async (req, res = response) => {

    const { name, email, password, rol } = req.body;
    const user = new User({ name, email, password, rol });

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync( password, salt );

    //Guardar en la BD
    await user.save();

    res.status(201).json({
        msg: 'post API - Controlador',
        user
    });
}

const usersDelete = async(req, res= response) => {

    const { id } = req.params;

    //Fisicamente lo borramos
    //const user = await User.findByIdAndDelete( id );

    const user = await User.findByIdAndUpdate( id, {status: false} )

    res.json({
        user
    });
}

const usersPatch = (req, res) => {
    res.json({
        msg: 'patch API - Controlador'
    });
}

module.exports = {
    usersGet,
    usersPut,
    usersPost,
    usersDelete,
    usersPatch
}