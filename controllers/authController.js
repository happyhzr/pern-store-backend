import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const { LOGIN_USERNAME, LOGIN_PASSWORD, SECRET_KEY } = process.env

export const loginController = (req, res) => {
    const user = req.body
    if (!user || user.username !== LOGIN_USERNAME || user.password !== LOGIN_PASSWORD) {
        console.error('Invalid username or password:', user);
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
    res.json({ success: true, data: token });
}