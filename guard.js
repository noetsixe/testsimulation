const URL_SERVIDOR = "https://api.nova-sync.xyz";

async function verificarAccesoExamen() {
    const esPaginaDesactivada = window.location.pathname.endsWith('desactivada.html');

    try {
        // Consulta directa al backend para leer el id: 2 de Supabase
        const res = await fetch(`${URL_SERVIDOR}/api/test-sim-status?t=${Date.now()}`);
        if (!res.ok) return;
        
        const data = await res.json();
        const activo = data.active; // true o false

        console.log("Estado actual del Test Simulation:", activo);

        // REGLA ESTRICTA DE REDIRECCIÓN
        if (!activo && !esPaginaDesactivada) {
            // Si está apagado (false) y estás en el sitio -> te manda a desactivada
            window.location.href = 'desactivada.html';
        } else if (activo && esPaginaDesactivada) {
            // Si está encendido (true) y estabas atrapado en desactivada -> te libera al index
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error("Error al verificar el acceso al simulador:", e);
    }
}

// Ejecutar al cargar la página
verificarAccesoExamen();

// Opcional: Volver a verificar cada 5 segundos por si el admin lo enciende mientras tienes la pestaña abierta
setInterval(verificarAccesoExamen, 5000);
