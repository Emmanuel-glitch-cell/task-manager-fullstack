import{ Router, Request, Response } from 'express';
import chalk from 'chalk';
import { pool } from '../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import "dotenv/config";
const rutasLogin = Router();
const contraseñaToken = process.env.JWT_KEY_VALUE!;
const contraseñaTokenRefresh = process.env.JWT_KEY_VALUE_REFRESH!;
interface DatosRegister {
    nombre: string;
    email: string;
    password: string;
}
rutasLogin.post('/register', async (req: Request, res: Response) => {
    const { nombre, email, password } = req.body as DatosRegister;
    if (!nombre || nombre.length < 3 || !email || !email.includes('@') || password.length < 8) {
        console.log(chalk.red("Error: Credenciales invalidas."));
        return res.status(400).json({error: "Credenciales invalidas."});
    }

    try {

        const [usuarios]: any = await pool.query('SELECT email FROM usuarios WHERE email = ?', [email]);

        if (usuarios.length > 0) {
            console.log(chalk.yellow("Error: Correo existente."));
            return res.status(400).json({error: "Correo ya registrado."});
        }

        const contraseñaHasheada = await bcrypt.hash(password, 10);
        const [resultado]: any = await pool.query('INSERT INTO usuarios (nombre, email, contrasenia) VALUES (?, ?, ?)', [nombre, email, contraseñaHasheada]);

        if(resultado.affectedRows === 0) {
            console.log(chalk.red("Error: Registro no realizado."));
            return res.status(500).json({error: "No se inserto nada."});
        }

        console.log(chalk.green("Usuario registrado con exito."));
        return res.status(201).json({menaje: "Usuario registrado con exito."});

    } catch(error) {

        console.log(chalk.red(`Error: ${error}`));
        return res.status(403).json({error: error});

    }
});

interface DatosLogin {
    email: string;
    password: string;
}
rutasLogin.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body as DatosLogin;
    if (!email || !email.includes('@') || password.length < 8) {
        console.log(chalk.red("Error: Credenciales invalidas."));
        return res.status(401).json({error: "Credenciales invalidas."});
    }

    try {
        const [resultado]: any = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (resultado.length === 0) {
            console.log(chalk.red("Correo o contraseña invalidas."));
            return res.status(403).json({error: "Correo o contraseña invalida."});
        }

        const usuarioEncontrado = resultado[0];
        const comparacion = await bcrypt.compare(password, usuarioEncontrado.contrasenia);
        if (!comparacion) {
            console.log(chalk.red("Coreo o contraseña invalida."));
            return res.status(403).json({error: "Correo o contraseña invalida."});
        }
        const datosUsuario: { id: number; nombre: string; email: string; } = { id: usuarioEncontrado.id, nombre: usuarioEncontrado.nombre, email: usuarioEncontrado.email };
        const token = jwt.sign(datosUsuario, contraseñaToken, { expiresIn: '20m' });
        const tokenRefresh = jwt.sign(datosUsuario, contraseñaTokenRefresh, { expiresIn: '7d' });
        res.cookie('refreshtoken', tokenRefresh, {
            httpOnly: true,
            sameSite: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const [insertarTokenRefresh] = await pool.query('INSERT INTO refresh_tokens (id_usuario, token) VALUES (?, ?)', [datosUsuario.id, tokenRefresh]);
        console.log(chalk.green("Inicio de sesion realizado con exito."));
        return res.status(200).json({
            exito: "Inicio de sesion realizado con exito.",
            nombreUsuario: datosUsuario.nombre,
            idUsuario: datosUsuario.id,
            tokenGenerado: token
        });
    } catch(error) {
        console.log(chalk.red(`Error: ${error}`));
        return res.status(403).json({error: error});
    }
});

rutasLogin.post('/refresh-token', async (req: Request, res: Response) => {
    const token = req.cookies.refreshtoken;
    if (!token) {
        console.log(chalk.red("Error: Acceso no autorizado."));
        return res.status(401).json({error: "Acceso no autorizado."});
    }
    try {
        const [resultado] : any= await pool.query('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
        if (resultado.length === 0) {
            console.log(chalk.red("Token caducado o invalido."));
            return res.status(403).json({error: "Token caducado o invalido."});
        }
        const tokenGuardado = resultado[0];
        const datos = jwt.verify(token, contraseñaTokenRefresh) as { id: number; nombre: string; email: string; };
        const [busquedaUsuario]: any = await pool.query('SELECT id, email, nombre FROM usuarios WHERE id = ?', [datos.id]);
        if(busquedaUsuario.length === 0) {
            console.log(chalk.red("Error: Token de usuario ya no existe."));
            return res.status(404).json({error: "Usuario no encontrado."});
        }
        const usuarioBuscado = busquedaUsuario[0];
        const nuevosDatos = {
            id: usuarioBuscado.id,
            nombre: usuarioBuscado.nombre,
            email: usuarioBuscado.email
        };
        const tokenRegenerado = jwt.sign(nuevosDatos, contraseñaToken, { expiresIn: '20m' });
        console.log(chalk.green("Nuevo token generado con exito."));
        return res.status(200).json({ tokenGenerado: tokenRegenerado });
    } catch(error) {
        console.log(`Error: ${error}`);
        return res.status(403).json({error: error});
    }
});


rutasLogin.post('/logout', async (req: Request, res: Response) => {
    const token = req.cookies.refreshtoken;

    try {
        if (token) {
            await pool.query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
        }

        // Borramos la cookie del navegador
        res.clearCookie('refreshtoken', {
            httpOnly: true,
            sameSite: true,
            secure: true
        });

        console.log(chalk.green("Sesión cerrada con éxito."));
        return res.status(200).json({ exito: "Sesión cerrada correctamente." });

    } catch (error) {
        console.log(chalk.red(`Error en logout: ${error}`));
        return res.status(500).json({ error: "Error interno al cerrar sesión." });
    }
});

rutasLogin.delete("/eliminar-cuenta/:id", async (req: Request, res: Response) => {
    const idUsuario = req.params.id;
    try {
        const [eliminandoCuenta]: any = await pool.query('DELETE FROM usuarios WHERE id = ?', [Number(idUsuario)]);
        if (eliminandoCuenta.affectedRows === 0){
            console.log(chalk.red("No se elimino ninguna cuenta."));
            return;
        }
        console.log(chalk.green("Se elimino la cuenta del usuario con exito."));
        return res.status(200).json({
            exito: "Se elimino la cuenta del usuario con exito"
        });
    } catch(error) {
        console.log(chalk.red("Error: ", error));
        return res.status(500).json({error: error});
    }
})


export default rutasLogin;