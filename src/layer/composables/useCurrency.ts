const currentCurrency = 'EUR'
const currentLocale = 'de-DE'

export function useCurrency () {
    const formatPrice = function (price: number) {
        const formatter = new Intl.NumberFormat(currentLocale, {
            style: 'currency',
            currency: currentCurrency,
            minimumFractionDigits: 2
        })

        return formatter.format(price)
    }

    return {
        formatPrice
    }
}
