import { shopifyFetch, FETCH_PRODUCTS_PAGE } from '$lib/utils/shopify';
import { getLocale } from '$lib/paraglide/runtime';
import { json } from '@sveltejs/kit';

export async function POST({ request, getClientAddress }) {
    const { after, first = 12 } = await request.json();
    const lang = getLocale();
    const buyerIP = getClientAddress();

    try {
        const shopifyData = await shopifyFetch({
            query: FETCH_PRODUCTS_PAGE,
            variables: { first, after },
            lang,
            buyerIP,
        });

        return json({
            products: shopifyData?.products?.nodes || [],
            pageInfo: shopifyData?.products?.pageInfo
        });
    } catch (err) {
        console.error('API Load More Error:', err);
        return json({ error: 'Failed to fetch more products' }, { status: 500 });
    }
}
