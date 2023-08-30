const Role = require('../models/role');
const User = require('../models/user');

const isRoleValid = async (rol = '') => {
    const existRol = await Role.findOne({ rol });
    if ( !existRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const isEmailValid = async (email = '') => {
    const existsEmail = await User.findOne({ email });
    if ( existsEmail ) {
        throw new Error(`Ya existe un usuario registrado con el email ${ email }`);
    }
}

const existsUserById = async (id = '') => {
    const existsUser = await User.findById( id );
    if ( !existsUser ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

module.exports = {
    isRoleValid,
    isEmailValid,
    existsUserById
}