import { Router, Request, Response } from 'express';
import { vigilante } from '../middlewares/auth.middleware';
import { pool } from '../config/db';
import chalk from 'chalk';
const rutas = Router();
rutas.use(vigilante);
rutas.get('/api/tareas', async (req: Request, res: Response) => {
    const id = (req as any).datosUsuario.id;
    try {
        const [resultado]: any = await pool.query('SELECT id, nombre, estado, prioridad, fecha_creacion FROM tareas WHERE id_usuario = ?', [id]);
        console.log(chalk.green("Mostrando tareas al usuario..."));
        return res.status(200).json(resultado);
    } catch (error) {
        console.log(chalk.red(`Error: ${error}`));
        return res.status(500).json({error: error});
    }
});

interface NuevaTarea {
    nombre: string;
    estado: string;
    prioridad: string;
}

rutas.post('/api/agregar-tarea', async (req: Request, res: Response) => {
    const { nombre, estado, prioridad } = req.body as NuevaTarea;
    if (!nombre || !estado || !prioridad) {
        console.log(chalk.red("Datos invalidos."));
        return res.status(400).json({error: "Datos invalidos para agregar la nueva tarea."});
    }
    const id = (req as any).datosUsuario.id;
    try {
        const [resultado]: any = await pool.query('INSERT INTO tareas (id_usuario, nombre, estado, prioridad) VALUES (?, ?, ?, ?)', [id, nombre, estado, prioridad]);
        if (resultado.affectedRows === 0) {
            console.log(chalk.yellow("Tarea no ingresada correctamente."));
            return res.status(401).json({error: "Fallo al intentar ingresar una nueva tarea."});
        }
        console.log(chalk.green("Tarea agregada con exito"));
        const [tarea]: any = await pool.query('SELECT * FROM tareas WHERE nombre = ?', [nombre]);
        if (tarea.length === 0) {
            console.log(chalk.red("Error: Datos de tarea no obtenidos de manera eficiente."));
            return;
        }
        return res.status(201).json({exito: "Tarea agregada a la base de datos con exito.", tareaAgregada: tarea[0]});
    } catch(error) {
        console.log(chalk.red(`Error: ${error}`));
        return res.status(500).json({errro: error});
    }
});


rutas.delete('/api/eliminar-tarea/:id', async (req: Request, res: Response) => {
    const idParams = req.params.id;
    const idUsuario = (req as any).datosUsuario.id;
    try {
        const [resultado]: any = await pool.query('DELETE FROM tareas WHERE id = ? AND id_usuario = ?', [Number(idParams), idUsuario]);
        if (resultado.affectedRows === 0){
            console.log(chalk.red("No se elimino ninguna tarea."));
            return res.status(400).json({error: "No se llego a eliminar ninguna tarea."});
        }
        console.log(chalk.green("Se elimino la tarea correctamente."));
        return res.status(200).json({mensaje: "Tarea eliminada con exito."});
    } catch(error){
        console.log(chalk.red(`Error: ${error}`));
        return res.status(500).json({error: error});
    }
});

interface TareaActualizar {
    nombre:string;
    estado:string;
    prioridad:string;
}
rutas.put('/api/actualizar-tarea/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const { nombre, estado, prioridad } = req.body as TareaActualizar;
    const idUsuario = (req as any).datosUsuario.id;
    try {
        const [resultado]: any = await pool.query('UPDATE tareas SET nombre = ?, estado = ?, prioridad = ? WHERE id = ? AND id_usuario = ?', [nombre, estado, prioridad, Number(id), idUsuario]);
        if (resultado.affectedRows === 0) {
            console.log(chalk.red("No se ha actualizado ninguna tarea."));
            return res.status(400).json({error: "No se actualizo ninguna tarea."});
        }
        console.log(chalk.green("Tarea actualizada con exito."));
        return res.status(200).json({mensaje: "Tarea actualizada con exito."});
    } catch(error) {
        console.log(chalk.red(`Error: ${error}`));
        return res.status(500).json({error: error});
    }
});

rutas.delete('/api/eliminar-tareas', async (req: Request, res: Response) => {
    const { id: idUsuario} = (req as any).datosUsuario;
    try {
        const [resultado] = await pool.query('DELETE FROM tareas WHERE id_usuario = ?', [idUsuario]);
        console.log(chalk.green("Tareas eliminadas con exito."));
        return res.status(200).json({mensaje: "Tareas eliminadas con exito."});
    } catch(error){
        console.log(chalk.red(`Error: ${error}`));
        return res.status(500).json({error: error});
    }
});

export default rutas;