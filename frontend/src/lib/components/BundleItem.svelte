<script>
    import { m } from '$lib/paraglide/messages';
    import { localizeHref } from '$lib/paraglide/runtime';
    import { formatPrice } from '$lib/utils/price';
    import ImageShopify from './ImageShopify.svelte';

    let { product: item } = $props();

    const isVariant = $derived(item.__typename === 'ProductVariant' || (item.product && !item.handle));
    const handle = $derived(isVariant ? item.product.handle : item.handle);
    const title = $derived(isVariant ? item.product.title : item.title);
    const images = $derived(isVariant ? (item.product.images?.nodes || []) : (item.images?.nodes || []));
    const collections = $derived(isVariant ? item.product.collections : item.collections);
    
    // Default a true se non definito per evitare esaurito erroneo
    const availableForSale = $derived(item.availableForSale ?? true);
    const price = $derived(isVariant ? item.price : item.priceRange.minVariantPrice);
    const compareAtPrice = $derived(isVariant ? item.compareAtPrice : item.variants?.nodes[0]?.compareAtPrice);
</script>

<a class="bundle-item in-11 uppercase" href={localizeHref(`/shop/${handle}`)}>
	<div class="img-wrapper">
		{#if images[0]}
			<ImageShopify image={images[0]} />
		{/if}
		{#if images[1]}
			<div class="hover">
				<ImageShopify image={images[1]} />
			</div>
		{/if}
	</div>
	<div class="info">
		<div class="content">
			<h4 class="title wo-18 uppercase">{title}</h4>
			{#if collections?.nodes?.length > 0}
				<span class="collection">{collections.nodes[0].singular?.value || collections.nodes[0].title}</span>
			{/if}:
			{#if price}
				<span class="price">
					{#if availableForSale}
						{#if compareAtPrice && compareAtPrice.amount > price.amount}
							<span class="compare-at-price">{formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}</span>
						{/if}
						{formatPrice(price.amount, price.currencyCode)}
					{:else}
						{m.sold_out()}
					{/if}
				</span>
			{/if}
		</div>
	</div>
</a>

<style lang="scss">
    .bundle-item {
        display: grid;
        grid-template-columns: 50px 1fr auto;
        gap: var(--sp-12);
		padding-bottom: var(--sp-14);
        align-items: start;
        text-decoration: none;
        color: inherit;

		@media (pointer: fine) {
			&:hover {
				.img-wrapper {
					border-radius: var(--sp-12);
					.hover {
						opacity: 1;
					}
				}
			}
		}

		.img-wrapper {
			position: relative;
			display: block;
			width: 100%;
			height: auto;
			aspect-ratio: 3/4;
			overflow: hidden;
			background-color: var(--lightGray);
			transition: var(--transition);
			
			.hover {
				position: absolute;
				inset: 0;
				opacity: 0;
				aspect-ratio: 3/4;
			}
		}

        .info {
            display: flex;
            height: 100%;
            flex-direction: column;
            justify-content: center;
            gap: var(--sp-4);

            .content {
				padding: var(--sp-6) 0;

				.title {
					display: block;
					margin-bottom: var(--sp-2);
				}

                .collection {
                    display: inline;
                }

				.price {
					white-space: nowrap;
					display: inline;
					column-gap: var(--sp-6);

					.compare-at-price {
						text-decoration: line-through;
						color: var(--darkGray);
					}
				}
            }
        }
    }
</style>