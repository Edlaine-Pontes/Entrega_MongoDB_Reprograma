const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')
const crypto = require('crypto')
const mailer = require('../modules/mailer')

const router = express.Router();

function generateToken(params = {}){
    return jwt.sing(params, authConfig.secret, {
        expireIn: 86400,
    });
}

router.post('/register', async (req, res) => {

    const { email } = req.body;

    try{
        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Usuario ja existe'});

        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({ user });

    } catch (err) {
        return res.status(400).send({error:'Falha no Registro'});
    }
});

router.post('/authenticate', async (req, res) =>{
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send({ error:'Usuario não encontrado' });

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Senha invalida'});

    user.password = undefined;  


    res.send({ 
        user, 
        token: generateToken({ id: user.id }) 
    });    
});

router.post('/forgot_password', async (req, res) =>{
    const { email } = req.body;

    try {
        const user = await User.findOne({ email })
        if(!user)
            return res.status(400).send({error: 'usuario nao encontrado'})
        
        const token = crypto.randomBytes(20).toString('hex')    
        const now = new Date()
        now.setHours(now.getHours() + 1)

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        })

        mailer.sendMail({
            to: email,
            from: 'edlaine.psico@gmail.com',
            tamplate: 'mail/forgot_password',
            context: { token },
        }), (err) => {
            if (err)
                return res.status(400).send({error: 'Nao foi possivel enviar a senha por email'})

            return res.send();    
        }


    } catch (err) {
        res.status(400).send({error: 'Senha errada, tente novamente'})
    }
})

router.post('/reset_password', async (req, res) =>{
    const { email, token, password } = req.body
})

module.exports = app => app.use('/auth', router);