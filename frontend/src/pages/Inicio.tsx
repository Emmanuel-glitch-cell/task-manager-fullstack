export default function Inicio(){
    const nombreUsuario = localStorage.getItem("usuarios");
    return (
        <div >
            <h2 className="font-semibold text-3xl py-5">Bienvenido a tu app inteligente de tareas {nombreUsuario}, es un placer tenerte aqui, espero que tu experiencia con nuestra app sea excelente. <span className="text-blue-300">¿Listo/a para iniciar a gestionar tus deberes?</span> Haz click en la seccion de tareas arriba en la parte derecha para poder iniciar.</h2>
        </div>
    )
}