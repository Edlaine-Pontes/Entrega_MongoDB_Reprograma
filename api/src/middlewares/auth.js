const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json')


module.exports = (req, res, next) => {
    const authHeaders = req.headers.authorization;

    if(!authHeaders)
        return res.status(401).send({error: 'Token nao autorizado'});

    const parts = authHeaders.split(' ');

    if(!parts.length === 2)
        return res.status(401).send({error: 'Erro no Token'})

    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({error: 'Problemas no Token'});

    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if (err) return res.status(401).send({error: 'Token |Invalido'})

        req.userId = decoded.Id;
        return next();
    })    

}