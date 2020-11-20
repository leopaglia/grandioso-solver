const ingresosVariables = ({ 
  precioPorPeriodo,
  demandaPorPeriodo
}) => {
  return {
    ingAfectImp: periodo => ({
      components: [
        { name: 'Precio', value: precioPorPeriodo[periodo] },
        { name: 'Demanda', value: demandaPorPeriodo[periodo] },
      ],
      total: precioPorPeriodo[periodo] * demandaPorPeriodo[periodo] 
    }),
    egAfectImp: () => ({
      components: [],
      total: 0
    }),
    egNoAfectImp: () => ({
      components: [],
      total: 0
    }),
    inversion: () => ({
      components: [],
      total: 0
    }),
    gastosNoDes: () => ({
      components: [],
      total: 0
    })
  }
}

export default ingresosVariables