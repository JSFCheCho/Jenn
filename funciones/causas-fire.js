
document.addEventListener("DOMContentLoaded", function () {

    const db = firebase.firestore();

    const wrap = document.querySelector(".causas-carrusel-wrap");
    const carouselEl = document.getElementById("causasCarousel");
    const inner = document.getElementById("causasCarouselInner");

    if (!wrap || !carouselEl || !inner) return;

    db.collection("causas")
        .orderBy("createdAt", "desc")
        .limit(8)
        .get()
        .then(function (snapshot) {

            if (snapshot.empty) {
                mostrarVacio();
                return;
            }

            const items = snapshot.docs.map(function (doc) {
                return doc.data();
            });

            construirCarrusel(items);
        })
        .catch(function (error) {
            console.error("Error cargando Causas:", error);
            mostrarVacio();
        });

    function mostrarVacio() {
        wrap.innerHTML = `
            <div class="causas-carrusel-vacio">
                Muy pronto vas a encontrar aquí material de consulta.
            </div>
        `;
    }

    function construirCarrusel(items) {

        // Indicadores (los puntitos), solo si hay más de 1 imagen
        let indicadoresHTML = "";
        if (items.length > 1) {
            indicadoresHTML = '<div class="carousel-indicators">';
            items.forEach(function (item, i) {
                indicadoresHTML += `
                    <button type="button"
                        data-bs-target="#causasCarousel"
                        data-bs-slide-to="${i}"
                        class="${i === 0 ? "active" : ""}"
                        aria-current="${i === 0 ? "true" : "false"}"
                        aria-label="Ver imagen ${i + 1}">
                    </button>
                `;
            });
            indicadoresHTML += "</div>";
        }

        // Slides
        inner.innerHTML = items.map(function (item, i) {
            return `
                <div class="carousel-item ${i === 0 ? "active" : ""}">
                    <a href="${item.href}" target="_blank" rel="noopener noreferrer">
                        <img src="${item.img}" alt="${item.alt || ""}" loading="lazy">
                    </a>
                </div>
            `;
        }).join("");

        // Flechas, solo si hay más de 1 imagen
        let controlesHTML = "";
        if (items.length > 1) {
            controlesHTML = `
                <button class="carousel-control-prev" type="button" data-bs-target="#causasCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Anterior</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#causasCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Siguiente</span>
                </button>
            `;
        }

        // Inserta indicadores antes del carousel-inner, y controles después
        inner.insertAdjacentHTML("beforebegin", indicadoresHTML);
        carouselEl.insertAdjacentHTML("beforeend", controlesHTML);

        // Inicializa el carrusel de Bootstrap (el contenido se agregó
        // después de que Bootstrap ya escaneó la página al cargar)
        new bootstrap.Carousel(carouselEl, {
            interval: 5000,
            ride: false
        });
    }

});
