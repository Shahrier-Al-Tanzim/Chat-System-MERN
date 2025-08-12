const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({ message: 'Authorization header is missing' });

    const token = header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userr = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function verifyToken(token) {
    if(!token) throw new Error('No Token Provided');
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {authMiddleware, verifyToken};