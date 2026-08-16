import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

export default function Layout() {
    return (
        <div className="bg-slate-950 min-h-screen w-full text-white flex flex-col">
            {/* El NavBar se queda fijo arriba */}
            <NavBar />
            
            {/* El contenido de las tareas se inyecta limpio aquí abajo */}
            <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}