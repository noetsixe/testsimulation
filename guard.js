
const URL_SERVIDOR = "https://api.nova-sync.xyz";

let verificandoAcceso = false;

async function verificarAccesoExamen() {
    if (verificandoAcceso) return;

    verificandoAcceso = true;

    const rutaActual = window.location.pathname;
    const esPaginaDesactivada = rutaActual.endsWith("/desactivada.html")
        || rutaActual.endsWith("desactivada.html");

    try {
        const res = await fetch(
            `${URL_SERVIDOR}/api/test-sim-status?t=${Date.now()}`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!res.ok) {
            throw new Error(`El servidor respondió con HTTP ${res.status}`);
        }

        const data = await res.json();

        if (typeof data.active !== "boolean") {
            throw new Error("El servidor devolvió un estado inválido");
        }

        const activo = data.active;

        console.log("Estado actual del Test Simulation:", activo);

        // APAGADO: cualquier página debe llevar a desactivada.html.
        if (!activo && !esPaginaDesactivada) {
            window.location.replace("/desactivada.html");
            return;
        }

        // ENCENDIDO: si está en desactivada.html, volver al index.
        if (activo && esPaginaDesactivada) {
            window.location.replace("/index.html");
            return;
        }

    } catch (error) {
        console.error(
            "No se pudo verificar el acceso al Test Simulation:",
            error
        );

        // Si no se puede verificar el estado, bloquear el acceso.
        if (!esPaginaDesactivada) {
            window.location.replace("/desactivada.html");
        }

    } finally {
        verificandoAcceso = false;
    }
}

verificarAccesoExamen();

setInterval(verificarAccesoExamen, 5000);
