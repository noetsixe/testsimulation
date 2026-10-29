// guard.js - Monitorea exclusivamente el estado del Simulador de Examen
const URL_SERVIDOR = "https://api.nova-sync.xyz";

async function verificarAccesoExamen() {
    const esPaginaDesactivada = window.location.pathname.endsWith('desactivada.html');

    try {
        // Consultamos el endpoint dedicado exclusivamente al test simulation
        const res = await fetch(`${URL_SERVIDOR}/api/admin/test-sim-status?t=${Date.now()}`);
        const data = await res.json();
        const activo = data.active; // true o false específico del simulador

        if (!activo && !esPaginaDesactivada) {
            // Si el simulador está apagado, redirige a la pantalla de mantenimiento/desactivada
            window.location.href = 'desactivada.html';
        } else if (activo && esPaginaDesactivada) {
            // Si lo vuelven a encender, saca al usuario de desactivada y lo regresa al inicio
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error("Error al verificar el acceso al simulador:", e);
    }
}

verificarAccesoExamen();
