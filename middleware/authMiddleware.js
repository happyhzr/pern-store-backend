import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

export function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ success: false, message: 'Invalid Token' });
    }
}