import React, { useState } from "react";
import { manejoChange } from "../customs/manejoChange";
import Button from "../components/Button";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../services/api";
export default function FormRegister() {
    const [nombre, setNombre] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [registro, setRegistro] = useState<boolean>(false);
    const [error, setError] = useState<string|null>(null);
    const navigate = useNavigate();
    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!nombre || !email || !password) {
            return;
        }
        const datosEnviar: { nombre: string; email: string; password: string; } = {
            nombre: nombre,
            email: email,
            password: password
        };

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(datosEnviar),
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || "Hubo un error con el registro");
                return;
            }
            setRegistro(true);
            setError(null);
            setNombre("");
            setEmail("");
            setPassword("");
            navigate("/inicio-sesion");
            
        } catch (error) {
            console.log("Error: ",error);
        }
        
    }
    return (
        <div className="bg-slate-900 h-screen w-full text-white flex justify-center items-center flex-col">
            <form onSubmit={enviarDatos} className="flex flex-col w-full max-w-md p-3 bg-slate-800 rounded gap-4 shadow-xl">
                {/* subtitulo de formulario */}
                <h2 className="text-2xl font-bold text-center mb-2">Crear Cuenta</h2>

                {/* campo de nombre */}
                <label htmlFor="nombre" className="text-lg">Nombre: </label>
                <input 
                id="nombre"
                className="text-lg border p-1 rounded-sm"
                type="text" 
                required
                placeholder="Tú nombre"
                value={nombre}
                onChange={(e) => manejoChange(e, setNombre)}
                />

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
                placeholder="Crea tu contraseña"
                value={password}
                onChange={(e) => manejoChange(e, setPassword)}
                />

                {/* Boton para enviar datos */}
                <Button texto={registro ? "Registrado ✅" : "Registrarse"} />
            </form>
            <Link to="/" className="bg-blue-700 rounded text-lg p-2 mt-3 cursor-pointer hover:bg-blue-500 hover:scale-101 active:scale-98 transition-all duration-300">Volver hacia atras</Link>

            {registro && <p className="text-green-700 font-bold uppercase">Nuevo usuario registrado con exito en la base de datos.</p>}

            {error !== null && <p className="text-red-500 font-bold uppercase">Error: {error}</p>}
        </div>
    )
}

// Logica de la eliminacion de cuenta
// Primero tengo que crear una ruta en el servidor, que sirva para poder eliminar la cuenta
// Tengo que consultar a la base de datos, obteniendo el id del usuario para poder eliminarlo
// Este id lo puedo obtener de los datos enviados del usuario