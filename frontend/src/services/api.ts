export async function fetchInteligente(url: string, opciones: RequestInit = {}) {
    opciones.credentials = 'include';
    const tokenActual = localStorage.getItem("token");

    opciones.headers = {
        'Content-Type': 'application/json',
        ...(tokenActual ? { 'Authorization': `Bearer ${tokenActual}` } : {}),
        ...opciones.headers 
    };
    let response = await fetch(url, opciones);
    if (response.status === 401 || response.status === 403) {
        console.log("Token caducado");
        const responseRefresh = await fetch("http://localhost:3000/api/auth/refresh-token", {
            method: 'POST',
            credentials: 'include'
        });
        if (responseRefresh.ok) {
            console.log("¡Token actualizado con éxito!");
            const dataRefresh = await responseRefresh.json();
            
            const nuevoToken = dataRefresh.tokenGenerado; 

            localStorage.setItem("token", nuevoToken);

            opciones.headers = {
                ...opciones.headers,
                'Authorization': `Bearer ${nuevoToken}`
            };

            response = await fetch(url, opciones);
        } else {
            window.location.href = "/inicio-sesion";
            localStorage.clear();
            throw new Error ("Sesion totalmente expirada")
        }
    }
    return response;
}