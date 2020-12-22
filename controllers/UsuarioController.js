const { Usuario } = require('../models/');
const bcrypt = require('bcryptjs')
const servToken = require('../services/token')


module.exports = {

    list : async (req, res, next) => {
        try {
            const re = await Usuario.findAll()
            res.status(200).json(re)
        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    add : async (req, res, next) => {
        try {
            const re = await Usuario.create(req.body);
            res.status(200).json(re);
        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    update : async (req, res, next) => {
        try {
            const user = await Usuario.findOne({where : {id: req.body.id}});

            // Evaluar contraseña
            const contrasenhaValida = bcrypt.compareSync(req.body.password, user.password);

            if(contrasenhaValida){
                const contrasenia = bcrypt.hashSync(user.password);

                const re = await Usuario.update({ nombre: req.body.nombre, password: contrasenia,
                    estado: req.body.estado},{where : {id: req.body.id}})
                res.status(200).json(re);

            } else {
                res.status(404).json({ 'error' : 'No se Encontro el Usuario' });
            }
        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    activate : async (req, res, next) => {
        try {
            const re = await Usuario.update({estado: 1},{where : {id: req.body.id}})
            res.status(200).json(re);
        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    deactivate : async (req, res, next) => {
        try {
            const re = await Usuario.update({estado: 0},{where : {id: req.body.id}})
            res.status(200).json(re);
        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next(error)
        }
    },

    login : async (req, res, next) => {

        try {
                const user = await Usuario.findOne( { where :  { email: req.body.email } } )
                if(user){

                // Evaluar contraseña
                const contrasenhaValida = bcrypt.compareSync(req.body.password, user.password);

                if (contrasenhaValida)
                {
                    const token = servToken.encode(user.id, user.rol);

                    res.status(200).send({ tokenReturn: token });

                }  else {
                    res.status(401).send({ auth: false, accessToken: null, reason: "Invalid Password!" });
                }

            } else {
                res.status(404).send('User Not Found.');
            }

        } catch (error) {
            res.status(500).json({ 'error' : 'Oops paso algo' })
            next()
        }
    }
}
