const costosVariables = ({ conceptos, demandaPorPeriodo }) => {
	// TODO: se puede desglosar por concepto
	const costoTotalPorProducto = conceptos.reduce(
		(acc, curr) => acc + curr.unitario,
		0
	)

	return {
		ingAfectImp: () => ({
			components: [],
			total: 0,
		}),
		egAfectImp: periodo => ({
			components: [
				{
					name: 'Costo total x Prod',
					value: periodo !== 0 ? costoTotalPorProducto : 0,
				},
				{ name: 'Dem total x prod', value: demandaPorPeriodo[periodo] },
			],
			total: costoTotalPorProducto * demandaPorPeriodo[periodo],
		}),
		egNoAfectImp: () => ({
			components: [],
			total: 0,
		}),
		inversion: () => ({
			components: [],
			total: 0,
		}),
		gastosNoDes: () => ({
			components: [],
			total: 0,
		}),
	}
}

export default costosVariables
