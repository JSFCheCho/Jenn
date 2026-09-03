/* ============================================================
   Panel de administración
   Las imágenes se suben a Cloudinary (gratis, sin tarjeta),
   no a Firebase Storage (que ahora exige plan Blaze).
   ============================================================ */

// TODO: reemplaza estos dos valores con los tuyos de Cloudinary
const CLOUDINARY_CLOUD_NAME = "ei5qejom";
const CLOUDINARY_UPLOAD_PRESET = "paginaweb";

function subirImagenACloudinary(archivo) {
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    return fetch(url, {
        method: "POST",
        body: formData
    })
        .then(function (respuesta) {
            if (!respuesta.ok) throw new Error("Error al subir a Cloudinary");
            return respuesta.json();
        })
        .then(function (data) {
            return data.secure_url; // la URL final de la imagen
        });
}

document.addEventListener("DOMContentLoaded", function () {

    const auth = firebase.auth();
    const db = firebase.firestore();

    const panelCargando = document.getElementById("panelCargando");
    const panelContenido = document.getElementById("panelContenido");
    const panelUsuarioEmail = document.getElementById("panelUsuarioEmail");

    const formSubida = document.getElementById("formSubida");
    const btnSubir = document.getElementById("btnSubir");
    const panelMensaje = document.getElementById("panelMensaje");

    const listaEntradas = document.getElementById("listaEntradas");
    const botonesTab = document.querySelectorAll(".panel-tab");

    let seccionActiva = "medios";

    /* ---------- 1. Guardia de sesión: si no está logueado, fuera ---------- */
    auth.onAuthStateChanged(function (usuario) {
        if (!usuario) {
            window.location.href = "login.html";
            return;
        }

        panelUsuarioEmail.textContent = usuario.email;
        panelCargando.classList.add("d-none");
        panelContenido.classList.remove("d-none");

        cargarLista(seccionActiva);
    });

    document.getElementById("btnLogout").addEventListener("click", function () {
        auth.signOut().then(function () {
            window.location.href = "login.html";
        });
    });

    /* ---------- 2. Subir imagen + guardar en Firestore ---------- */
    formSubida.addEventListener("submit", function (e) {
        e.preventDefault();

        mostrarMensaje("", true); // limpia mensaje anterior

        const seccion = document.getElementById("seccion").value; // "medios" o "blog"
        const archivo = document.getElementById("imagen").files[0];
        const link = document.getElementById("link").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (!archivo) {
            mostrarMensaje("Selecciona una imagen.", false);
            return;
        }

        btnSubir.disabled = true;
        btnSubir.textContent = "Subiendo...";

        subirImagenACloudinary(archivo)
            .then(function (url) {
                return db.collection(seccion).add({
                    img: url,
                    href: link,
                    alt: descripcion,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            })
            .then(function () {
                mostrarMensaje("¡Publicado correctamente!", true);
                formSubida.reset();

                if (seccion === seccionActiva) {
                    cargarLista(seccionActiva);
                }
            })
            .catch(function (error) {
                console.error(error);
                mostrarMensaje("Hubo un error al subir. Intenta de nuevo.", false);
            })
            .finally(function () {
                btnSubir.disabled = false;
                btnSubir.textContent = "Publicar";
            });
    });

    function mostrarMensaje(texto, esExito) {
        if (!texto) {
            panelMensaje.classList.add("d-none");
            return;
        }

        panelMensaje.textContent = texto;
        panelMensaje.classList.remove("d-none", "panel-mensaje-exito", "panel-mensaje-error");
        panelMensaje.classList.add(esExito ? "panel-mensaje-exito" : "panel-mensaje-error");
    }

    /* ---------- 3. Listar entradas + borrar ---------- */
    botonesTab.forEach(function (btn) {
        btn.addEventListener("click", function () {
            botonesTab.forEach(function (b) { b.classList.remove("activo"); });
            btn.classList.add("activo");

            seccionActiva = btn.getAttribute("data-seccion");
            cargarLista(seccionActiva);
        });
    });

    function cargarLista(seccion) {
        listaEntradas.innerHTML = '<p class="text-secondary">Cargando...</p>';

        db.collection(seccion)
            .orderBy("createdAt", "desc")
            .get()
            .then(function (snapshot) {
                if (snapshot.empty) {
                    listaEntradas.innerHTML = '<p class="text-secondary">Todavía no hay entradas aquí.</p>';
                    return;
                }

                listaEntradas.innerHTML = "";

                snapshot.forEach(function (doc) {
                    const item = doc.data();
                    listaEntradas.appendChild(crearFilaEntrada(seccion, doc.id, item));
                });
            })
            .catch(function (error) {
                console.error(error);
                listaEntradas.innerHTML = '<p class="text-danger">No se pudo cargar la lista.</p>';
            });
    }

    function crearFilaEntrada(seccion, id, item) {
        const fila = document.createElement("div");
        fila.className = "panel-fila";

        fila.innerHTML = `
            <img src="${item.img}" alt="" class="panel-fila-img">
            <div class="panel-fila-info">
                <a href="${item.href}" target="_blank" rel="noopener noreferrer">${item.href}</a>
                ${item.alt ? `<span class="panel-fila-alt">${item.alt}</span>` : ""}
            </div>
            <button type="button" class="btn panel-boton-borrar" aria-label="Borrar">
                <i class="bi bi-trash3"></i>
            </button>
        `;

        fila.querySelector(".panel-boton-borrar").addEventListener("click", function () {
            if (!confirm("¿Borrar esta entrada? No se puede deshacer.")) return;
            borrarEntrada(seccion, id, fila);
        });

        return fila;
    }

    function borrarEntrada(seccion, id, filaEl) {
        db.collection(seccion).doc(id).delete()
            .then(function () {
                filaEl.remove();
            })
            .catch(function (error) {
                console.error(error);
                alert("No se pudo borrar. Intenta de nuevo.");
            });
    }

});
