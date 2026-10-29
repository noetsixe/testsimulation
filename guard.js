// guard.js - Controla la redirección del simulador en tiempo real
const URL_SERVIDOR = "https://api.nova-sync.xyz"; // Tu servidor actual

async function verificarAccesoExamen() {
    const esPaginaDesactivada = window.location.pathname.endsWith('desactivada.html');

    try {
        // Consultamos el estado actual al servidor (que lee Supabase)
        const res = await fetch(`${URL_SERVIDOR}/api/admin/server-status?t=${Date.now()}`);
        const data = await res.json();
        const activo = data.active; // true o false

        if (!activo && !esPaginaDesactivada) {
            // Si está apagado, redirige a la página de dominio en venta
            window.location.href = 'desactivada.html';
        } else if (activo && esPaginaDesactivada) {
            // Si se vuelve a encender y estaban en la página desactivada, los regresa al inicio
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error("Error al verificar el estado del simulador:", e);
    }
}

verificarAccesoExamen();
