class ErrorHandler extends Error {
    constructor(statusCode, message, details = null) {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
    }
}

const handleError = (err, req, res, next) => {
    const { statusCode = 500, message, details } = err;
    
    res.status(statusCode).json({
        success: false,
        message,
        details,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = {
    ErrorHandler,
    handleError
};