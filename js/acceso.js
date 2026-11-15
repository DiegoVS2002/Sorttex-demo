const formularioAcceso = document.getElementById("formulario-acceso");
const campoClave = document.getElementById("clave");
const botonMostrar = document.getElementById("mostrar-clave");

// Alterna la visibilidad de la contraseña.
botonMostrar.addEventListener("click", function () {
    const mostrar = campoClave.type === "password";

    campoClave.type = mostrar ? "text" : "password";
    botonMostrar.textContent = mostrar ? "Ocultar" : "Mostrar";
    botonMostrar.setAttribute("aria-pressed", String(mostrar));
});

// Navegación de la maqueta: todavía no valida credenciales.
formularioAcceso.addEventListener("submit", function (evento) {
    evento.preventDefault();

    if (!formularioAcceso.reportValidity()) {
        return;
    }

    window.location.href = "index.html";
});