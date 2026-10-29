const URL_SERVIDOR = "https://api.nova-sync.xyz";

async function verificarAccesoExamen() {
    const esPaginaDesactivada = window.location.pathname.endsWith('desactivada.html');

    try {
        const res = await fetch(`${URL_SERVIDOR}/api/admin/test-sim-status?t=${Date.now()}`);
        if (!res.ok) {
            // Por seguridad, si el servidor no responde, mandamos a desactivada
            if (!esPaginaDesactivada) window.location.href = 'desactivada.html';
            return;
        }
        
        const data = await res.json();
        const activo = data.active; // true o false

        // REGLA DE ACCESO
        if (!activo && !esPaginaDesactivada) {
            // Si está en false (apagado) y estás intentando ver el sitio normal -> fuera a desactivada.html
            window.location.href = 'desactivada.html';
        } else if (activo && esPaginaDesactivada) {
            // Si está en true (encendido) y estabas atrapado en desactivada.html -> te devuelve al index
            window.location.href = 'index.html';
        }
    } catch (e) {
        console.error("Error al verificar el acceso:", e);
        if (!esPaginaDesactivada) {
            window.location.href = 'desactivada.html';
        }
    }
}

verificarAccesoExamen();
