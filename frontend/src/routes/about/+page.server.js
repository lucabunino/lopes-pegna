import { getAbout } from '$lib/utils/sanity';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const lang = params.lang ?? getLocale();
    try {
        const about = await getAbout(lang);
        if (!about) throw error(404, 'About content not found');

        return {
            about
        };
    } catch (err) {
        console.error('About Load Error:', err);
        throw error(500, 'Failed to retrieve about data');
    }
}
