import { fetchInteligente } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function VentanaEliminacionCuenta(){
    const idUsuario = localStorage.getItem("id");
    const navigate = useNavigate();

    const eliminarCuenta = async () => {
        try {
            const response = await fetchInteligente(`http://localhost:3000/api/auth/eliminar-cuenta/${idUsuario}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if(!response.ok) {
                throw new Error(data.error || "Hubo un error al querer eliminar la cuenta.");
            }
            navigate("/", { replace: true });
        } catch(error) {
            console.log("Error: ", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("usuarios");
        }
    }

    const volverASeccionTareas = () => window.location.href = "tareas";

    return (
        <div className="bg-slate-900 min-h-screen w-full text-white flex justify-center items-center p-4">
            {/* Tarjeta de Confirmación */}
            <div className="bg-slate-800 w-full max-w-md p-6 rounded-xl border border-red-500/20 shadow-2xl flex flex-col items-center text-center gap-4">
                
                {/* Icono de Advertencia */}
                <div className="w-16 h-16 bg-red-500/10 text-red-500 border border-red-500/30 rounded-full flex items-center justify-center text-3xl mb-2 animate-pulse">
                    ⚠️
                </div>

                {/* Título Principal */}
                <h3 className="text-xl font-bold text-red-400">
                    ¿Estás seguro que deseas eliminar tu cuenta?
                </h3>

                {/* Texto de Advertencia */}
                <p className="text-sm text-gray-400 leading-relaxed">
                    Ten en cuenta que <span className="text-red-400 font-semibold">no hay vuelta atrás</span>. Se borrará la cuenta definitivamente y perderás todas tus tareas registradas.
                </p>

                {/* Contenedor de Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    {/* Botón Peligroso (Eliminar) */}
                    <button 
                        onClick={eliminarCuenta}
                        className="flex-1 bg-red-600 hover:bg-red-500 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                        Sí, eliminar definitivamente
                    </button>

                    {/* Enlace Seguro (Cancelar) */}
                    <button 
                        onClick={volverASeccionTareas}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-gray-200 font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}
