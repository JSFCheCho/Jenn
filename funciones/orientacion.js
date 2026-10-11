(function () {

    const VERSION = "v3";


    const LIMITE_CELULAR = 926;

    const ANCHO_MINIMO = 951;
    const ALTO_MINIMO = 601;

    // Cuánto más grande debe ser la ventana real que la zona visible
    // para considerar que hay zoom (1.2 = 120 %).
    const UMBRAL_ZOOM = 1.2;

    // Zoom del navegador al momento de cargar la página
    const DPR_INICIAL = window.devicePixelRatio;


    /* ============================================================
       OVERLAY
       ============================================================ */

    function crearOverlay() {

        if (document.querySelector(".overlay-rotacion")) {
            return;
        }

        const overlay = document.createElement("div");

        overlay.className = "overlay-rotacion";

        overlay.innerHTML = `
            <div class="icono-rotar">↻</div>

            <h2 class="mensaje-orientacion"></h2>

            <p class="texto-orientacion"></p>
        `;

        document.body.appendChild(overlay);
    }

    function mostrarOverlay(icono, titulo, texto, modoEscritorio) {

        const overlay = document.querySelector(".overlay-rotacion");

        if (!overlay) {
            return;
        }

        overlay.classList.toggle("modo-escritorio", modoEscritorio);

        overlay.querySelector(".icono-rotar").textContent = icono;
        overlay.querySelector(".mensaje-orientacion").textContent = titulo;
        overlay.querySelector(".texto-orientacion").textContent = texto;

        document.body.classList.add("bloqueo-rotacion");
    }

    function ocultarOverlay() {

        const overlay = document.querySelector(".overlay-rotacion");

        document.body.classList.remove("bloqueo-rotacion");

        if (overlay) {
            overlay.classList.remove("modo-escritorio");
        }
    }


    /* ============================================================
       DETECCIÓN
       ============================================================ */

    function esCelular() {

        const tactil = window.matchMedia("(pointer: coarse)").matches;

        const ladoMayor = Math.max(window.innerWidth, window.innerHeight);

        return tactil && ladoMayor <= LIMITE_CELULAR;
    }

    function celularHorizontal() {

        return esCelular() && window.innerWidth > window.innerHeight;
    }

    function esEscritorio() {

        const mouse = window.matchMedia("(pointer: fine)").matches;
        const hover = window.matchMedia("(hover: hover)").matches;

        return mouse && hover;
    }

    // ¿La zona visible de la página es muy chica para el diseño?
    // (Esto sí baja cuando haces zoom, y es justo lo que importa
    // para saber si la página cabe o no.)
    function viewportInsuficiente() {

        return (
            window.innerWidth < ANCHO_MINIMO ||
            window.innerHeight < ALTO_MINIMO
        );
    }

    // Zoom estimado comparando la ventana real con la zona visible.
    // Se toma el menor de los dos cocientes para que un panel de
    // DevTools acoplado no se confunda con zoom.
    function zoomPorVentana() {

        const ow = window.outerWidth;
        const oh = window.outerHeight;
        const iw = window.innerWidth;
        const ih = window.innerHeight;

        if (!ow || !oh || !iw || !ih) {
            return 1;
        }

        return Math.min(ow / iw, oh / ih);
    }

    // ¿El usuario tiene zoom? Se usan dos señales:
    // 1) El zoom subió desde que cargó la página (devicePixelRatio).
    // 2) La página ya cargó con zoom (la ventana real es bastante
    //    más grande que la zona visible).
    function zoomDetectado() {

        if (window.devicePixelRatio > DPR_INICIAL + 0.01) {
            return true;
        }

        return zoomPorVentana() > UMBRAL_ZOOM;
    }


    /* ============================================================
       EVALUACIÓN
       ============================================================ */

    function evaluar() {

        // 1) Celular en horizontal
        if (celularHorizontal()) {

            mostrarOverlay(
                "↻",
                "Gira tu celular",
                "Esta página está diseñada para verse en posición vertical. Por favor gira tu pantalla.",
                false
            );

            return;
        }

        // 2) Escritorio: solo avisa si la página realmente no cabe,
        //    y el mensaje depende de la causa
        if (esEscritorio() && viewportInsuficiente()) {

            if (zoomDetectado()) {

                mostrarOverlay(
                    "🔍",
                    "Estás usando mucho zoom",
                    "Restablece el zoom del navegador para continuar. Si estás usando zoom, restablécelo con Ctrl + EL numero Cero (0).",
                    true
                );

                return;
            }

            mostrarOverlay(
                "⛶",
                "Maximiza la ventana",
                "Esta página está diseñada para verse a pantalla completa. Maximiza la ventana del navegador para continuar. Si estás usando zoom, restablécelo con Ctrl + EL numero Cero (0).",
                true
            );

            return;
        }

        ocultarOverlay();
    }


    /* ============================================================
       INICIO
       ============================================================ */

    function iniciar() {

        crearOverlay();

        evaluar();
    }

    if (document.readyState === "loading") {

        document.addEventListener("DOMContentLoaded", iniciar);

    } else {

        iniciar();
    }

    // Cambiar el zoom también dispara "resize"
    window.addEventListener("resize", evaluar);
    window.addEventListener("orientationchange", evaluar);


    /* ============================================================
       DIAGNÓSTICO
       En la consola:  console.table(orientacionDebug())
       ============================================================ */

    window.orientacionDebug = function () {

        return {
            version: VERSION,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            dpr: window.devicePixelRatio,
            dprInicial: DPR_INICIAL,
            zoomPorVentana: Number(zoomPorVentana().toFixed(2)),
            esEscritorio: esEscritorio(),
            viewportInsuficiente: viewportInsuficiente(),
            zoomDetectado: zoomDetectado()
        };
    };

    console.info("orientacion.js " + VERSION + " cargado");

})();