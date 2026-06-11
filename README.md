# Task Management App

Una aplicación web moderna y segura para la gestión de tareas personales, construida con una arquitectura de cliente-servidor desacoplada.

---

## Descripción

Aplicación de gestión de tareas desarrollada con **React**, **Node.js**, **Express** y **MySQL**. El sistema cuenta con un flujo completo de autenticación y persistencia de datos, permitiendo a los usuarios organizar sus pendientes en un entorno protegido y privado.

---

## Características Clave

* **Seguridad Avanzada:** Autenticación robusta basada en tokens con mecanismos de renovación automática.
* **Control Total (CRUD):** Gestión fluida del ciclo de vida completo de tus tareas diarias.
* **Búsqueda Instantánea:** Filtrado dinámico de tareas en tiempo real desde la interfaz.
* **Interfaz Moderna:** Diseño oscuro responsivo construido sobre utilidades de estilizado rápido.

---

## 🔧 Tecnologías Utilizadas

### Frontend
* **React** - Librería para la construcción de interfaces de usuario.
* **TypeScript** - Tipado estático para un código más seguro y mantenible.
* **Tailwind CSS** - Framework de estilos optimizado para diseño rápido.

### Backend
* **Node.js** - Entorno de ejecución para JavaScript en el servidor.
* **Express** - Framework minimalista para la creación de la API REST.
* **JWT (JSON Web Tokens)** - Manejo de sesiones e identidad.
* **bcryptjs** - Encriptación segura de contraseñas en la base de datos.
* **cookie-parser** - Middleware para el manejo y almacenamiento seguro de tokens.

### Base de Datos
* **MySQL** - Sistema de gestión de base de datos relacional para la persistencia.

---

## Funcionalidades Implementadas

### Autenticación y Cuentas
* **Registro de Usuarios:** Creación de nuevas credenciales con hash de contraseña automático.
* **Inicio de Sesión:** Validación e inicio de sesión seguro.
* **Manejo de JWT & Refresh Tokens:** Sesiones seguras mediante tokens de acceso de corta duración y tokens de refresco persistidos adecuadamente.
* **Eliminación de Cuenta:** Opción crítica para borrar definitivamente el perfil y datos asociados.
* **Cierre de Sesión:** Destrucción segura de la sesión tanto en el cliente como en el servidor.

### Gestión de Tareas
* **Crear Tareas:** Formulario validado para registrar nuevas tareas asignando nombre, estado y prioridad.
* **Actualizar Tareas:** Modificación dinámica de los detalles de tareas existentes.
* **Buscar Tareas:** Barra de búsqueda integrada para filtrar por nombre la lista de tareas al instante.
* **Eliminar Tareas:** Remoción de tareas individuales directamente desde la lista de pendientes.

---

### Instalación
# Backend:
```bash
cd backend
npm install
npm run dev
```

# Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Desafíos Técnicos
- Implementación de autenticación JWT
- Gestión de Refresh Tokens persistidos en base de datos.
- Protección de rutas privadas mediante middleware.
- Relación entre usuarios y tareas utilizando claves foráneas.
- Eliminación automática de tareas mediante ON DELETE CASCADE.

---

## Conclusión
Este proyecto me llevo a aprender como unir las piezas para poder realizar un proyecto full stack, a como comunicar mi servidor con mi base de datos, como viajan los datos del servidor al frontend, como se obtiene los datos del fetch y como manejar errores.
Termine aprendiendo como implementar JWT y tambien los Refresh Tokens de manera persistida, logrando tener las sesiones activas durante un tiempo mas prolongado que con un simple token.