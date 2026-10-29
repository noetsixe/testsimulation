
const URL_SERVIDOR = "https://api.nova-sync.xyz";

let verificandoAcceso = false;

async function verificarAccesoExamen() {
    // Evitar que se ejecuten varias consultas simultáneamente
    if (verificandoAcceso) return;

    verificandoAcceso = true;

    const rutaActual = window.location.pathname;
    const esPaginaDesactivada = rutaActual.endsWith("desactivada.html");

    try {
        // Consultar el estado actual del Test Simulation en el servidor
        const res = await fetch(
            `${URL_SERVIDOR}/api/test-sim-status?t=${Date.now()}`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        // Mostrar el error real si el servidor responde con un código incorrecto
        if (!res.ok) {
            const detalle = await res.text();

            console.error(
                "Error consultando el estado del Test Simulation:",
                res.status,
                detalle
            );

            return;
        }

        const data = await res.json();

        // Comprobar que el servidor devuelva un estado válido
        if (typeof data.active !== "boolean") {
            console.error(
                "El servidor no devolvió un estado válido:",
                data
            );

            return;
        }

        const activo = data.active;

        console.log(
            "Estado actual del Test Simulation:",
            activo
        );

        // Si está APAGADO, bloquear el acceso a las demás páginas
        if (!activo && !esPaginaDesactivada) {
            window.location.replace("desactivada.html");
            return;
        }

        // Si está ENCENDIDO y el usuario está en desactivada.html,
        // permitirle volver al index
        if (activo && esPaginaDesactivada) {
            window.location.replace("index.html");
            return;
        }

    } catch (error) {
        console.error(
            "Error al verificar el acceso al simulador:",
            error
        );

    } finally {
        verificandoAcceso = false;
    }
}

// Comprobar el estado al cargar la página
verificarAccesoExamen();

// Volver a comprobar cada 5 segundos
setInterval(verificarAccesoExamen, 5000);
