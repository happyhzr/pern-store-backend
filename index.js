import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import productRoutes from './routes/productRoutes.js';
import { sql } from './config/db.js';
import { aj } from './lib/arcjet.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve()

app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.status(429).json({ success: false, message: 'Rate limit exceeded' });
            } else if (decision.reason.isBot()) {
                res.status(403).json({ success: false, message: 'Bot detected' });
            } else {
                res.status(403).json({ success: false, message: 'Access denied' });
            }
            return;
        }
        if (decision.results.some(result => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ success: false, message: 'Spoofed bot detected' });
            return;
        }
        next();
    } catch (error) {
        console.error('Error in ArcJet middleware:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.use('/api/v1/products', productRoutes);

if (process.env.NODE_ENV === 'production') {
    // app.use(express.static(path.join(__dirname, '../frontend/dist')))
    // app.get('*', (req, res) => {
    //    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
    // })
}

const initDB = async function () {
    try {
        await sql`CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            image VARCHAR(255) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )`;
        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};

await initDB();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});