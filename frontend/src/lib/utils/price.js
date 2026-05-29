import { getLocale } from '$lib/paraglide/runtime';

export const formatPrice = (amount, currencyCode) => {
	return new Intl.NumberFormat(getLocale(), {
		style: 'currency',
		currency: currencyCode,
		currencyDisplay: 'narrowSymbol',
	}).format(amount);
};