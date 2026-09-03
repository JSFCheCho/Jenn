

document.addEventListener("DOMContentLoaded", function () {

    const db = firebase.firestore();

    const ITEMS_POR_TANDA = 4;
    let todosLosItems = [];
    let mostrados = 0;

    const galeria = document.getElementById("medios-galeria");
    const botonCargarMas = document.getElementById("medios-cargar-mas");

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

        const siguienteLote = todosLosItems.slice(mostrados, mostrados + ITEMS_POR_TANDA);

        siguienteLote.forEach(function (item) {
            galeria.appendChild(crearTarjeta(item));
        });

        mostrados += siguienteLote.length;

        if (mostrados >= todosLosItems.length && botonCargarMas) {
            botonCargarMas.classList.add("oculto");
        } else if (botonCargarMas) {
            botonCargarMas.classList.remove("oculto");
        }
    }

    if (galeria) {
        db.collection("medios")
            .orderBy("createdAt", "desc")
            .get()
            .then(function (snapshot) {
                todosLosItems = snapshot.docs.map(function (doc) {
                    return doc.data();
                });

                mostrarSiguienteTanda();

                if (botonCargarMas) {
                    botonCargarMas.addEventListener("click", mostrarSiguienteTanda);
                }
            })
            .catch(function (error) {
                console.error("Error cargando Medios:", error);
            });
    }

});
