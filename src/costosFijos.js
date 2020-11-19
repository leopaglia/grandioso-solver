const costosFijos = ({ nombre, monto, porPeriodo = [] }) => {
  return {
    ingAfectImp: () => ({
      components: [],
      total: 0
    }),
    egAfectImp: periodo => ({
      components: [{ name: nombre, value: porPeriodo.length ? porPeriodo[periodo] || 0 : monto }],
      total: porPeriodo.length ? porPeriodo[periodo] : monto,
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
    }),
  }
}

export default costosFijos
