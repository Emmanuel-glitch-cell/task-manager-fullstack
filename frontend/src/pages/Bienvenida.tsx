import { Link } from "react-router-dom";
export default function Bienvenida() {
    return (
        <div className="bg-slate-900 h-screen w-full text-white flex justify-center items-center flex-col px-4">
            <span className="text-5xl animate-bounce duration-1000 mt-2">⚡</span>
            <h1 className="text-3xl font-black uppercase tracking-wide bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">App inteligente de tareas</h1>
            <h2 className="text-lg font-bold text-slate-200 leading-snug px-2">¡Bienvenido a tu app de tareas inteligente! Organiza tus responsabilidades, domina tu día.</h2>
            <p className="text-base text-slate-400 leading-relaxed px-4">Un gestor de tareas ligero y eficiente que te ayuda a organizar tus actividades diarias en segundos. Clasifica tus deberes según su prioridad, realiza un seguimiento de su estado en tiempo real y mantén tu productividad al máximo sin complicaciones.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 w-full">
                <Link to="/inicio-sesion" className="w-full sm:w-auto border bg-blue-600 text-black font-bold rounded-sm p-2.5 text-base hover:bg-blue-400 hover:scale-102 transition-all cursor-pointer duration-300 active:scale-98 text-center px-6 shadow-md">Iniciar sesion con tu cuenta</Link>
                <Link to="/registro" className="w-full sm:w-auto border border-slate-600 bg-slate-700/30 text-slate-300 font-semibold rounded-sm p-2.5 text-base hover:bg-slate-700 hover:text-white hover:scale-102 transition-all cursor-pointer duration-300 active:scale-98 text-center px-6">¿No tienes cuenta? Registrate rapido, sin costos</Link>
            </div>
        </div>
    )
}