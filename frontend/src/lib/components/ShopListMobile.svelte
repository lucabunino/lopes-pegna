<script>
    import { onMount } from 'svelte';
    import { register } from 'swiper/element/bundle';
    import { m } from '$lib/paraglide/messages.js';
    import { formatPrice } from '$lib/utils/price';
    import bp from '$lib/scss/breakpoints.module.scss';
    import { innerWidth } from 'svelte/reactivity/window';
    import { localizeHref } from '$lib/paraglide/runtime';

    let { processedProducts, hoveredProduct = $bindable() } = $props();
    let swiperEl = $state();

    register();

    $effect(() => {
        if (innerWidth.current <= parseInt(bp.lg) && swiperEl && processedProducts.length > 0) {
            const swiperParams = {
                direction: 'vertical',
                slidesPerView: 'auto',
                centeredSlides: false,
                centeredSlidesBounds: true,
                cssMode: true,
                mousewheel: true,
                on: {
                    slideChange: (s) => {
                        hoveredProduct = processedProducts[s.activeIndex];
                    }
                }
            };
            Object.assign(swiperEl, swiperParams);
            swiperEl.initialize();
        }
    });
</script>

<div class="list-mobile">
    <swiper-container bind:this={swiperEl} init="false">
        {#each processedProducts as product (product.id)}
            <swiper-slide>
                <a 
                    class="product" 
                    class:active={hoveredProduct?.id === product.id}
					href={localizeHref(`/shop/${product.handle}`)}
                >
                    <p class="title wo-36 uppercase {product.availableForSale ? 'availableForSale' : 'soldOut'}">{product.title}</p>
                    <p class="info in-15 in-13-mb uppercase">
                        {#if product.collections?.nodes?.length > 0}
                            <span class="collection">{product.collections.nodes[0].singular?.value || product.collections.nodes[0].title}</span>
                        {/if}
                        <span class="price">
                            {#if product.availableForSale}
                                {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                            {:else}
                                {m.sold_out()}
                            {/if}
                        </span>
                    </p>
                </a>
            </swiper-slide>
        {/each}
    </swiper-container>
</div>

<style lang="scss">
    @use '$lib/scss/breakpoints.module' as *;

    .list-mobile {
        display: block;
        position: relative;
        height: calc(100vh - 60vh);
        margin-top: 0;
        padding: 0 var(--sp-12);
		background-color: var(--white);
        overflow: hidden;

        &::before, &::after {
            content: '';
            position: absolute;
            left: 0;
            width: 100%;
            height: 1px;
            background: var(--black);
            z-index: 10;
            pointer-events: none;
        }
        &::before { top: 0; }
        &::after { top: var(--sp-60); }

        swiper-container {
            height: 100%;

			&::part(container) {
				overflow: visible;
			}
            
            swiper-slide {
                display: flex;
                align-items: center;
                color: var(--darkGray);
                height: var(--sp-60);

                &:global(.swiper-slide-active) {
                    color: var(--black);
                }
                &:global(:last-of-type) {
                    margin-bottom: calc(100% - var(--sp-60));
                }

                .product {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    column-gap: var(--sp-12);

                    .title {
                        flex-basis: calc(50% - var(--sp-6));
                    }

                    .info {
                        display: none;
                        
                        .price {
                            margin-left: auto;
                        }
                    }

                    &.active {
                        .info {
                            display: contents;
                        }
                    }
                }
            }
        }
    }
</style>