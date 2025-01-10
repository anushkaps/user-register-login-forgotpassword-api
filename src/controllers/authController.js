const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/email');
const { ErrorHandler } = require('../utils/errorHandler');

const authController = {
    async register(req, res, next) {
        try {
            const { username, email, password } = req.body;

            const userExists = await User.findOne({ 
                $or: [{ email }, { username }] 
            });

            if (userExists) {
                throw new ErrorHandler(400, 'User already exists');
            }

            const user = await User.create({
                username,
                email,
                password
            });

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({
                success: true,
                token
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                throw new ErrorHandler(401, 'Invalid credentials');
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                throw new ErrorHandler(401, 'Invalid credentials');
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                success: true,
                token
            });
        } catch (error) {
            next(error);
        }
    },

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                throw new ErrorHandler(404, 'No user found with this email');
            }

            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');
            user.resetPasswordExpires = Date.now() + 3600000;

            await user.save();

            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
            
            await transporter.sendMail({
                to: user.email,
                subject: 'Password Reset Request',
                html: `
                    <h1>You have requested a password reset</h1>
                    <p>Please click on the following link to reset your password:</p>
                    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
                    <p>This link will expire in 1 hour.</p>
                `
            });

            res.json({
                success: true,
                message: 'Password reset email sent'
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = authController;