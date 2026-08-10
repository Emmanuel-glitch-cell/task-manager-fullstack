import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import chalk from 'chalk';
import rutasLogin from './routes/auth.routes';
import rutas from './routes/tareas.routes';
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || origin.includes('.vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por políticas de CORS'));
        }
    }, 
    credentials: true 
}));

app.use('/api/auth', rutasLogin);
app.use('/', rutas);
app.listen(PORT, () => console.log(chalk.grey(`Servidor corriendo en http://localhost:${PORT}`)));