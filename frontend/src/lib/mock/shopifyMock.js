// Shopify Storefront mock, used while the store is unavailable (see PUBLIC_SHOPIFY_MOCK in shopify.js).
// Answers the queries in shopify.js with the same response shapes, built from shopifyCatalog.json
// (synced Shopify data exported from Sanity, regenerate with `node scripts/generate-shopify-mock.js`).
// Missing text falls back to lorem ipsum. The cart lives in localStorage, checkout is disabled.
import catalog from './shopifyCatalog.json'

const CURRENCY = 'EUR'
const LOREM =
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
const LOREM_SHORT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
const COUNTRIES = [
	['IT', 'Italia'],
	['FR', 'France'],
	['DE', 'Deutschland'],
	['CH', 'Schweiz'],
	['GB', 'United Kingdom'],
	['US', 'United States'],
]
const CART_STORAGE_KEY = 'shopify_mock_cart'

const money = (amount) => ({ amount: Number(amount || 0).toFixed(1), currencyCode: CURRENCY })
const stripHtml = (html) => html.replace(/<[^>]*>/g, '').trim()

function image(url, alt) {
	if (!url) return null
	const sep = url.includes('?') ? '&' : '?'
	return { id: url, url, lqip: `${url}${sep}width=20`, altText: alt, width: 2560, height: 3414 }
}

function richText(text) {
	return JSON.stringify({ type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: text }] }] })
}

// lorem ipsum backup when the catalog is empty or missing
const sourceProducts = catalog?.products?.length
	? catalog.products
	: ['Collana', 'Anello', 'Orecchini'].map((type, i) => ({
			id: `gid://shopify/Product/mock-${i}`,
			title: `Lorem ${type}`,
			handle: `lorem-${i}`,
			productType: type,
			createdAt: new Date(0).toISOString(),
			variants: [{ id: `gid://shopify/ProductVariant/mock-${i}`, title: 'Default Title', price: 100 * (i + 1), available: true }],
		}))
const sourceCollections = catalog?.collections ?? []

function collectionFor(p) {
	const prefix = (p.productType || '').slice(0, 3).toLowerCase()
	const col = sourceCollections.find((c) => c.handle.startsWith(prefix))
	const handle = col?.handle ?? (prefix || 'shop')
	return { handle, title: col?.title ?? p.productType ?? 'Shop', singular: { value: p.productType || col?.title || 'Shop' } }
}

const isSet = (p) => collectionFor(p).handle === 'set'

// build products in two passes: base fields first, then set components that point at other products
const products = sourceProducts.map((p) => {
	const img = image(p.image, p.title)
	const collections = { nodes: [collectionFor(p)] }
	const productRef = { id: p.id, title: p.title, handle: p.handle, collections, images: { nodes: img ? [img] : [] } }
	const descriptionHtml = p.descriptionHtml && stripHtml(p.descriptionHtml).length > 0 ? p.descriptionHtml : `<p>${LOREM}</p>`
	const variants = (p.variants?.length ? p.variants : [{ id: `${p.id}-v`, title: 'Default Title', price: 0, available: true }]).map((v) => ({
		id: v.id,
		title: v.title,
		sku: v.sku ?? '',
		requiresComponents: false,
		quantityAvailable: v.available ? 1 : 0,
		availableForSale: !!v.available,
		price: money(v.price),
		compareAtPrice: v.compareAtPrice ? money(v.compareAtPrice) : null,
		selectedOptions: [{ name: 'Title', value: v.title }],
		image: image(v.image, p.title) ?? img,
		components: { nodes: [] },
		product: productRef,
	}))
	const prices = variants.map((v) => Number(v.price.amount))
	return {
		id: p.id,
		title: p.title,
		handle: p.handle,
		createdAt: p.createdAt,
		vendor: p.vendor ?? '',
		availableForSale: variants.some((v) => v.availableForSale),
		description: stripHtml(descriptionHtml),
		descriptionHtml,
		seo: { title: null, description: null },
		options: [{ name: 'Title', values: variants.map((v) => v.title) }],
		category: { name: p.productType ?? '' },
		priceRange: { minVariantPrice: money(Math.min(...prices)), maxVariantPrice: money(Math.max(...prices)) },
		images: { nodes: img ? [img] : [] },
		listImage: img ? { reference: { image: img } } : null,
		collections,
		variants: { nodes: variants },
		details: { key: 'details', namespace: 'custom', value: richText(LOREM_SHORT) },
		metafield: { value: richText(LOREM_SHORT) },
		length: null,
		total_length: null,
		custom_keys_values: [],
	}
})

// sets: mock components = first non-set products
const singles = products.filter((p) => !isSet(sourceProducts.find((s) => s.id === p.id)))
for (const p of products) {
	if (!isSet(sourceProducts.find((s) => s.id === p.id))) continue
	const components = singles.slice(0, 3).map((s) => ({ quantity: 1, productVariant: s.variants.nodes[0] }))
	for (const v of p.variants.nodes) {
		v.requiresComponents = true
		v.components = { nodes: components }
	}
}

