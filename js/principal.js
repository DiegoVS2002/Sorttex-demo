const estadoPublico=Sorttex.load(),sorteoPublico=Sorttex.active(estadoPublico);
const listaResultados=document.getElementById('resultados-publicos');
if(listaResultados){
 document.querySelector('.estado-vacio').hidden=estadoPublico.resultados.length>0;
 listaResultados.innerHTML=[...estadoPublico.resultados].reverse().map(w=>`<article class="resultado-ganador"><span class="etiqueta">SORTEO FINALIZADO</span><h3>${Sorttex.escape(w.premio)}</h3><p class="nombre-ganador">${Sorttex.escape(Sorttex.alias(w.nombre))}</p><strong>Número ${Sorttex.num(w.numero)}</strong><p>${new Date(w.fecha).toLocaleDateString('es-PE')}</p></article>`).join('');
}
if(document.querySelector('.presentacion')){
 const titulo=document.getElementById('titulo-premio');
 titulo.textContent=sorteoPublico?sorteoPublico.nombre:'Descubre nuestros resultados';
 document.querySelector('.premio-informacion > p').textContent=sorteoPublico?sorteoPublico.descripcion:'Conoce a los ganadores de nuestros sorteos.';
 const info=document.querySelector('.premio-informacion');
 const contador=document.createElement('p');contador.className='contador-portada';contador.textContent=sorteoPublico?`${Sorttex.count(estadoPublico,sorteoPublico.id)} de 100 participaciones confirmadas`:'No hay inscripciones abiertas en este momento.';info.append(contador);
 if(!sorteoPublico||sorteoPublico.estado!=='ABIERTO')document.querySelectorAll('[data-participar]').forEach(a=>{a.href='ganadores.html';a.textContent='Ver resultados';});
}
