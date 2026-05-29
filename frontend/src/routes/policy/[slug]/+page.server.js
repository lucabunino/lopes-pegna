import { getPolicy } from '$lib/utils/sanity.js'
import { getLocale } from '$lib/paraglide/runtime'
import { error } from '@sveltejs/kit'

export async function load({ params }) {
	const lang = params.lang ?? getLocale()
	const policy = await getPolicy(params.slug, lang)

	if (!policy) throw error(404, 'Policy not found')

	return {
		policy,
		seoSingle: {
			seoTitle: policy.title
		}
	}
}
