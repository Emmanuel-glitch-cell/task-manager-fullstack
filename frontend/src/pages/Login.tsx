import { useState } from "react";
import { manejoChange } from "../customs/manejoChange";
import Button from "../components/Button";
import { useNavigate, Link } from "react-router-dom";
export default function FormLogin() {
    // variables que usare para guardar los datos del usuario
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [login, setLogin] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const navigate = useNavigate();

    // Funcion principal que realiza el fetch o peticion http
    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Valido si el email y password son validos
        if (!email || !password) {
            return;
        }

        // Creo un objeto con los datos del usuario a enviar
        const datosEnviar: { email: string; password: string; } = {
            email: email,
            password: password
        };

        // Manejo la peticion fetch
        try {
            // Realizo la peticion y sus configuraciones basicas
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(datosEnviar),
                credentials: 'include'
            });
            // Convierto la respuesta en json
            const data = await response.json();
            // Verifico si la respuesta salio bien o no
            if (!response.ok) {
                setError(data.error || "Hubo un error al iniciar sesion");
                return;
            }
            localStorage.setItem("usuarios", data.nombreUsuario);
            localStorage.setItem("token", data.tokenGenerado);
            localStorage.setItem("id", data.idUsuario);
            setLogin(true);
            setError(null);
            setEmail("");
            setPassword("");
            navigate("/layout");
        // De no hacerlo, salta al catch
        } catch(error) {
            console.log("Error:" , error);
            setError("No se pudo conectar con el servidor");
            setLogin(false);
        }
    }

    // Contenido HTML 
    return (
        <div className="bg-slate-900 h-screen w-full text-white flex justify-center items-center flex-col">
            <form onSubmit={enviarDatos} className="flex flex-col w-full max-w-md p-3 bg-slate-800 rounded gap-4 shadow-xl">
                {/* subtitulo de formulario */}
                <h2 className="text-2xl font-bold text-center mb-2">Inicia Sesion</h2>

                {/* campo de email */}
                <label htmlFor="email" className="text-lg">Email: </label>
                <input 
                id="email"
                className="text-lg border p-1 rounded-sm"
                type="email"
                required 
                placeholder="Tú correo electronico"
                value={email}
                onChange={(e) => manejoChange(e, setEmail)}
                />

                {/* campo de contraseña/password */}
                <label htmlFor="password" className="text-lg">Crea tu contraseña: </label>
                <input 
                id="password"
                className="text-lg border p-1 rounded-sm"
                type="password"
                required 
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => manejoChange(e, setPassword)}
                />

                {/* Boton para enviar datos */}
                <Button texto="Iniciar Sesion" />
            </form>

            <Link to="/" className="bg-blue-700 rounded text-lg p-2 mt-3 cursor-pointer hover:bg-blue-500 hover:scale-101 active:scale-98 transition-all duration-300">Volver hacia atras</Link>

            {login && <p className="text-green-500 font-bold uppercase">Iniciando sesion...</p>}

            {error !== null && <p className="text-red-500 font-bold uppercase">Error: {error}</p>}
        </div>
    )
}