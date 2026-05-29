import { getContacts } from '$lib/utils/sanity';
import { getLocale } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const lang = params.lang ?? getLocale();
    try {
        const contacts = await getContacts(lang);
        if (!contacts) throw error(404, 'Contacts content not found');

        return {
            contacts,
			seoSingle: {
				seoTitle: m.contacts(),
				seoDescription: contacts.seoDescription,
				seoImage: contacts.seoImage
			}
        };
    } catch (err) {
        throw error(500, 'Failed to retrieve beads data');
    }
}