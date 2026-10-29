
const URL_SERVIDOR = "https://api.nova-sync.xyz";

let conexionSSE = null;
let reconexionProgramada = false;

const rutaActual = window.location.pathname;
const esPaginaDesactivada = rutaActual.endsWith("desactivada.html");

function permitirMostrarPagina() {
    document.documentElement.classList.remove("acceso-pendiente");
}

function redirigirSiCorresponde(active) {
    if (!active && !esPaginaDesactivada) {
        window.location.replace("/desactivada.html");
        return;
    }

    if (active && esPaginaDesactivada) {
        window.location.replace("/index.html");
        return;
    }

    permitirMostrarPagina();
}

async function verificarEstadoInicial() {
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

        redirigirSiCorresponde(data.active);
        return true;

    } catch (error) {
        console.error("Error al verificar acceso:", error);

        if (!esPaginaDesactivada) {
            window.location.replace("/desactivada.html");
            return false;
        }

        // Si falla el servidor, mantener visible la página desactivada.
        permitirMostrarPagina();
        return false;
    }
}

function conectarSSE() {
    if (conexionSSE) {
        conexionSSE.close();
    }

    conexionSSE = new EventSource(
        `${URL_SERVIDOR}/api/test-sim-events`
    );

    conexionSSE.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            if (typeof data.active !== "boolean") {
                throw new Error("Estado inválido recibido por SSE");
            }

            redirigirSiCorresponde(data.active);

        } catch (error) {
            console.error("Error al procesar actualización SSE:", error);
        }
    };

    conexionSSE.onerror = () => {
        console.warn("Conexión SSE interrumpida; el navegador intentará reconectar.");
    };
}

async function iniciarGuardia() {
    const estadoVerificado = await verificarEstadoInicial();

    // Solo conectar SSE si la verificación inicial fue correcta.
    if (estadoVerificado) {
        conectarSSE();
    }
}

iniciarGuardia();
