// Builds src/lib/mock/shopifyCatalog.json from the Shopify data that Sanity Connect
// synced into Sanity. Used by the Shopify mock (PUBLIC_SHOPIFY_MOCK) while the store is down.
//
// usage: node scripts/generate-shopify-mock.js [--shop lopes-pegna-2.myshopify.com]
// default shop = the one the homepage products point to
import { createClient } from '@sanity/client'
import { writeFileSync, mkdirSync } from 'node:fs'

process.loadEnvFile('.env')

const client = createClient({
	projectId: process.env.PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.PUBLIC_SANITY_DATASET,
	useCdn: false,
	apiVersion: '2025-08-15',
})

const shopArg = process.argv.indexOf('--shop')
let shop = shopArg > -1 ? process.argv[shopArg + 1] : null

if (!shop) {
	shop = await client.fetch(`*[_type == "homepage" && !(_id in path('drafts.**'))][0].products[0]->store.shop.domain`)
}
if (!shop) throw new Error('No shop domain found, pass --shop <domain>')

const data = await client.fetch(
	`{
		"products": *[_type == "product" && !(_id in path('drafts.**')) && store.shop.domain == $shop && !store.isDeleted && store.status == "active"] | order(store.createdAt asc) {
			"id": store.gid,
			"title": store.title,
			"handle": store.slug.current,
			"descriptionHtml": store.descriptionHtml,
			"productType": store.productType,
			"vendor": store.vendor,
			"createdAt": store.createdAt,
			"image": store.previewImageUrl,
			"variants": *[_type == "productVariant" && !(_id in path('drafts.**')) && store.productGid == ^.store.gid && !store.isDeleted] {
				"id": store.gid,
				"title": store.title,
				"price": store.price,
				"compareAtPrice": store.compareAtPrice,
				"available": store.inventory.isAvailable,
				"sku": store.sku,
				"image": store.previewImageUrl
			}
		},
		"collections": *[_type == "collection" && !(_id in path('drafts.**')) && store.shop.domain == $shop && !store.isDeleted && store.slug.current != "frontpage"] {
			"handle": store.slug.current,
			"title": store.title
		}
	}`,
	{ shop }
)

mkdirSync('src/lib/mock', { recursive: true })
writeFileSync('src/lib/mock/shopifyCatalog.json', JSON.stringify({ shop, ...data }, null, '\t') + '\n')
console.log(`${shop}: ${data.products.length} products, ${data.collections.length} collections`)
