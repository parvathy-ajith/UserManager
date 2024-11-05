const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
    
    jwt.verify(token.split(' ')[1], process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        console.log(decoded)
        req.email = decoded.UserInfo.name;
        next();
    })
}

module.exports = authenticateToken;