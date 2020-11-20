import {
	costosFijos,
	costosVariables,
	credito,
	inversion,
	ingresosVariables,
} from './models'

const App = () => {
	const periodos = 5
	const ig = 0.35

	const intlFormatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		currencySign: 'accounting',
		maximumFractionDigits: 2,
	})

	const formatter = {
		format: x => {
			if (x === 0) {
				return '-'
			}

			if (typeof x === 'string') {
				return x
			}

			return intlFormatter.format(x)
		},
	}

	const prestamoInicial = credito({
		nombre: 'Prestamo Inicial',
		capitalTotal: 2000000 / 1.21 + 1000000,
		tna: 0.1,
		capitalizacion: 60,
		cuotas: 3,
		tipo: 'frances',
		anioInicial: 0,
	})

	const maquinaCompresion = inversion({
		nombre: 'Maquina Compresion',
		valorTotal: (2000000 / 1.21) * 1.1,
		vidaUtil: 10,
		perdidaValorAnual: ((2000000 / 1.21) * 0.5) / 5,
		anioInicial: 1,
		anioVenta: 5,
		costoDesinstalacion: (2000000 / 1.21) * 0.05,
	})

	const estuchadora = inversion({
		nombre: 'Estuchadora',
		valorTotal: 1000000 * 0.6,
		vidaUtil: 10,
		perdidaValorAnual: (1000000 * 0.7) / 5,
		anioInicial: 1,
		anioVenta: 5,
	})

	const estuchadoraDesinversion = inversion({
		nombre: 'Estuchadora (Desinversion)',
		valorTotal: 1000000 * 0.4,
		vidaUtil: 10,
		perdidaValorAnual: (1000000 * 0.4) / 3,
		anioInicial: 1,
		anioVenta: 3,
	})

	const reinversionEstuchadora = inversion({
		nombre: 'Estuchadora (Reinversion)',
		valorTotal: 250000,
		vidaUtil: 10,
		perdidaValorAnual: (250000 * 0.5) / 5,
		anioInicial: 4,
		anioVenta: 5,
	})

	const capacitacion = inversion({
		nombre: 'Capacitacion',
		valorTotal: 100000,
		vidaUtil: 3,
		anioInicial: 1,
		anioVenta: 3,
	})

	const alquiler = costosFijos({ nombre: 'Alquiler', monto: 75000 * 12 })

	const estructura = costosFijos({ nombre: 'Estructura', monto: 1000000 })

	const administrativos = costosFijos({
		nombre: 'Administrativos',
		monto: 500000,
	})

	const marketing = costosFijos({
		nombre: 'Marketing',
		porPeriodo: [0, 800000, 800000, 600000, 600000, 500000],
	})

	const cv = costosVariables({
		conceptos: [
			{
				nombre: 'Materia Prima 1',
				unitario: 35,
			},
			{
				nombre: 'Materia Prima 2',
				unitario: 10,
			},
			{
				nombre: 'MOD',
				unitario: 15,
			},
			{
				nombre: 'Otros',
				unitario: 5,
			},
		],
		demandaPorPeriodo: [0, 160000, 162500, 156500, 156500, 155000],
	})

	const ventas = ingresosVariables({
		precioPorPeriodo: [0, 150, 155, 160, 160, 170],
		demandaPorPeriodo: [0, 160000, 162500, 156500, 156500, 155000],
	})

	const actividades = [
		prestamoInicial,
		maquinaCompresion,
		estuchadora,
		estuchadoraDesinversion,
		reinversionEstuchadora,
		capacitacion,
		alquiler,
		estructura,
		administrativos,
		marketing,
		cv,
		ventas,
	]

	const periods = [...Array(periodos + 1)].map((_, periodoActual) => {
		const ingAfecImp = {
			components: actividades.flatMap(
				act => act.ingAfectImp(periodoActual).components
			),
			total: actividades.reduce(
				(acum, item) => acum + item.ingAfectImp(periodoActual).total,
				0
			),
		}

		const descuentos = ventas.ingAfectImp(periodoActual).total * 0.05
		const iibb = (ventas.ingAfectImp(periodoActual).total - descuentos) * 0.015

		const egAfecImp = {
			components: [
				{ name: 'Descuentos Ventas', value: descuentos },
				{ name: 'IIBB', value: iibb },
				...actividades.flatMap(act => act.egAfectImp(periodoActual).components),
			],
			total: actividades.reduce(
				(acum, item) => acum + item.egAfectImp(periodoActual).total,
				0
			),
		}

		const gastosNoDes = {
			components: actividades.flatMap(
				act => act.gastosNoDes(periodoActual).components
			),
			total: actividades.reduce(
				(acum, item) => acum + item.gastosNoDes(periodoActual).total,
				0
			),
		}

		const utilBrutas = {
			components: [],
			total:
				ingAfecImp.total -
				descuentos -
				iibb -
				egAfecImp.total -
				gastosNoDes.total,
		}

		const utilNetas = {
			components: [
				{ name: 'Impuesto Ganancias', value: utilBrutas.total * ig },
			],
			total: utilBrutas.total - utilBrutas.total * ig,
		}

		const inversiones = {
			components: actividades.flatMap(
				act => act.inversion(periodoActual).components
			),
			total: actividades.reduce(
				(acum, item) => acum + item.inversion(periodoActual).total,
				0
			),
		}

		const egNoAfecImp = {
			components: actividades.flatMap(
				act => act.egNoAfectImp(periodoActual).components
			),
			total: actividades.reduce(
				(acum, item) => acum + item.egNoAfectImp(periodoActual).total,
				0
			),
		}

		const ff = {
			components: [],
			total:
				utilNetas.total +
				gastosNoDes.total +
				egNoAfecImp.total +
				inversiones.total +
				gastosNoDes.total,
		}

		return {
			ingAfecImp,
			egAfecImp,
			gastosNoDes,
			utilBrutas,
			utilNetas,
			inversiones,
			egNoAfecImp,
			ff,
		}
	})

	const Row = ({ name, keyName }) => (
		<>
			<tr>
				<td className="section-title-row" colSpan={periods.length + 1}>
					{!!periods[0][keyName].components.length ? (
						<a
							className="collapse-link"
							data-toggle="collapse"
							href={`#collapse-${keyName}`}
							role="button"
						>
							{name}
						</a>
					) : (
						<span>{name}</span>
					)}
				</td>
			</tr>
			{!!periods[0][keyName].components.length && (
				<tr>
					<td colSpan={periods.length + 1} style={{ padding: 0 }}>
						<div className="collapse" id={`collapse-${keyName}`}>
							<table>
								<tbody>
									{periods[0][keyName].components.map((comp, idx) => (
										<tr key={`tr-${idx}`} className="sub-row">
											<td>{comp.name}</td>
											{periods.map((row, i) => (
												<td key={`td-${i}`}>
													{formatter.format(row[keyName].components[idx].value)}
												</td>
											))}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			)}
			<tr>
				<td className="table-primary">Total</td>
				{periods.map((row, i) => (
					<td className="table-primary" key={i}>
						{formatter.format(row[keyName].total)}
					</td>
				))}
			</tr>
		</>
	)

	return (
		<div className="App container">
			<table className="table table-bordered">
				<thead>
					<tr>
						<th></th>
						{periods.map((_, i) => (
							<th key={i}>P{i}</th>
						))}
					</tr>
				</thead>
				<tbody>
					<Row name="Ingresos Afectados a Impuestos" keyName="ingAfecImp" />
					<Row name="Egresos Afectados a Impuestos" keyName="egAfecImp" />
					<Row name="Gastos No Desembolsables" keyName="gastosNoDes" />
					<Row name="Utilidades Brutas" keyName="utilBrutas" />
					<Row name="Utilidades Netas" keyName="utilNetas" />
					<Row name="Inversiones" keyName="inversiones" />
					<Row
						name="Egresos No Afectados por Impuestos"
						keyName="egNoAfecImp"
					/>
					<Row name="Flujo de Fondos" keyName="ff" />
				</tbody>
			</table>
		</div>
	)
}

export default App
