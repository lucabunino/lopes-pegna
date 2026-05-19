<script>
    // imports
    import { m } from '$lib/paraglide/messages.js';
    import { formatPrice } from '$lib/utils/price';
    import ImageShopify from './ImageShopify.svelte';

    // stores

    // functions
    let { line, removeItem } = $props();
</script>

<li class="cart-item in-13 uppercase">
    {#if line.merchandise.image}
        <a href={`/shop/${line.merchandise.product.handle}`}>
			<ImageShopify image={line.merchandise.image} />
        </a>
    {/if}
    <div class="item-info">
        <div class="item-content">
            <h4 class="wo-24 uppercase">
                <a href={`/shop/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</a>
            </h4>
            {#if line.merchandise.product.collections?.nodes?.length > 0}
                <span class="collection">{line.merchandise.product.collections.nodes[0].singular.value}</span>
            {/if}
        </div>
        <div class="item-actions">
            <button class="remove-btn in-13 uppercase" onclick={() => removeItem(line.id)}>{m.remove()}</button>
        </div>
    </div>
    <p class="price">
        {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
    </p>
</li>

<style lang="scss">
    .cart-item {
        display: grid;
        grid-template-columns: 100px 1fr auto;
        gap: var(--sp-12);
        margin-bottom: var(--sp-14);
		border-bottom: solid 1px var(--lightGray);
		padding-bottom: var(--sp-14);
        align-items: start;

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
        }
    }
</style>