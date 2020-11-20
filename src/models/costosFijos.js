const costosFijos = ({ nombre, monto, porPeriodo = [] }) => {
	return {
		type: 'Costos Fijos',
		ingAfectImp: () => ({
			components: [],
			total: 0,
		}),
		egAfectImp: periodo => ({
			components: [
				{
					name: nombre,
					value: porPeriodo.length
						? porPeriodo[periodo] || 0
						: periodo > 0
						? monto
						: 0,
				},
			],
			total: porPeriodo.length ? porPeriodo[periodo] : periodo > 0 ? monto : 0,
		}),
		egNoAfectImp: () => ({
			components: [],
			total: 0,
		}),
		gastosNoDes: () => ({
			components: [],
			total: 0,
		}),
	}
}

export default costosFijos
