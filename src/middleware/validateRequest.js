const { validationResult } = require('express-validator');
const { ErrorHandler } = require('../utils/errorHandler');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ErrorHandler(400, 'Validation Error', errors.array());
    }
    next();
};

module.exports = validateRequest;