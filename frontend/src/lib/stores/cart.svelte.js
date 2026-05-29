import { shopifyFetch, CART_QUERY, CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, CART_LINES_UPDATE_MUTATION, CART_LINES_REMOVE_MUTATION } from '$lib/utils/shopify'
import { getLocale } from '$lib/paraglide/runtime'
import { getCountry } from '$lib/stores/country.svelte.js'

let cart = $state(null)
let isOpen = $state(false)

const CART_ID_STORAGE_KEY = 'shopify_cart_id'

function country() {
	return getCountry().current
}

async function fetchCart() {
	const cartId = localStorage.getItem(CART_ID_STORAGE_KEY)
	if (!cartId) return

	const lang = getLocale()
	const data = await shopifyFetch({
		query: CART_QUERY,
		variables: { cartId },
		lang,
		country: country(),
	})

	if (data?.cart) {
		cart = data.cart
	} else {
		localStorage.removeItem(CART_ID_STORAGE_KEY)
		cart = null
	}
}

async function createCart(variantId) {
	const lang = getLocale()
	const data = await shopifyFetch({
		query: CART_CREATE_MUTATION,
		variables: { input: { lines: [{ merchandiseId: variantId, quantity: 1 }] } },
		lang,
		country: country(),
	})

	if (data?.cartCreate?.cart) {
		localStorage.setItem(CART_ID_STORAGE_KEY, data.cartCreate.cart.id)
		await fetchCart()
		isOpen = true
	}
}

export const cartStore = {
	get current() { return cart },
	get isOpen() { return isOpen },
	set isOpen(val) { isOpen = val },
	get totalQuantity() { return cart?.totalQuantity || 0 },

	toggle() { isOpen = !isOpen },

	async init() {
		if (typeof window === 'undefined') return
		await fetchCart()
	},

	async refresh() {
		if (typeof window === 'undefined') return
		await fetchCart()
	},

	clear() {
		if (typeof window === 'undefined') return
		localStorage.removeItem(CART_ID_STORAGE_KEY)
		cart = null
	},

	async addItem(variantId, components = []) {
		const lang = getLocale()
		const { m } = await import('$lib/paraglide/messages.js')

		if (cart?.lines?.nodes?.length > 0) {
			const incomingIsComponentOfCartSet = cart.lines.nodes.some(line =>
				line.merchandise.components?.nodes?.some(c => c.productVariant.id === variantId)
			)
			if (incomingIsComponentOfCartSet) { alert(m.alert_item_in_cart_set()); return }

			if (components?.length > 0) {
				const incomingSetContainsCartItem = cart.lines.nodes.some(line =>
					components.some(c => c.productVariant.id === line.merchandise.id)
				)
				if (incomingSetContainsCartItem) { alert(m.alert_set_contains_cart_item()); return }

				const incomingSetOverlapsWithCartSet = cart.lines.nodes.some(line => {
					const cartSetComponents = line.merchandise.components?.nodes || []
					if (cartSetComponents.length > 0) {
						return components.some(incomingComp =>
							cartSetComponents.some(cartComp => incomingComp.productVariant.id === cartComp.productVariant.id)
						)
					}
					return false
				})
				if (incomingSetOverlapsWithCartSet) { alert(m.alert_set_contained_in_cart_set()); return }
			}
		}

		const cartId = localStorage.getItem(CART_ID_STORAGE_KEY)
		if (!cartId) { await createCart(variantId); return }

		const data = await shopifyFetch({
			query: CART_LINES_ADD_MUTATION,
			variables: { cartId, lines: [{ merchandiseId: variantId, quantity: 1 }] },
			lang,
			country: country(),
		})
		if (data?.cartLinesAdd?.cart) { await fetchCart(); isOpen = true }
	},

	async updateQuantity(lineId, quantity) {
		const cartId = localStorage.getItem(CART_ID_STORAGE_KEY)
		if (!cartId) return
		if (quantity <= 0) { await this.removeItem(lineId); return }

		await shopifyFetch({
			query: CART_LINES_UPDATE_MUTATION,
			variables: { cartId, lines: [{ id: lineId, quantity }] },
			lang: getLocale(),
			country: country(),
		})
		await fetchCart()
	},

	async removeItem(lineId) {
		const cartId = localStorage.getItem(CART_ID_STORAGE_KEY)
		if (!cartId) return

		await shopifyFetch({
			query: CART_LINES_REMOVE_MUTATION,
			variables: { cartId, lineIds: [lineId] },
			lang: getLocale(),
			country: country(),
		})
		await fetchCart()
	},
}
