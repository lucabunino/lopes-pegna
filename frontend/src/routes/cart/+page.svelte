<script>
    // imports
    import CartContent from '$lib/components/CartContent.svelte';
    import CartItem from '$lib/components/CartItem.svelte';
    import { PortableText } from '@portabletext/svelte';
    import PortableTextStylePlain from '$lib/components/portableTextStyles/PortableTextStylePlain.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import { getLocale } from '$lib/paraglide/runtime';

    // stores
    import { getMenu } from '$lib/stores/menu.svelte.js';
    import { cartStore } from '$lib/stores/cart.svelte.js';

    // functions
    let menuer = getMenu(); menuer.setDark(true); menuer.setDifference(true); menuer.setSmall(false);
	
    const formatPrice = (amount, currencyCode) => {
        return new Intl.NumberFormat(getLocale(), {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    };
</script>

<main id="cart-page" class="in-14">
	<div class="cart-header uppercase">
        <h1 class="uppercase">{m.cart()}</h1>
		<a class="btn-shop" href="/shop">{m.shop()} →</a>
	</div>
	<CartContent />
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;
    #cart-page {
        padding: var(--sp-200) var(--sp-24);
        max-width: 600px;
        margin: 0 auto;
		
		.cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--sp-40);
        }
        .cart-content {
            flex: 1;
            overflow-y: auto;
            
            .empty-msg {
                text-align: center;
                margin-top: var(--sp-60);
                color: var(--darkGray);
            }

            .cart-items {
                list-style: none;
                padding: 0;
            }
        }
		.cart-info {
			border-top: solid 1px var(--lightGray);
			padding: var(--sp-12) 0;
		}
        .cart-footer {
            margin-top: auto;
			border-top: solid 1px var(--lightGray);
			padding: var(--sp-12) 0 0;

			.cart-footer-item {
				display: flex;
				justify-content: space-between;
				align-items: baseline;
			}
			.checkout {
				margin-top: var(--sp-24);
				width: 100%;
			}
        }

        .empty-msg {
            text-align: center;
            margin-bottom: var(--sp-24);
        }
    }
</style>
