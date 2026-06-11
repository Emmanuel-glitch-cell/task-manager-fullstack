import { Link, useNavigate } from "react-router-dom";
import { API_URL, fetchInteligente } from "../services/api";

export default function NavBar() {
    const navigate = useNavigate();
    const cerrarSesion = async () => {
        try {
            const response = await fetchInteligente(`${API_URL}/api/auth/logout`, {
                method: 'POST'
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Hubo un error al querer cerrar sesion.");
            }

            navigate("/", { replace: true });
        } catch(error) {
            console.log("Error: ", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("usuarios");
        }
    }


    return (
        <nav className="w-full bg-slate-800 border-b border-slate-700/60 px-6 py-4 flex justify-between items-center shadow-lg">
            
            {/* Logo o Nombre de la App a la izquierda */}
            <div className="flex items-center gap-2">
                <span className="text-xl">📋</span>
                <span className="font-black tracking-wider text-lg bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    TASKFLOW
                </span>
            </div>

            {/* Tus dos únicos enlaces de interacción a la derecha */}
            <div className="flex items-center gap-6">
                <Link 
                    to=""
                    className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors duration-200"
                >
                    Inicio
                </Link>

                <Link 
                    to="tareas" 
                    className="text-sm font-medium text-slate-200 hover:text-blue-400 transition-colors duration-200"
                >
                    Sección Tareas
                </Link>

                <Link 
                    to="eliminar-cuenta"
                    className="text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded transition-all duration-200"
                >
                    Eliminar cuenta
                </Link>

                <button
                    onClick={cerrarSesion}
                    className="text-sm font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded transition-all duration-200"
                >
                    Logout 🔙
                </button>
            </div>
            
        </nav>
    );
}