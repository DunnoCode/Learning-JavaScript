const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'] || '';

    if(token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length); 
        }
        jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
            if(err){
                return res.status(401).json({message: "Unauthorized!"})
            }
            req.decoded = decoded;
            next();
        })
        
    }else{
        return res.status(403).json({message: "Missing Authorize Token"})
    }
}

module.exports = { verifyToken }