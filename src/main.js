/* eslint-disable func-names */
/// <reference types="jquery" />

class Moneda {
  constructor(datosMoneda) {
    this.monedaBase = datosMoneda.base_code;
    this.monedaObjetivo = datosMoneda.target_code;
    this.resultadoConversion = datosMoneda.conversion_result;
    this.tasaConversion = datosMoneda.conversion_rate;
    this.tasasConversion = datosMoneda.conversion_rates;
    this.ultimaActualizacion = datosMoneda.time_last_update_utc;
  }
}

async function conseguirInformacionTipos(monedaBase) {
  const respuesta = await fetch(
    `https://v6.exchangerate-api.com/v6/502ae78ce62f17de5f000114/latest/${monedaBase}`,
  );
  const respuestaJSON = respuesta.json();
  return respuestaJSON;
}
async function conseguirInformacionMoneda(
  monedaBase,
  monedaACambiar,
  cantidad,
) {
  const respuesta = await fetch(
    `https://v6.exchangerate-api.com/v6/502ae78ce62f17de5f000114/pair/${monedaBase}/${monedaACambiar}/${cantidad}`,
  );
  const respuestaJSON = respuesta.json();
  return respuestaJSON;
}

function mostrarTiposDeCambios(tiposMonedas) {
  const $listaMoneda = document.querySelector('#lista-moneda');
  Object.keys(tiposMonedas).forEach((moneda) => {
    const $elemento = document.createElement('li');
    $elemento.className = 'list-group-item';
    $elemento.textContent = `${moneda}: ${tiposMonedas[moneda]}`;
    $listaMoneda.appendChild($elemento);
  });
}
function ordenarFecha(fecha) {
  if (/00:00:01/.test(fecha)) {
    return fecha.replace('00:00:01 +0000', '');
  }
  if (/00:00:02/.test(fecha)) {
    return fecha.replace('00:00:02 +0000', '');
  }
  if (/00:00:03/.test(fecha)) {
    return fecha.replace('00:00:03 +0000', '');
  }
  return '';
}
function actualizarTitulo(conversion, moneda) {
  if (conversion === true) {
    const $actualizacion = document.querySelector('h2');
    $actualizacion.textContent = `Ultima actualizacion: ${ordenarFecha(
      moneda.ultimaActualizacion,
    )} convertir de ${moneda.monedaBase} a ${moneda.monedaObjetivo}`;
  }
  if (conversion === false) {
    const $actualizacion = document.querySelector('h2');
    $actualizacion.textContent = `Ultima actualizacion ${ordenarFecha(
      moneda.ultimaActualizacion,
    )} en base a ${moneda.monedaBase}`;
  }
}
function eliminarElementosLi() {
  const $elementos = document.querySelectorAll('li');
  for (let i = 0; i < $elementos.length; i += 1) {
    $elementos[i].remove();
  }
}
function mostrarMonedasConversion(moneda) {
  actualizarTitulo(true, moneda);
  eliminarElementosLi();
  const $listaMoneda = document.querySelector('#lista-moneda');
  const $nuevoElemento = document.createElement('li');
  $nuevoElemento.className = 'list-group-item';
  $nuevoElemento.textContent = `Tasa de cambio de ${moneda.tasaConversion}`;
  const $segundoElemento = document.createElement('li');
  $segundoElemento.className = 'list-group-item';
  $segundoElemento.textContent = `${moneda.monedaBase} a ${moneda.monedaObjetivo}: ${moneda.resultadoConversion}`;

  $listaMoneda.appendChild($nuevoElemento);
  $listaMoneda.appendChild($segundoElemento);
}
async function convertirMoneda(monedaBase, monedaACambiar, cantidad) {
  const respuestaJSON = await conseguirInformacionMoneda(
    monedaBase,
    monedaACambiar,
    cantidad,
  );
  const moneda = new Moneda(respuestaJSON);
  mostrarMonedasConversion(moneda);
}

function seleccionarMoneda(tipo) {
  const $moneda = document.querySelector(`#moneda-${tipo}`);
  return $moneda.value;
}
const $seleccionRadioBoton = document.querySelector('#radio');
$seleccionRadioBoton.addEventListener('change', (event) => {
  const $cambio = document.querySelector('#contenedor-cambio');
  const $conversion = document.querySelector('#contenedor-conversion');
  if (event.target.value === 'conversion') {
    $conversion.classList.toggle('oculto');
    $cambio.classList.toggle('oculto');
  }
  if (event.target.value === 'cambio') {
    $cambio.classList.toggle('oculto');
    $conversion.classList.toggle('oculto');
  }
});

async function mostrarTiposCambios(monedaBase) {
  const respuestaJSON = await conseguirInformacionTipos(monedaBase);
  const tiposMonedas = new Moneda(respuestaJSON);
  actualizarTitulo(false, tiposMonedas);
  eliminarElementosLi();
  mostrarTiposDeCambios(tiposMonedas.tasasConversion);
}

document.querySelector('#ingresar').onclick = function () {
  const moneda = seleccionarMoneda('eleccion');
  mostrarTiposCambios(moneda);
};
document.querySelector('#convertir').onclick = function () {
  const monedaBase = seleccionarMoneda('base');
  const monedaACambiar = seleccionarMoneda('cambiar');
  const cantidad = document.querySelector('#dinero-ingresado');
  convertirMoneda(monedaBase, monedaACambiar, cantidad.value);
};
