import { getShop } from '$lib/utils/sanity';
import { shopifyFetch, FETCH_PRODUCTS_PAGE, GET_ALL_PRODUCTS } from '$lib/utils/shopify';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ getClientAddress, params }) {
    const lang = params.lang ?? getLocale();
	const buyerIP = getClientAddress();    
    try {
        const shop = await getShop(lang);
        if (!shop) throw error(404, 'Shop content not found');

        // Fetch first page of products
        const shopifyData = await shopifyFetch({ 
            query: FETCH_PRODUCTS_PAGE, 
            variables: { first: 20 },
            lang,
            buyerIP,
        });

        // Fetch all products to extract unique collections
        const allProductsData = await shopifyFetch({
            query: GET_ALL_PRODUCTS,
            variables: {},
            lang,
            buyerIP
        });

        const collectionsMap = new Map(); // handle -> { title, singular }

        allProductsData?.products?.nodes?.forEach(p => {
            p.collections?.nodes?.forEach(col => {
                if (col && !collectionsMap.has(col.handle)) {
                    collectionsMap.set(col.handle, { 
                        title: col.title, 
                        singular: col.singular?.value || col.title 
                    });
                }
            });
        });

        const categories = Array.from(collectionsMap.entries()).map(([slug, data]) => ({
            slug,
            label: data.title,
            singular: data.singular
        })).sort((a, b) => a.label.localeCompare(b.label));

        return {
            shop,
            products: shopifyData?.products?.nodes || [],
            pageInfo: shopifyData?.products?.pageInfo,
            categories,
			localization: shopifyData?.localization,
        };
    } catch (err) {
        console.error('Data Sync Error:', err);
        throw error(500, 'Failed to coordinate CMS and Commerce data');
    }
}
