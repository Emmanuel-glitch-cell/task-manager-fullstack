import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import jwt from 'jsonwebtoken';
import "dotenv/config";
const claveToken = process.env.JWT_KEY_VALUE!;
export const vigilante = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if(!header) {
        console.log(chalk.red("Acceso no autorizado."));
        return res.status(401).json({error: "Acceso no autorizado. Se requiere de un token para poder ingresar aqui."});
    }
    const token = header.split(" ")[1];
    jwt.verify(token, claveToken, (error, datos) => {
        if (error) {
            console.log(chalk.yellow("Token invalido o caducado."));
            return res.status(403).json({error: "Token invalido o caducado."});
        }
        (req as any).datosUsuario= datos;
        next();
    });
}