const variantsById = new Map(products.flatMap((p) => p.variants.nodes.map((v) => [v.id, v])))
const productsById = new Map(products.map((p) => [p.id, p]))

function localization(country = 'IT') {
	const iso = country.toUpperCase()
	return {
		country: { isoCode: iso, name: COUNTRIES.find(([c]) => c === iso)?.[1] ?? iso },
		language: { isoCode: 'IT', name: 'Italiano' },
		availableCountries: COUNTRIES.map(([isoCode, name]) => ({ isoCode, name, currency: { isoCode: CURRENCY, symbol: '€' } })),
	}
}

// cart, browser only
function readCart() {
	if (typeof localStorage === 'undefined') return null
	try {
		return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) ?? { lines: [] }
	} catch {
		return { lines: [] }
	}
}

function writeCart(cart) {
	try {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
	} catch {}
}

function cartResponse(cart) {
	const lines = cart.lines
		.map((l) => ({ id: l.id, quantity: l.quantity, merchandise: variantsById.get(l.variantId) }))
		.filter((l) => l.merchandise)
	const subtotal = lines.reduce((sum, l) => sum + Number(l.merchandise.price.amount) * l.quantity, 0)
	return {
		id: 'mock-cart',
		checkoutUrl: '#',
		totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
		lines: { nodes: lines },
		cost: { totalAmount: money(subtotal), subtotalAmount: money(subtotal) },
	}
}

function addLines(cart, lines) {
	for (const { merchandiseId, quantity = 1 } of lines) {
		const existing = cart.lines.find((l) => l.variantId === merchandiseId)
		if (existing) existing.quantity += quantity
		else cart.lines.push({ id: `mock-line-${Date.now()}-${cart.lines.length}`, variantId: merchandiseId, quantity })
	}
}

const handlers = {
	getLocalization: (v) => ({ localization: localization(v.country) }),
	getProductsByIds: (v) => ({
		localization: localization(v.country),
		nodes: (v.ids ?? []).map((id) => productsById.get(id) ?? variantsById.get(id) ?? null),
	}),
	getProducts: (v) => ({ localization: localization(v.country), products: { nodes: products } }),
	getBundles: () => ({ products: { nodes: products.filter((p) => p.collections.nodes[0].handle === 'set') } }),
	getProductByHandle: (v) => ({ product: products.find((p) => p.handle === v.handle) ?? null }),
	getProductsPage: (v) => {
		const start = v.after ? Number(v.after) : 0
		const end = start + (v.first ?? 20)
		return {
			shop: { name: 'Lopes Pegna', description: LOREM_SHORT },
			products: { pageInfo: { hasNextPage: end < products.length, endCursor: String(end) }, nodes: products.slice(start, end) },
		}
	},
	getRelatedProducts: (v) => {
		const product = products.find((p) => p.handle === v.handle)
		const handle = product?.collections.nodes[0].handle
		return {
			product: product && { collections: { nodes: [{ products: { nodes: products.filter((p) => p.collections.nodes[0].handle === handle) } }] } },
			products: { nodes: products },
		}
	},
	getCart: () => {
		const cart = readCart()
		return cart && { cart: cartResponse(cart) }
	},
	cartCreate: (v) => {
		const cart = { lines: [] }
		addLines(cart, v.input?.lines ?? [])
		writeCart(cart)
		return { cartCreate: { cart: { id: 'mock-cart', checkoutUrl: '#' } } }
	},
	cartLinesAdd: (v) => {
		const cart = readCart() ?? { lines: [] }
		addLines(cart, v.lines ?? [])
		writeCart(cart)
		return { cartLinesAdd: { cart: { id: 'mock-cart', totalQuantity: cartResponse(cart).totalQuantity } } }
	},
	cartLinesUpdate: (v) => {
		const cart = readCart() ?? { lines: [] }
		for (const { id, quantity } of v.lines ?? []) {
			const line = cart.lines.find((l) => l.id === id)
			if (line) line.quantity = quantity
		}
		writeCart(cart)
		return { cartLinesUpdate: { cart: { id: 'mock-cart' } } }
	},
	cartLinesRemove: (v) => {
		const cart = readCart() ?? { lines: [] }
		cart.lines = cart.lines.filter((l) => !(v.lineIds ?? []).includes(l.id))
		writeCart(cart)
		return { cartLinesRemove: { cart: { id: 'mock-cart' } } }
	},
}

export function mockShopify(query, variables = {}) {
	const operation = query.match(/(?:query|mutation)\s+(\w+)/)?.[1]
	const handler = handlers[operation]
	if (!handler) {
		console.warn(`Shopify mock: no handler for ${operation}`)
		return null
	}
	return handler(variables)
}
