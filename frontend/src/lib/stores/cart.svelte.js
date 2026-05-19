import { shopifyFetch, CART_QUERY, CART_CREATE_MUTATION, CART_LINES_ADD_MUTATION, CART_LINES_UPDATE_MUTATION, CART_LINES_REMOVE_MUTATION } from '$lib/utils/shopify';
import { getLocale } from '$lib/paraglide/runtime';

let cart = $state(null);
let isOpen = $state(false);

const CART_ID_STORAGE_KEY = 'shopify_cart_id';

async function fetchCart() {
    const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
    if (!cartId) return;

    const lang = getLocale();
    const data = await shopifyFetch({
        query: CART_QUERY,
        variables: { cartId },
        lang
    });

    if (data?.cart) {
        cart = data.cart;
    } else {
        localStorage.removeItem(CART_ID_STORAGE_KEY);
        cart = null;
    }
}

async function createCart(variantId) {
    const lang = getLocale();
    const data = await shopifyFetch({
        query: CART_CREATE_MUTATION,
        variables: {
            input: {
                lines: [{ merchandiseId: variantId, quantity: 1 }]
            }
        },
        lang
    });

    if (data?.cartCreate?.cart) {
        const newCart = data.cartCreate.cart;
        localStorage.setItem(CART_ID_STORAGE_KEY, newCart.id);
        await fetchCart();
        isOpen = true;
    }
}

export const cartStore = {
    get current() { return cart; },
    get isOpen() { return isOpen; },
    set isOpen(val) { isOpen = val; },
    get totalQuantity() { return cart?.totalQuantity || 0; },

    toggle() {
        isOpen = !isOpen;
    },

    async init() {
        if (typeof window === 'undefined') return;
        await fetchCart();
    },

    async addItem(variantId) {
        const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
        if (!cartId) {
            await createCart(variantId);
            return;
        }

        const lang = getLocale();
        const data = await shopifyFetch({
            query: CART_LINES_ADD_MUTATION,
            variables: {
                cartId,
                lines: [{ merchandiseId: variantId, quantity: 1 }]
            },
            lang
        });

        if (data?.cartLinesAdd?.cart) {
            await fetchCart();
            isOpen = true;
        }
    },

    async updateQuantity(lineId, quantity) {
        const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
        if (!cartId) return;

        const lang = getLocale();
        if (quantity <= 0) {
            await this.removeItem(lineId);
            return;
        }

        await shopifyFetch({
            query: CART_LINES_UPDATE_MUTATION,
            variables: {
                cartId,
                lines: [{ id: lineId, quantity }]
            },
            lang
        });
        await fetchCart();
    },

    async removeItem(lineId) {
        const cartId = localStorage.getItem(CART_ID_STORAGE_KEY);
        if (!cartId) return;

        const lang = getLocale();
        await shopifyFetch({
            query: CART_LINES_REMOVE_MUTATION,
            variables: {
                cartId,
                lineIds: [lineId]
            },
            lang
        });
        await fetchCart();
    }
};
