import { m } from '$lib/paraglide/messages.js';

export async function load() {
    return {
		seoSingle: {
			seoTitle: m.cart(),
		}
	};
}