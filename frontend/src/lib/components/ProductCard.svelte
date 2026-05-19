
<script>
    // imports
    import ImageShopify from "./ImageShopify.svelte";
    import { m } from "$lib/paraglide/messages";
    import { getLocale } from "$lib/paraglide/runtime";
    import { formatPrice } from "$lib/utils/price";

    // stores
    import { cartStore } from "$lib/stores/cart.svelte.js";

    // functions
    let { product } = $props();
    let hover = $state(false);
</script>

<a class="product" href="/shop/{product.handle}">
	<div class="img-wrapper" onmouseenter={() => hover = true} onmouseleave={() => hover = false}>
		{#if product.images.nodes[0]}
			<!-- <img class="img" src={product.images.nodes[0].url} alt={product.images.nodes[0].altText}> -->
			<ImageShopify image={product.images.nodes[0]} />
		{/if}
		{#if product.images.nodes[1]}
			<!-- <img class="img hover" src={product.images.nodes[1].url} alt={product.images.nodes[1].altText}> -->
			 <div class="hover">
				<ImageShopify image={product.images.nodes[1]} />
			 </div>
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
	<div class="info">
		<h4 class="title wo-24 uppercase">{product.title}</h4>
		<div class="meta in-13 uppercase">
			{#if product.collections?.nodes?.length > 0}
				<span class="collection">{product.collections.nodes[0].singular?.value || product.collections.nodes[0].title}</span>
			{/if}
			<p class="price">
				{#if product.availableForSale}
					{formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                {:else}
                    {m.sold_out()}
                {/if}
			</p>
		</div>
	</div>
</a>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

	.product {
		display: flex;
		flex-direction: column;
		row-gap: var(--sp-10);
        position: relative;
		overflow: hidden;

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

			@media (pointer: coarse) {
				border-radius: var(--sp-24);
			}
			
			.hover {
				position: absolute;
				inset: 0;
				opacity: 0;
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

				@media (pointer: coarse) {
					opacity: 1;
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
				margin-top: var(--sp-2);
			}

			@media (width <= #{$xxs}) {
				flex-direction: column;

				.title {
					width: 100%;
					padding-right: var(--sp-24);
				}
			}
		}
	}
</style>