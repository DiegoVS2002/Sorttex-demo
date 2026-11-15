// Datos ficticios para presentar el diseño.
const estado = Sorttex.load();
const sorteoActual = Sorttex.active(estado) || [...estado.sorteos].reverse().find(r => r.estado === "FINALIZADO");
const agrupados = new Map();
Sorttex.approved(estado, sorteoActual?.id).forEach(q => {
 if (!agrupados.has(q.dni)) agrupados.set(q.dni, { nombre: Sorttex.alias(q.nombre), numeros: [] });
 agrupados.get(q.dni).numeros.push(...q.numeros);
});
const participantes = [...agrupados.values()];

// Elementos del HTML que vamos a actualizar.
const buscador = document.getElementById("buscar-participante");
const lista = document.getElementById("lista-participantes");
const resultado = document.getElementById("resultado-busqueda");
const sinResultados = document.getElementById("sin-resultados");
const cantidadConfirmadas = document.getElementById("cantidad-confirmadas");
const avance = document.getElementById("avance-participaciones");

// Convierte 1 en "001", 12 en "012", etc.
function formatearNumero(numero) {
    return String(numero).padStart(3, "0");
}

// Permite buscar sin distinguir mayúsculas ni tildes.
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Dibuja las filas de la lista.
function mostrarParticipantes(registros) {
    lista.replaceChildren();

    registros.forEach(function (participante) {
        const fila = document.createElement("li");
        fila.className = "participante";

        const informacion = document.createElement("div");
        informacion.className = "participante-informacion";

        const nombre = document.createElement("strong");
        nombre.className = "participante-nombre";
        nombre.textContent = participante.nombre;

        const detalle = document.createElement("small");
        const cantidad = participante.numeros.length;

        detalle.textContent =
            cantidad === 1
                ? "1 participación confirmada"
                : `${cantidad} participaciones confirmadas`;

        informacion.append(nombre, detalle);

        const numeros = document.createElement("div");
        numeros.className = "participante-numeros";
        numeros.setAttribute("aria-label", "Números asignados");

        participante.numeros.forEach(function (numero) {
            const etiqueta = document.createElement("span");
            etiqueta.className = "numero-participacion";
            etiqueta.textContent = formatearNumero(numero);

            numeros.append(etiqueta);
        });

        fila.append(informacion, numeros);
        lista.append(fila);
    });

    sinResultados.hidden = registros.length > 0;

    resultado.textContent =
        registros.length === 1
            ? "1 participante encontrado"
            : `${registros.length} participantes encontrados`;
}

// Filtra por nombre o por número exacto.
function buscarParticipantes() {
    const texto = normalizarTexto(buscador.value);
    const esNumero = /^\d+$/.test(texto);

    const filtrados = participantes.filter(function (participante) {
        const coincideNombre = normalizarTexto(
            participante.nombre
        ).includes(texto);

        const coincideNumero =
            esNumero &&
            participante.numeros.includes(Number(texto));

        return coincideNombre || coincideNumero;
    });

    mostrarParticipantes(filtrados);
}

// Cuenta participaciones, no personas.
const totalConfirmadas = participantes.reduce(
    function (total, participante) {
        return total + participante.numeros.length;
    },
    0
);

cantidadConfirmadas.textContent = totalConfirmadas;
avance.value = totalConfirmadas;

buscador.addEventListener("input", buscarParticipantes);

// Muestra la lista al abrir la página.
mostrarParticipantes(participantes);
if(sorteoActual) document.querySelector(".introduccion .etiqueta").textContent="SORTEO: "+sorteoActual.nombre;
