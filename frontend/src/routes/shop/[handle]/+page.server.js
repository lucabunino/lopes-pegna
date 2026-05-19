import { shopifyFetch, GET_PRODUCT_BY_HANDLE, GET_RELATED_PRODUCTS } from '$lib/utils/shopify';
import { getInfoEmail } from '$lib/utils/sanity';
import { getLocale } from '$lib/paraglide/runtime';
import { error } from '@sveltejs/kit';

export async function load({ params, getClientAddress }) {
    const { handle } = params;
    const lang = getLocale();
    const buyerIP = getClientAddress();

    try {
        const [productData, relatedData] = await Promise.all([
            shopifyFetch({
                query: GET_PRODUCT_BY_HANDLE,
                variables: { handle },
                lang,
                buyerIP,
            }),
            shopifyFetch({
                query: GET_RELATED_PRODUCTS,
                variables: { handle },
                lang,
                buyerIP,
            })
        ]);
        
        const infoEmail = await getInfoEmail();

        if (!productData?.product) {
            throw error(404, 'Product not found');
        }
        if (!infoEmail) {
            throw error(404, 'Info email not found');
        }

        // Logic for related products
        let related = [];
        
        // 1. Iterate through ALL collections to find related products
        if (relatedData?.product?.collections?.nodes?.length > 0) {
            for (const collection of relatedData.product.collections.nodes) {
                const collectionProducts = collection.products.nodes;
                const filtered = collectionProducts.filter(p => p.handle !== handle);
                
                for (const p of filtered) {
                    if (!related.find(r => r.handle === p.handle) && related.length < 4) {
                        related.push(p);
                    }
                }
                if (related.length >= 4) break;
            }
        }
        
        // 2. Fallback to best selling if still not enough
        if (related.length < 4) {
            const fallbackCount = 4 - related.length;
            const bestSelling = relatedData?.products?.nodes || [];
            const filteredBestSelling = bestSelling.filter(p => p.handle !== handle && !related.find(r => r.handle === p.handle));
            related = [...related, ...filteredBestSelling.slice(0, fallbackCount)];
        }

        return {
            product: productData.product,
            related,
			infoEmail: infoEmail.infoEmail,
        };
    } catch (err) {
        throw error(500, 'Failed to load product data');
    }
}
