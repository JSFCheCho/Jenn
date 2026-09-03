

(function () {

    const blogData = [

        // ---------- Bloque 1: primeras 4, visibles apenas carga la página ----------
        { img: "imagenes/blog/blog%201.png", href: "https://razonpublica.com/incertidumbre-financiera-la-reforma-pendiente-la-educacion-superior-publica/", alt: "Entrada de blog 1" }, // TODO: reemplazar img y href
        { img: "imagenes/blog/blog%202.png", href: "https://razonpublica.com/quien-responsable-la-crisis-la-salud/", alt: "Entrada de blog 2" }, // TODO: reemplazar img y href
        { img: "imagenes/blog/blog%203.png", href: "https://razonpublica.com/paso-adelante-dos-atras/", alt: "Entrada de blog 3" }, // TODO: reemplazar img y href

    ];

    const ITEMS_POR_TANDA = 4;
    let mostrados = 0;

    let galeria = null;
    let botonCargarMas = null;

    function crearTarjeta(item) {
        const a = document.createElement("a");
        a.className = "blog-item";
        a.href = item.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const img = document.createElement("img");
        img.src = item.img;
        img.alt = item.alt || "";
        img.loading = "lazy";

        a.appendChild(img);
        return a;
    }

    function mostrarSiguienteTanda() {
        if (!galeria) return;

        const siguienteLote = blogData.slice(mostrados, mostrados + ITEMS_POR_TANDA);

        siguienteLote.forEach(function (item) {
            galeria.appendChild(crearTarjeta(item));
        });

        mostrados += siguienteLote.length;

        if (mostrados >= blogData.length && botonCargarMas) {
            botonCargarMas.classList.add("oculto");
        }
    }

    document.addEventListener("DOMContentLoaded", function () {

        galeria = document.getElementById("blog-galeria");
        botonCargarMas = document.getElementById("blog-cargar-mas");

        mostrarSiguienteTanda(); // primeras 4

        if (botonCargarMas) {
            botonCargarMas.addEventListener("click", mostrarSiguienteTanda);
        }
    });

})();