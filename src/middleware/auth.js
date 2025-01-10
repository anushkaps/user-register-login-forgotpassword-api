const jwt = require('jsonwebtoken');
const { ErrorHandler } = require('../utils/errorHandler');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new ErrorHandler(401, 'Authentication required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        next(new ErrorHandler(401, 'Invalid token'));
    }
};

module.exports = authMiddleware;