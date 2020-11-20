const inversion = ({
	nombre,
	valorTotal,
	vidaUtil,
	limiteAmortizacion = 0,
	perdidaValorAnual,
	anioInicial,
	anioVenta = 0,
	costoDesinstalacion = 0,
}) => {
	const cuotaDepreciacion = (valorTotal - limiteAmortizacion) / vidaUtil
	const valorVenta = valorTotal - perdidaValorAnual * anioVenta
	const valorLibro =
		valorTotal -
		limiteAmortizacion -
		cuotaDepreciacion * (anioVenta - anioInicial + 1)

	return {
		ingAfectImp: periodo => ({
			components: [
				...(perdidaValorAnual
					? [
							{
								name: `Venta ${nombre}`,
								value:
									perdidaValorAnual && periodo === anioVenta + 1
										? valorVenta
										: 0,
							},
					  ]
					: []),
			],
			total: perdidaValorAnual && periodo === anioVenta + 1 ? valorVenta : 0,
		}),
		egAfectImp: periodo => ({
			components: [
				{
					name: `Desinstalacion ${nombre}`,
					value:
						periodo === anioVenta + anioInicial - 1 ? costoDesinstalacion : 0,
				},
			],
			total: periodo === anioVenta + anioInicial - 1 ? costoDesinstalacion : 0,
		}),
		egNoAfectImp: () => ({
			components: [],
			total: 0,
		}),
		inversion: periodo => ({
			components: [
				{
					name: `Inversion ${nombre}`,
					value: periodo === anioInicial - 1 ? -valorTotal : 0,
				},
			],
			total: periodo === anioInicial - 1 ? -valorTotal : 0,
		}),
		gastosNoDes: periodo => ({
			components: [
				{
					name: `Depreciacion ${nombre}`,
					value:
						(periodo >= anioInicial && periodo <= anioVenta + anioInicial - 1
							? cuotaDepreciacion
							: 0) + (periodo === anioVenta + anioInicial - 1 ? valorLibro : 0),
				},
			],
			total:
				(periodo >= anioInicial && periodo <= anioVenta + anioInicial - 1
					? cuotaDepreciacion
					: 0) + (periodo === anioVenta + anioInicial - 1 ? valorLibro : 0),
		}),
	}
}

export default inversion
