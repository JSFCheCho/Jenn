(function () {

    const LIMITE_CELULAR = 926;
    const ALTURA_MINIMA = 601;
    const ANCHO_MINIMO = 460;
    const ANCHO_MAXIMO = 767;


    function crearOverlay() {

        if (document.querySelector(".overlay-rotacion")) {
            return;
        }

        const overlay = document.createElement("div");

        overlay.className = "overlay-rotacion";

        overlay.innerHTML = `
            <div class="icono-rotar">↻</div>

            <h2 class="mensaje-orientacion">
                Gira tu celular
            </h2>

            <p class="texto-orientacion">
                Esta página está diseñada para verse
                en posición vertical.
                Por favor gira tu pantalla.
            </p>
        `;

        document.body.appendChild(overlay);
    }


    function esCelular() {

        const tactil =
            window.matchMedia("(pointer: coarse)").matches;

        const ladoMayor =
            Math.max(
                window.innerWidth,
                window.innerHeight
            );

        return tactil && ladoMayor <= LIMITE_CELULAR;
    }


    function celularHorizontal() {

        return (
            esCelular() &&
            window.innerWidth > window.innerHeight
        );
    }


    function esEscritorio() {

        const mouse =
            window.matchMedia("(pointer: fine)").matches;

        const hover =
            window.matchMedia("(hover: hover)").matches;

        return mouse && hover;
    }


    function ventanaPequena() {

        const ancho = window.innerWidth;
        const alto = window.innerHeight;


        if (alto <= 600) {
            return true;
        }

        if (
            ancho >= ANCHO_MINIMO &&
            ancho <= ANCHO_MAXIMO
        ) {
            return true;
        }


        return false;
    }


    function evaluar() {

        const overlay =
            document.querySelector(".overlay-rotacion");

        if (!overlay) {
            return;
        }


        if (celularHorizontal()) {

            overlay.classList.remove(
                "modo-escritorio"
            );

            overlay.querySelector(
                ".icono-rotar"
            ).textContent = "↻";

            overlay.querySelector(
                ".mensaje-orientacion"
            ).textContent =
                "Gira tu celular";

            overlay.querySelector(
                ".texto-orientacion"
            ).textContent =
                "Esta página está diseñada para verse en posición vertical. Por favor gira tu pantalla.";

            document.body.classList.add(
                "bloqueo-rotacion"
            );

            return;
        }

        if (
            esEscritorio() &&
            ventanaPequena()
        ) {

            overlay.classList.add(
                "modo-escritorio"
            );

            overlay.querySelector(
                ".icono-rotar"
            ).textContent = "⛶";

            overlay.querySelector(
                ".mensaje-orientacion"
            ).textContent =
                "Maximiza la ventana";

            overlay.querySelector(
                ".texto-orientacion"
            ).textContent =
                "Esta página está diseñada para verse a pantalla completa. Maximiza la ventana del navegador para continuar.";

            document.body.classList.add(
                "bloqueo-rotacion"
            );

            return;
        }

        document.body.classList.remove(
            "bloqueo-rotacion"
        );

        overlay.classList.remove(
            "modo-escritorio"
        );
    }


    function iniciar() {

        crearOverlay();

        evaluar();
    }


    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            iniciar
        );

    } else {

        iniciar();

    }


    window.addEventListener(
        "resize",
        evaluar
    );

    window.addEventListener(
        "orientationchange",
        evaluar
    );

})();