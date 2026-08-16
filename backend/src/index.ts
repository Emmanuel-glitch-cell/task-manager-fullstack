import "dotenv/config"; 
import express from 'express';
import cookieParser from 'cookie-parser'; 
import chalk from 'chalk';
import rutasLogin from './routes/auth.routes';
import rutas from './routes/tareas.routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); 
    }
    next();
});

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', rutasLogin);
app.use('/', rutas);

app.listen(PORT, () => console.log(chalk.grey(`Servidor corriendo en http://localhost:${PORT}`)));
