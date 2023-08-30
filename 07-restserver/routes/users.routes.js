
const { Router } = require('express');
const { check } = require('express-validator');


const { validateFields } = require('../middlewares/validate-fields');
const { isRoleValid, isEmailValid, existsUserById } = require('../helpers/db-validators');
const { usersGet,
        usersPut,
        usersPost,
        usersDelete,
        usersPatch } = require('../controllers/users.controllers');

const router = Router();

router.get('/', usersGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    check('rol').custom( isRoleValid ),
    validateFields
], usersPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe contener más de 6 letras').isLength({ min:6 }),
    //check('email', 'El correo no es valido').isEmail(),
    check('email').custom( isEmailValid ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( isRoleValid ),
    validateFields
] , usersPost);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existsUserById ),
    validateFields
    ],
    usersDelete);

router.patch('/', usersPatch);

module.exports = router;