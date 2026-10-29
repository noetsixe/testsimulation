const URL_SERVIDOR = "https://api.nova-sync.xyz";

let verificandoAcceso = false;

async function verificarAccesoExamen() {
    if (verificandoAcceso) return;
    verificandoAcceso = true;

    const rutaActual = window.location.pathname;
    const esPaginaDesactivada = rutaActual.endsWith("desactivada.html");

    try {
        const res = await fetch(
            `${URL_SERVIDOR}/api/test-sim-status?t=${Date.now()}`,
            { method: "GET", cache: "no-store" }
        );

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        if (typeof data.active !== "boolean") {
            throw new Error("Estado inválido del servidor");
        }

        if (!data.active && !esPaginaDesactivada) {
            window.location.replace("/desactivada.html");
            return;
        }

        if (data.active && esPaginaDesactivada) {
            window.location.replace("/index.html");
            return;
        }

        // El estado permite mostrar esta página.
        document.documentElement.classList.remove("acceso-pendiente");

    } catch (error) {
        console.error("Error al verificar acceso:", error);

        if (!esPaginaDesactivada) {
            window.location.replace("/desactivada.html");
            return;
        }

        // Si falla el servidor, mostrar la página desactivada.
        document.documentElement.classList.remove("acceso-pendiente");

    } finally {
        verificandoAcceso = false;
    }
}

verificarAccesoExamen();
setInterval(verificarAccesoExamen, 5000);
