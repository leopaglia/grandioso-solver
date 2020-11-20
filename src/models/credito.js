const credito = ({
	nombre,
	capitalTotal,
	tna,
	capitalizacion,
	cuotas,
	tipo,
	anioInicial,
}) => {
	const tea =
		Math.pow(1 + (tna * capitalizacion) / 360, 360 / capitalizacion) - 1

	const creditMapping = {
		frances: {
			cuota: () => capitalTotal * (tea / (1 - Math.pow(1 + tea, -cuotas))),
			interes: restante => restante * tea,
			capital: restante =>
				capitalTotal * (tea / (1 - Math.pow(1 + tea, -cuotas))) -
				restante * tea,
		},
		aleman: {
			cuota: restante => restante * tea + capitalTotal / cuotas,
			interes: restante => restante * tea,
			capital: () => capitalTotal / cuotas,
		},
		americano: {
			cuota: (_, isLast) => capitalTotal * tea + (isLast ? capitalTotal : 0),
			interes: () => capitalTotal * tea,
			capital: (_, isLast) => (isLast ? capitalTotal : 0),
		},
	}

	const fns = creditMapping[tipo]

	const def = {
		cuota: 0,
		interes: 0,
		capital: 0,
		restante: capitalTotal,
	}

	const valores = [...Array(cuotas)].reduce(
		(acc, _, idx) => {
			const restantePrevio = acc[idx].restante

			const interes = fns.interes(restantePrevio, idx === cuotas - 1)
			const capital = fns.capital(restantePrevio, idx === cuotas - 1)
			const cuota = fns.cuota(restantePrevio, idx === cuotas - 1)
			const restante = acc[idx].restante - capital

			return [
				...acc,
				{
					cuota,
					interes,
					capital,
					restante,
				},
			]
		},
		[def]
	)

	const outOfRange = periodo =>
		periodo < anioInicial || periodo > anioInicial + cuotas

	return {
		type: 'Creditos',
		ingAfectImp: () => ({
			components: [],
			total: 0,
		}),
		egAfectImp: periodo => ({
			components: [
				{
					name: `Interes ${nombre}`,
					value: outOfRange(periodo)
						? 0
						: valores[periodo - anioInicial].interes,
				},
			],
			total: outOfRange(periodo) ? 0 : valores[periodo - anioInicial].interes,
		}),
		egNoAfectImp: periodo => ({
			components: [
				{
					name: `Capital ${nombre}`,
					value: outOfRange(periodo)
						? 0
						: periodo === anioInicial
						? capitalTotal
						: -valores[periodo - anioInicial].capital,
				},
			],
			total: outOfRange(periodo)
				? 0
				: periodo === anioInicial
				? capitalTotal
				: -valores[periodo - anioInicial].capital,
		}),
		gastosNoDes: () => ({
			components: [],
			total: 0,
		}),
	}
}

export default credito
