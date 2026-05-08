import { getContacts } from '$lib/utils/sanity';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const lang = params.lang ?? getLocale();
    try {
        const contacts = await getContacts(lang);
        if (!contacts) throw error(404, 'Contacts content not found');

        return {
            contacts,
        };
    } catch (err) {
        throw error(500, 'Failed to retrieve beads data');
    }
}