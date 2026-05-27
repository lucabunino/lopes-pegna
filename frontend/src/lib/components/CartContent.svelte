<script>
    // imports
    import { PortableText } from '@portabletext/svelte';
    import { page } from '$app/state';
    import CartItem from './CartItem.svelte';
    import PortableTextStylePlain from './portableTextStyles/PortableTextStylePlain.svelte';
    import { m } from '$lib/paraglide/messages';
    import { formatPrice } from '$lib/utils/price';

    // stores
    import { cartStore } from '$lib/stores/cart.svelte.js';

    // functions
    let cartInfo = $derived(page.data.cartInfo);
	$inspect(cartInfo)
</script>

<div class="cart-content hide-scrollbar">
	{#if cartStore.current && cartStore.current.lines.nodes.length > 0}
		<ul class="cart-items">
			{#each cartStore.current.lines.nodes as line (line.id)}
				<CartItem {line} removeItem={cartStore.removeItem} />
			{/each}
		</ul>
	{:else}
		<p class="empty-msg wo-18">{m.empty_cart()}</p>
	{/if}
</div>
{#if cartInfo}
	<div class="cart-info portableText in-13">
		<PortableText
		value={cartInfo}
		components={{
			block: {
				normal: PortableTextStylePlain,
			},
			listItem: PortableTextStylePlain,
			marks: {
				link: PortableTextStylePlain,
			},
		}}/>
	</div>
{/if}
{#if cartStore.current && cartStore.current.lines.nodes.length > 0}
	<div class="cart-footer in-13">
		<div class="cart-footer-item">
			<span>{m.subtotal()} (1 oggetto)</span>
			<span>{formatPrice(cartStore.current.cost.subtotalAmount.amount, cartStore.current.cost.subtotalAmount.currencyCode)}</span>
		</div>
		<div class="cart-footer-item">
			<span>{m.shipping()}</span>
			<span>{m.calculated_at_checkout()}</span>
		</div>
		<a href={cartStore.current.checkoutUrl} class="btn-m checkout in-13 uppercase">{m.checkout()}</a>
	</div>
{/if}

<style lang="scss">
	.cart-content {
		flex: 1;
		overflow-y: auto;
		min-height: var(--sp-200);
		
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
</style>