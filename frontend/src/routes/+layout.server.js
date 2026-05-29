import { getSeo, getPolicies, getContacts, getInfo, getCartInfo } from '$lib/utils/sanity'
import { getLocale } from '$lib/paraglide/runtime'
import { error } from '@sveltejs/kit'
import { shopifyFetch, GET_LOCALIZATION } from '$lib/utils/shopify'

export async function load({ url, params, getClientAddress, cookies }) {
	const lang = params.lang ?? getLocale()
	const buyerIP = getClientAddress()

	let country = cookies.get('selected_country')
	let countries = []

	if (!country) {
		country = cookies.get('detected_country')
	}

	const locData = await shopifyFetch({ query: GET_LOCALIZATION, buyerIP, lang, country: country || 'IT' })
	countries = locData?.localization?.availableCountries ?? []

	if (!country) {
		country = locData?.localization?.country?.isoCode || 'IT'
		cookies.set('detected_country', country, { path: '/', maxAge: 60 * 60 * 24 * 7 })
	}

	let seo, policies, contacts, info, cartInfo
	try {
		;[seo, policies, contacts, info, cartInfo] = await Promise.all([
			getSeo(lang),
			getPolicies(lang),
			getContacts(lang),
			getInfo(lang),
			getCartInfo(lang),
		])
	} catch (err) {
		throw error(500, 'Failed to load page data')
	}

	if (!seo) throw error(404, 'Missing SEO data')

	return {
		seo,
		policies,
		contacts,
		info,
		cartInfo: cartInfo.cartInfo,
		pathname: url.pathname,
		country,
		countries,
	}
}
