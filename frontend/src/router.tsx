import { createBrowserRouter } from "react-router-dom";
import Bienvenida from "./pages/Bienvenida";
import FormLogin from "./pages/Login";
import FormRegister from "./pages/Register";
import VentanaEliminacionCuenta from "./pages/EliminarCuenta";
import Layout from "./pages/Layout";
import Tareas from "./pages/Tareas";
import Inicio from "./pages/Inicio";

export const miMapa = createBrowserRouter([
    {
        path: "/",
        element: <Bienvenida />
    },
    {
        path: "/inicio-sesion",
        element: <FormLogin />
    },
    {
        path: "/registro",
        element: <FormRegister />
    },
    {
        path: "/layout",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Inicio />
            },
            {
                path: "tareas",
                element: <Tareas />
            },
            {
                path: "eliminar-cuenta",
                element: <VentanaEliminacionCuenta />
            }
        ]
    }
])