

(function () {
 
    const mediosData = [
 
        // ---------- Bloque 1: primeras 4, visibles apenas carga la página ----------
        { img: "imagenes/medios/en%20los%20medios%201.png", href: "https://www.instagram.com/reel/Dce6kFkJlMs/?igsi=MzRlODBiNWFlZA==", alt: "Nota de prensa 1" }, // TODO: reemplazar href
        { img: "imagenes/medios/en%20los%20medios%202.png", href: "https://www.instagram.com/reel/DcNF6kPtbEX/?igsi=MzRlODBiNWFlZA==", alt: "Nota de prensa 2" }, // TODO: reemplazar href
        { img: "imagenes/medios/en%20los%20medios%203.png", href: "https://www.instagram.com/reel/DbEH0tjxNi1/?igsi=MzRlODBiNWFlZA==", alt: "Nota de prensa 3" }, // TODO: reemplazar href
        { img: "imagenes/medios/en%20los%20medios%204.png", href: "https://www.instagram.com/reel/DcRvkbGh_Bj/?igsi=MzRlODBiNWFlZA==", alt: "Nota de prensa 4" }, // TODO: reemplazar href
    ];
 
    const ITEMS_POR_TANDA = 4;
    let mostrados = 0;
 
    // OJO: ya no se buscan los elementos acá afuera.
    // Antes esto rompía si el <script> estaba en el <head> sin "defer",
    // porque se ejecutaba antes de que el <body> existiera.
    let galeria = null;
    let botonCargarMas = null;
 
    function crearTarjeta(item) {
        const a = document.createElement("a");
        a.className = "medios-item";
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
 
        const siguienteLote = mediosData.slice(mostrados, mostrados + ITEMS_POR_TANDA);
 
        siguienteLote.forEach(function (item) {
            galeria.appendChild(crearTarjeta(item));
        });
 
        mostrados += siguienteLote.length;
 
        if (mostrados >= mediosData.length && botonCargarMas) {
            botonCargarMas.classList.add("oculto");
        }
    }
 
    document.addEventListener("DOMContentLoaded", function () {
 
        // Ahora sí: el DOM ya existe, esto encuentra los elementos seguro
        galeria = document.getElementById("medios-galeria");
        botonCargarMas = document.getElementById("medios-cargar-mas");
 
        mostrarSiguienteTanda(); // primeras 4
 
        if (botonCargarMas) {
            botonCargarMas.addEventListener("click", mostrarSiguienteTanda);
        }
    });
 
})();
 