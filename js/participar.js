// Configuración de las participaciones.
const PRECIO_PARTICIPACION = 100;
const MAXIMO_PARTICIPACIONES = 100;
const MAXIMO_ARCHIVO = 5 * 1024 * 1024;

// Elementos del formulario.
const formulario = document.getElementById("formulario-participacion");
const cantidad = document.getElementById("cantidad");
const totalPagar = document.getElementById("total-pagar");

const comprobante = document.getElementById("comprobante");
const errorComprobante = document.getElementById("error-comprobante");
const vistaComprobante = document.getElementById("vista-comprobante");
const imagenComprobante = document.getElementById("imagen-comprobante");
const nombreComprobante = document.getElementById("nombre-comprobante");
const quitarComprobante = document.getElementById("quitar-comprobante");

// Da formato al monto en soles.
const formatoSoles = new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN"
});

// Guarda la dirección temporal de la imagen.
let urlImagen = null;

// Calcula el monto según la cantidad ingresada.
function actualizarTotal() {
    const valor = cantidad.valueAsNumber;

    const esValido =
        Number.isInteger(valor) &&
        valor >= 1 &&
        valor <= Math.min(MAXIMO_PARTICIPACIONES, Number(cantidad.max));

    cantidad.setCustomValidity(
        esValido
            ? ""
            : `Ingresa una cantidad entera entre 1 y ${cantidad.max}.`
    );

    totalPagar.textContent = esValido
        ? formatoSoles.format(valor * PRECIO_PARTICIPACION)
        : "—";
}

// Limpia la vista previa y libera la imagen temporal.
function limpiarVistaPrevia() {
    if (urlImagen !== null) {
        URL.revokeObjectURL(urlImagen);
        urlImagen = null;
    }

    imagenComprobante.removeAttribute("src");
    nombreComprobante.textContent = "";
    vistaComprobante.hidden = true;
}

// Comprueba el formato y tamaño antes de mostrar la imagen.
function mostrarComprobante() {
    limpiarVistaPrevia();

    errorComprobante.textContent = "";
    comprobante.setCustomValidity("");

    const archivo = comprobante.files[0];

    if (!archivo) {
        return;
    }

    const formatosPermitidos = ["image/jpeg", "image/png"];
    let mensajeError = "";

    if (!formatosPermitidos.includes(archivo.type)) {
        mensajeError = "Selecciona una imagen en formato JPG o PNG.";
    } else if (archivo.size > MAXIMO_ARCHIVO) {
        mensajeError = "La imagen supera los 5 MB. Selecciona una más pequeña.";
    } else if (archivo.size === 0) {
        mensajeError = "El archivo está vacío. Selecciona otra imagen.";
    }

    if (mensajeError) {
        comprobante.value = "";
        comprobante.setCustomValidity(mensajeError);
        errorComprobante.textContent = mensajeError;
        return;
    }

    urlImagen = URL.createObjectURL(archivo);
    imagenComprobante.src = urlImagen;
    nombreComprobante.textContent = archivo.name;
    vistaComprobante.hidden = false;
}

// Quita el archivo seleccionado.
function quitarImagen() {
    comprobante.value = "";
    comprobante.setCustomValidity("");
    errorComprobante.textContent = "";

    limpiarVistaPrevia();
}

// Detecta imágenes dañadas o que no pueden abrirse.
imagenComprobante.addEventListener("error", function () {
    quitarImagen();

    const mensaje = "No pudimos abrir la imagen. Selecciona otra.";
    comprobante.setCustomValidity(mensaje);
    errorComprobante.textContent = mensaje;
});

// Escucha los cambios del usuario.
cantidad.addEventListener("input", actualizarTotal);
comprobante.addEventListener("change", mostrarComprobante);
quitarComprobante.addEventListener("click", quitarImagen);

// Elementos de la confirmación.
const confirmacion = document.getElementById("confirmacion-solicitud");
const tituloConfirmacion = document.getElementById("titulo-confirmacion");
const nuevaSolicitud = document.getElementById("nueva-solicitud");

const campoNombre = document.getElementById("nombre");
const campoOperacion = document.getElementById("operacion");

const confirmacionNombre = document.getElementById("confirmacion-nombre");
const confirmacionCantidad = document.getElementById("confirmacion-cantidad");
const confirmacionMonto = document.getElementById("confirmacion-monto");
const confirmacionOperacion = document.getElementById("confirmacion-operacion");

// Exige contenido real, además de los espacios.
function validarTextos() {
    campoNombre.setCustomValidity(
        campoNombre.value.trim().length >= 3
            ? ""
            : "Ingresa tu nombre completo."
    );

    campoOperacion.setCustomValidity(
        campoOperacion.value.trim()
            ? ""
            : "Ingresa el número de operación."
    );
}

campoNombre.addEventListener("input", validarTextos);
campoOperacion.addEventListener("input", validarTextos);

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    actualizarTotal();
    validarTextos();

    if (!formulario.reportValidity()) {
        return;
    }

    const boton = formulario.querySelector('button[type="submit"]');
    boton.disabled = true;
    try {
      const archivo = comprobante.files[0];
      if (!archivo) throw Error('Selecciona el comprobante.');
      const imagen = await new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(Error('No se pudo leer la imagen.'));
        reader.readAsDataURL(archivo);
      });
      Sorttex.submit({dni:document.getElementById('dni').value,nombre:campoNombre.value.trim(),celular:document.getElementById('celular').value,correo:document.getElementById('correo').value.trim(),cantidad:cantidad.valueAsNumber,operacion:campoOperacion.value.trim(),imagen});
    } catch (error) {
      document.getElementById('error-envio').textContent=error.message;
      return;
    } finally { boton.disabled=false; }
    document.getElementById('error-envio').textContent='';

    confirmacionNombre.textContent = campoNombre.value.trim();
    confirmacionCantidad.textContent = cantidad.valueAsNumber;

    confirmacionMonto.textContent = formatoSoles.format(
        cantidad.valueAsNumber * PRECIO_PARTICIPACION
    );

    confirmacionOperacion.textContent = campoOperacion.value.trim();

    formulario.hidden = true;
    confirmacion.hidden = false;

    tituloConfirmacion.focus();
});

nuevaSolicitud.addEventListener("click", function () {
    formulario.reset();

    campoNombre.setCustomValidity("");
    campoOperacion.setCustomValidity("");

    quitarImagen();
    actualizarTotal();

    confirmacion.hidden = true;
    formulario.hidden = false;

    document.getElementById("dni").focus();
});

// Muestra el total inicial.
actualizarTotal();
const sorteoDisponible = Sorttex.active(Sorttex.load());
if (!sorteoDisponible || sorteoDisponible.estado !== 'ABIERTO') {
 document.getElementById('error-envio').textContent='No hay inscripciones abiertas en este momento.';
 formulario.querySelector('button[type="submit"]').disabled=true;
}
if(sorteoDisponible){
 document.querySelector('main > h1').textContent='Participa por '+sorteoDisponible.nombre;
 const disponibles=100-Sorttex.count(Sorttex.load(),sorteoDisponible.id);
 cantidad.max=String(disponibles);
 document.getElementById('ayuda-cantidad').textContent=`Cada participación cuesta S/ 100. Quedan ${disponibles} disponibles.`;
 if(!disponibles){document.getElementById('error-envio').textContent='Todas las participaciones están confirmadas.';formulario.querySelector('button[type="submit"]').disabled=true;}
}
