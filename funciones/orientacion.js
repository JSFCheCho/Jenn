(function () {


    const ALTURA_MAXIMA_CELULAR = 600;

    function crearOverlay() {

        if (document.querySelector(".overlay-rotacion")) {
            return;
        }

        const overlay = document.createElement("div");

        overlay.className = "overlay-rotacion";

        overlay.innerHTML = `
            <div class="icono-rotar">↻</div>

            <h2>Gira tu celular</h2>

            <p>
                Esta página está diseñada para verse
                en posición vertical.
                Por favor gira tu pantalla.
            </p>
        `;

        document.body.appendChild(overlay);
    }


    function evaluarOrientacion() {

        const ancho = window.innerWidth;
        const alto = window.innerHeight;

        /*
         * Teléfono horizontal:
         *
         * ancho > alto
         * y la altura es pequeña
         */
        const celularHorizontal =
            ancho > alto &&
            alto <= ALTURA_MAXIMA_CELULAR;


        document.body.classList.toggle(
            "bloqueo-rotacion",
            celularHorizontal
        );

    }


    function iniciar() {

        crearOverlay();
        evaluarOrientacion();

    }


    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciar
        );

    } else {

        iniciar();

    }


    window.addEventListener(
        "resize",
        evaluarOrientacion
    );


    window.addEventListener(
        "orientationchange",
        evaluarOrientacion
    );

})();