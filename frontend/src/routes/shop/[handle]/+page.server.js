import { shopifyFetch, GET_PRODUCT_BY_HANDLE } from '$lib/utils/shopify';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ params, getClientAddress }) {
    const { handle } = params;
    const lang = getLocale();
    const buyerIP = getClientAddress();

    try {
        const data = await shopifyFetch({
            query: GET_PRODUCT_BY_HANDLE,
            variables: { handle },
            lang,
            buyerIP
        });

        if (!data?.product) {
            throw error(404, 'Product not found');
        }

        return {
            product: data.product
        };
    } catch (err) {
        console.error('Single Product Load Error:', err);
        throw error(500, 'Failed to load product data');
    }
}
