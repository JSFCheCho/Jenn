document.addEventListener("DOMContentLoaded", function () {
 
    const auth = firebase.auth();
 
    const formulario = document.getElementById("formLogin");
    const btnLogin = document.getElementById("btnLogin");
    const cajaError = document.getElementById("loginError");
 
    formulario.addEventListener("submit", function (e) {
        e.preventDefault();
 
        cajaError.classList.add("d-none");
        cajaError.textContent = "";
 
        const correo = document.getElementById("correo").value.trim();
        const clave = document.getElementById("clave").value;
 
        btnLogin.disabled = true;
        btnLogin.textContent = "Entrando...";
 
        auth.signInWithEmailAndPassword(correo, clave)
            .then(function () {
                window.location.href = "panel.html";
            })
            .catch(function () {
                // Mensaje genérico a propósito: no revelamos si falló
                // el correo o la contraseña, por seguridad.
                cajaError.textContent = "Correo o contraseña incorrectos.";
                cajaError.classList.remove("d-none");
 
                btnLogin.disabled = false;
                btnLogin.textContent = "Entrar";
            });
    });
 
});