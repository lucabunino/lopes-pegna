import { getHomepage } from '$lib/utils/sanity';
import { shopifyFetch, GET_PRODUCTS_BY_IDS } from '$lib/utils/shopify';
import { getLocale } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages.js';
import { error } from '@sveltejs/kit';

export async function load({ getClientAddress, params, cookies }) {
    const lang = params.lang ?? getLocale();
	const buyerIP = getClientAddress();
	const country = cookies.get('selected_country') ?? cookies.get('detected_country') ?? 'IT';    
    try {
        const homepage = await getHomepage(lang);
        if (!homepage) throw error(404, 'Homepage content not found');

        const featuredIds = homepage.products?.map(p => p.store?.gid).filter(Boolean) || [];
        const setsIds = homepage.setsProducts?.map(p => p.store?.gid).filter(Boolean) || [];
        
        const allIds = [...new Set([...featuredIds, ...setsIds])];

        const shopifyData = allIds.length > 0 
            ? await shopifyFetch({ 
                query: GET_PRODUCTS_BY_IDS,
                variables: { ids: allIds },
				lang,
				country,
                buyerIP,
              }) 
            : { nodes: [] };
		
        const shopifyMap = new Map(shopifyData?.nodes?.map(p => [p?.id, p]));
        homepage.products = featuredIds.map(gid => shopifyMap.get(gid)).filter(Boolean);
        homepage.setsProducts = setsIds.map(gid => shopifyMap.get(gid)).filter(Boolean);

        return {
            homepage,
			localization: shopifyData.localization,
			seoSingle: {
				seoTitle: undefined,
				seoDescription: homepage.seoDescription,
				seoImage: homepage.seoImage
			}
        };
    } catch (err) {
        console.error('Data Sync Error:', err);
        throw error(500, 'Failed to coordinate CMS and Commerce data');
    }
}