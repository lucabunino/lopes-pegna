
<script>
    import { m } from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { cartStore } from "$lib/stores/cart.svelte.js";

	let { product } = $props()
</script>

<a class="product" href="/shop/{product.handle}">
	<div class="img-wrapper">
		{#if product.images.nodes[0]}
			<img class="img" src={product.images.nodes[0].url} alt={product.images.nodes[0].altText}>
		{/if}
		{#if product.images.nodes[1]}
			<img class="img hover" src={product.images.nodes[1].url} alt={product.images.nodes[1].altText}>
		{/if}
        <button 
            class="add-to-cart" 
            aria-label="Add {product.title} to cart"
            onclick={(e) => {
                e.preventDefault();
                const variantId = product.variants?.nodes[0]?.id;
                if (variantId) cartStore.addItem(variantId);
            }}
        ></button>
	</div>
	<div class="info uppercase">
		<h4 class="title wo-24">{product.title}</h4>
		<div class="meta in-14">
			{#if product.collections?.nodes?.length > 0}
				<span class="collection">{product.collections.nodes[0].singular.value}</span>
			{/if}
			<p class="price">
				{#if product.availableForSale}
                    {new Intl.NumberFormat(getLocale(), {
                        style: 'currency',
                        currency: product.priceRange.minVariantPrice.currencyCode
                    }).format(product.priceRange.minVariantPrice.amount)}
                {:else}
                    {m.sold_out()}
                {/if}
			</p>
		</div>
	</div>
</a>

<style lang="scss">
	.product {
		display: flex;
		flex-direction: column;
		row-gap: var(--sp-10);
        position: relative;

		&:hover {
			.img-wrapper {
				border-radius: var(--sp-24);
				.hover {
					opacity: 1;
				}
                .add-to-cart {
                    opacity: 1;
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
				transition: var(--transition);
			}

            .add-to-cart {
                position: absolute;
                top: var(--sp-9);
                right: var(--sp-9);
                background-color: var(--white);
                color: var(--black);
                width: var(--sp-36);
                height: var(--sp-36);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                opacity: 0;
                z-index: 2;
                border: none;
                cursor: pointer;
                
                &::before, &::after {
                    content: '';
                    position: absolute;
                    background-color: currentColor;
                    border-radius: 2px;
                }
                
                &::before { width: var(--sp-16); height: 2px; }
                &::after { width: 2px; height: var(--sp-16); }
                
                &:hover {
                    background: var(--black);
                    color: var(--white);
                }
            }
		}

		.info {
			display: flex;

			.title {
				width: 50%;
				padding-right: var(--sp-24);
			}

			.meta {
				display: flex;
				flex-direction: column;
			}
		}
	}
</style>