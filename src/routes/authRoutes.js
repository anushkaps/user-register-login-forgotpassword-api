const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/register',
    [
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long'),
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        validateRequest
    ],
    authController.register
);

router.post('/login',
    [
        body('username').trim().notEmpty(),
        body('password').notEmpty(),
        validateRequest
    ],
    authController.login
);

router.post('/forgot-password',
    [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please enter a valid email'),
        validateRequest
    ],
    authController.forgotPassword
);

module.exports = router;