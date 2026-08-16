import { useState, useEffect } from "react";
import { manejoChange } from "../customs/manejoChange";
import { fetchInteligente } from "../services/api";
import { API_URL } from "../services/api";
interface DatosTarea {
    id: number;
    nombre: string;
    estado: string;
    prioridad: string;
    fecha_creacion: string;
}
export default function Tareas() {
    const [nombre, setNombre] = useState<string>("");
    const [prioridad, setPrioridad] = useState<string>("");
    const [estado, setEstado] = useState<string>("");
    const [error, setError] = useState<string|null>(null);
    const [tareas, setTareas] = useState<DatosTarea[]|null>(null);
    const [idActualizar, setIdActualizar] = useState<number|null>(null);
    const nombreUsuario = localStorage.getItem("usuarios");
    const [busqueda, setBusqueda] = useState<string>("");

    const guardarTarea = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(idActualizar !== null) {
            await renderizarTareaActualizada(idActualizar);
            return;
        }

        if (!nombre || !prioridad || !estado) {
            setError("Error: Datos importantes de la tarea inválidos.");
            return;
        }
        
        const datosEnviar = { nombre, prioridad, estado };
        try {
            const peticion = await fetchInteligente(`${API_URL}/api/agregar-tarea`, {
                method: 'POST',
                body: JSON.stringify(datosEnviar),
            });
            const data = await peticion.json();
            if (!peticion.ok) {
                setError(data.error || "Hubo un error al ingresar una nueva tarea.");
            }
            if (tareas !== null) {
                setTareas([...tareas, data.tareaAgregada]);
            }
            setError(null);
            setNombre("");
            setEstado("");
            setPrioridad("");
        } catch(error) {
            console.log("Error:" , error);
        }
    }

    useEffect(() => {
            fetchInteligente(`${API_URL}/api/tareas`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al obtener las tareas de la base de datos.");
                }
                return response.json();
            })
            .then((data) => setTareas(data))
            .catch(error => {
                setError(error.message);
                setTareas([]);
            });
    }, []);

    const eliminarTarea = async (id: number) => {
        try {
            const response = await fetchInteligente(`${API_URL}/api/eliminar-tarea/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                setError(data.error || "Hubo un error al querer eliminar la tarea.");
                return;
            }

            if (tareas) {
                setTareas(tareas.filter((tarea) => tarea.id !== id));
            }
            setError(null);
        } catch(error) {
            console.log("Error: ", error);
        }
    }

    const actualizarTarea = (id: number) => {
        setIdActualizar(id);
        const tareaEncontrada = tareas?.find((tarea) => tarea.id === id);
        if (tareaEncontrada !== undefined) {
            setNombre(tareaEncontrada.nombre);
            setEstado(tareaEncontrada.estado);
            setPrioridad(tareaEncontrada.prioridad);
        }
    }

    const renderizarTareaActualizada = async (idActualizar: number) => {
        const datosEnviar: { nombre: string; estado: string; prioridad: string; } = { nombre, estado, prioridad };
        try {
            const response = await fetchInteligente(`${API_URL}/api/actualizar-tarea/${idActualizar}`, {
                method: 'PUT',
                body: JSON.stringify(datosEnviar)
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Hubo un error a la hora de actualizar la tarea.");
            }
            if (tareas) {
                setTareas(tareas.map((t) => t.id === idActualizar ? {...t, ...datosEnviar} : t));
            }
            setNombre("");
            setEstado("");
            setPrioridad("");
            setIdActualizar(null);
            setError(null);
        } catch(error){
            console.log("Error:", error);
        }
    }

    const tareasFiltradas = tareas?.filter((tarea) => tarea.nombre.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase()));

    const limpiarInputBusqueda = () => setBusqueda("");
    


    return (
        <div className="bg-slate-900 py-3 h-full w-full text-white flex justify-center items-center flex-col">
            <h1 className="text-2xl font-bold capitalize pb-6">Mostrando tareas del usuario 👤: {nombreUsuario}</h1>
            <h2 className="capitalize font-bold text-2xl pb-3">Agregar nueva tarea</h2>
            <form onSubmit={guardarTarea} className="flex flex-col w-full max-w-md p-3 bg-slate-800 rounded gap-4 shadow-xl">
                {/* campo de nombre de la tarea */}
                <label htmlFor="nombre" className="text-lg">Nombre de la tarea: </label>
                <input 
                type="text"
                className="text-lg border p-1 rounded-sm"
                placeholder="Ingrese nombre de la tarea"
                required
                value={nombre}
                onChange={(e) => manejoChange(e, setNombre)}
                />

                {/* campo de eleccion de la prioridad */}
                <label htmlFor="prioridad" className="text-lg">Prioridad: </label>
                <select name="prioridad" id="prioridad" className="text-lg border p-1 rounded-sm" value={prioridad} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPrioridad(e.target.value)}>
                    <option value="" className="text-white bg-slate-900">Seleccione la prioridad...</option>
                    <option value="baja" className="text-white bg-slate-900">Baja</option>
                    <option value="media" className="text-white bg-slate-900">Media</option>
                    <option value="alta" className="text-white bg-slate-900">Alta</option>
                </select>

                {/* campo de eleccion del estado */}
                <label htmlFor="estado" className="text-lg">Estado: </label>
                <select name="estado" id="estado" className="text-lg border p-1 rounded-sm" value={estado} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEstado(e.target.value)}>
                    <option value="" className="text-white bg-slate-900">Seleccion el estado de su tarea...</option>
                    <option value="completada" className="text-white bg-slate-900">Completada</option>
                    <option value="pendiente" className="text-white bg-slate-900">Pendiente</option>
                </select>

                <button type="submit" className="border bg-blue-600 text-black rounded-sm p-1 text-lg hover:bg-blue-400 hover:scale-102 transition-all cursor-pointer duration-300 active:scale-98">{idActualizar !== null ? "Actualizar tarea" : "Agregar nueva tarea"}</button>
            </form>

            {tareas !== null && tareas.length > 0 && <div className="w-1/2 flex justify-center items-center gap-2"><input type="text" placeholder="Buscar tarea 🔎" value={busqueda} onChange={(e) => manejoChange(e, setBusqueda)} className="text-lg border p-1 rounded-sm my-6 w-1/2"/> <button onClick={limpiarInputBusqueda} className="text-gray-500 bg-blue-200 h-8 w-8 cursor-pointer rounded hover:text-white hover:bg-blue-600 active:scale-98 transition-all duration-300">X</button></div>}
            
            {error !== null ? (
                <div className="max-w-md mx-auto p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 font-medium text-center mt-4">
                    {error}
                </div>
            ) : (
                tareas !== null ? (
                    tareasFiltradas?.length === 0 ? (
                        <div className="max-w-md mx-auto p-3 text-gray-300 text-center mt-4">
                            <p className="text-lg font-semibold text-center">No hay tareas agregadas aún.</p>
                            <p className="text-sm text-gray-400">Si deseas agregar una nueva tarea, pon sus datos en el formulario.</p>
                        </div>
                    ) : (
                        <ul className="max-w-md mx-auto mt-4 space-y-2">
                            {tareasFiltradas?.map((tarea) => {
                                const fechaFormateada = new Date(tarea.fecha_creacion).toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                });
                                return <li key={tarea.id} className="bg-slate-800 p-3 rounded border border-slate-700 text-slate-200 flex flex-col gap-3 w-110">
                                    <strong>Nombre de la tarea: {tarea.nombre}</strong> <strong> Estado de la tarea: {tarea.estado} </strong>
                                    <strong> Prioridad de la tarea: {tarea.prioridad} </strong> <strong> Fecha de creación de la tarea: {fechaFormateada} </strong>
                                    <button onClick={() => eliminarTarea(tarea.id)} className="bg-red-500 text-black text-lg font-semibold rounded hover:bg-red-400 hover:scale-102 transition-all cursor-pointer duration-300 active:scale-98">
                                        Quitar tarea ❌
                                    </button>
                                    <button onClick={() => actualizarTarea(tarea.id)} className="bg-green-500 text-white text-lg font-semibold rounded hover:bg-red-400 hover:scale-102 transition-all cursor-pointer duration-300 active:scale-98">
                                        Actualizar tarea
                                    </button>
                                </li>
                            })}
                        </ul>
                    )
                ) : (
                    <p className="text-center text-gray-400 mt-4">Cargando tareas...</p>
                )
)}
        </div>
    )
}