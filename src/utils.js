const intlFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	currencySign: 'accounting',
	maximumFractionDigits: 2,
})

export const format = x => {
	if (x === 0) {
		return '-'
	}

	if (typeof x === 'string') {
		return x
	}

	return intlFormatter.format(x)
}
