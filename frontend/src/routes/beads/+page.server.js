import { getBeads, getBooks, getBooksIntro } from '$lib/utils/sanity';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const lang = params.lang ?? getLocale();
    try {
        const beads = await getBeads(lang);
        const books = await getBooks(lang);
        const booksIntro = await getBooksIntro(lang);
        if (!beads) throw error(404, 'Beads content not found');
        if (!books) throw error(404, 'Books content not found');
        if (!booksIntro) throw error(404, 'Books intro content not found');

        return {
            beads,
			books,
			booksIntro,
        };
    } catch (err) {
        throw error(500, 'Failed to retrieve beads data');
    }
}