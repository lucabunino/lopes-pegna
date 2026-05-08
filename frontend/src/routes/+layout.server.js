import { getSeo, getPolicies, getContacts, getInfo } from '$lib/utils/sanity';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ url, params }) {
	const lang = params.lang ?? getLocale();
	let seo, policies, contacts, info;
	try {
		[seo, policies, contacts, info] = await Promise.all([
			getSeo(lang),
			getPolicies(lang),
			getContacts(lang),
			getInfo(lang),
		]);
	} catch (err) {
		throw error(500, 'Failed to load page data');
	}

	if (!seo) {
		throw error(404, 'Missing SEO data');
	}

	return {
		seo,
		policies,
		contacts,
		info,
		pathname: url.pathname
	};
}