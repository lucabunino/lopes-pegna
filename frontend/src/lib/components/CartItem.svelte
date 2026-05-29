<script>
    // imports
    import { m } from '$lib/paraglide/messages.js';
    import { localizeHref } from '$lib/paraglide/runtime';
    import { formatPrice } from '$lib/utils/price';
    import ImageShopify from './ImageShopify.svelte';

    // stores
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { getMenu } from '$lib/stores/menu.svelte.js';

    // functions
    let { line, removeItem } = $props();
    const menuer = getMenu();
</script>

<li class="cart-item in-13 uppercase">
    {#if line.merchandise.image}
        <a href={localizeHref(`/shop/${line.merchandise.product.handle}`)} onclick={() => { cartStore.isOpen = false; menuer.setOpen(false); }}>
			<ImageShopify image={line.merchandise.image} />
        </a>
    {/if}
    <div class="item-info">
        <div class="item-content">
            <h4 class="wo-24 wo-18-mb uppercase">
                <a href={localizeHref(`/shop/${line.merchandise.product.handle}`)} onclick={() => { cartStore.isOpen = false; menuer.setOpen(false); }}>{line.merchandise.product.title}</a>
            </h4>
            {#if line.merchandise.product.collections?.nodes?.length > 0}
                <span class="collection">{line.merchandise.product.collections.nodes[0].singular?.value || line.merchandise.product.collections.nodes[0].title}</span>
            {/if}
        </div>
        <div class="item-actions">
            <button class="remove-btn in-13 uppercase" onclick={() => removeItem(line.id)}>{m.remove()}</button>
        </div>
    </div>
    <p class="price">
        {#if line.merchandise.compareAtPrice}
            <span class="compare-at-price">{formatPrice(line.merchandise.compareAtPrice.amount, line.merchandise.compareAtPrice.currencyCode)}</span>
        {/if}
        {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
    </p>
</li>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

    .cart-item {
        display: grid;
        grid-template-columns: 100px 1fr auto;
        gap: var(--sp-12);
        margin-bottom: var(--sp-14);
		border-bottom: solid 1px var(--lightGray);
		padding-bottom: var(--sp-14);
        align-items: start;

		@media (width <= #{$lg}) {
			grid-template-columns: 60px 1fr auto;
		}

		&:last-of-type {
			border-bottom: unset;
			margin-bottom: 0;
		}

        .item-info {
            display: flex;
            height: stretch;
            flex-direction: column;
            justify-content: space-between;
            gap: var(--sp-4);

            .item-content {
				padding: var(--sp-6) 0;

                .collection {
                    display: block;
                    margin-top: var(--sp-2);
                }
            }

            .item-actions {
                display: flex;
                align-items: center;
                gap: var(--sp-16);
                margin-top: var(--sp-8);

                .remove-btn {
                    opacity: 0.4;
                    &:hover { opacity: 1; }
                }
            }
        }

        .price {
			padding: var(--sp-6) 0;
            white-space: nowrap;
            display: flex;
            column-gap: var(--sp-6);
            justify-content: flex-end;

            .compare-at-price {
                text-decoration: line-through;
                opacity: 0.4;
            }
        }
    }
</style>