const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async( req, res = response, next) => {

    const token = req.header('x-token')

    if( !token ) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        //leer el usuario que corresponde al uid
        const userAuth = await User.findById( uid );

        if ( !userAuth ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }

        //Verificar si el uid tiene estado true
        if ( !userAuth.status ) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }



        req.userAuth = userAuth;
        next();

    } catch (error){
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })

    }
    


}

module.exports = {
    validateJWT
}