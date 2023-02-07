/// <reference types="jquery" />

document.querySelector('#ingresar').onclick = function () {
	let moneda = seleccionarMoneda('eleccion');
	mostrarTipoCambios(moneda);
};
document.querySelector('#convertir').onclick = function () {
	let monedaBase = seleccionarMoneda('base');
	let monedaACambiar = seleccionarMoneda('cambiar');
	let cantidad = document.querySelector('#dinero-ingresado');
	convertirMoneda(monedaBase, monedaACambiar, cantidad.value);
};
document.querySelector;
function mostrarTipoCambios(moneda) {
	fetch(
		`https://v6.exchangerate-api.com/v6/502ae78ce62f17de5f000114/latest/${moneda}`
	)
		.then((respuesta) => respuesta.json())
		.then((respuestaJSON) => {
			$('h2').text(
				`Ultima actualizacion: ${ordenarFecha(
					respuestaJSON.time_last_update_utc
				)} en base ${respuestaJSON.base_code}`
			);
			$('li').remove();
			Object.keys(respuestaJSON.conversion_rates).forEach((moneda) => {
				$('#lista-moneda').append(
					$(
						`<li ${'class="list-group-item"'}>${moneda}: ${
							respuestaJSON.conversion_rates[moneda]
						}</li>`
					)
				);
			});
		})
		.catch((error) => console.log('error', error));
}

function convertirMoneda(monedaBase, monedaACambiar, cantidad) {
	fetch(
		`https://v6.exchangerate-api.com/v6/502ae78ce62f17de5f000114/pair/${monedaBase}/${monedaACambiar}/${cantidad}`
	)
		.then((respuesta) => respuesta.json())
		.then((respuestaJSON) => {
			$('h2').text(
				`Ultima actualizacion: ${ordenarFecha(
					respuestaJSON.time_last_update_utc
				)} convertir de ${respuestaJSON.base_code} a ${
					respuestaJSON.target_code
				}`
			);
			$('li').remove();
			$('#lista-moneda').append(
				$(
					`<li class="list-group-item">Tasa de cambio de ${respuestaJSON.conversion_rate}</li>`
				)
			);
			$('#lista-moneda').append(
				$(
					`<li class="list-group-item">${respuestaJSON.base_code} a ${respuestaJSON.target_code}: ${respuestaJSON.conversion_result}</li>`
				)
			);
		});
}

function ordenarFecha(fecha) {
	if (/00:00:01/.test(fecha)) {
		return fecha.replace('00:00:01 +0000', '');
	} else if (/00:00:02/.test(fecha)) {
		return fecha.replace('00:00:02 +0000', '');
	} else if (/00:00:03/.test(fecha)) {
		return fecha.replace('00:00:03 +0000', '');
	}
}
function seleccionarMoneda(tipo) {
	let $moneda = document.querySelector(`#moneda-${tipo}`);
	return $moneda.value;
}
const $seleccionRadioBoton = document.querySelector('#radio');
$seleccionRadioBoton.addEventListener('change', (event) => {
	let $cambio = document.querySelector('#contenedor-cambio');
	let $conversion = document.querySelector('#contenedor-conversion');
	if (event.target.value === 'conversion') {
		$conversion.classList.toggle('oculto');
		$cambio.classList.toggle('oculto');
	}
	if (event.target.value === 'cambio') {
		$cambio.classList.toggle('oculto');
		$conversion.classList.toggle('oculto');
	}
});

