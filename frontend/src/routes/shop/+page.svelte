<script>
    // imports
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { innerWidth } from 'svelte/reactivity/window';
    import { blur, fade, slide } from 'svelte/transition';
    import Media from '$lib/components/Media.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';
    import ImageShopify from '$lib/components/ImageShopify.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import { getLocale } from '$lib/paraglide/runtime';
    import { collectionSlugMap } from '$lib/collectionSlugs';
    import { formatPrice } from '$lib/utils/price';
    import bp from '$lib/scss/breakpoints.module.scss';
    import ShopListMobile from '$lib/components/ShopListMobile.svelte';

    // stores
    import { getMenu } from '$lib/stores/menu.svelte.js';

    // functions
    let menuer = getMenu(); menuer.setDark(false); menuer.setSmall(false);
    let { data } = $props();
    const currentLocale = getLocale();
    let scrollY = $state(0);
    let filtersHeight = $state(0);
    let lineHeight = $state(0);
    let products = $state(data.products || []);
    let pageInfo = $state(data.pageInfo || { hasNextPage: false, endCursor: null });
    let loaded = $state(false);
    let isLoading = $state(false);
    let DURATION = $derived(innerWidth.current > 768 ? 200 : 0);
    
    let activeCategory = $derived.by(() => {
        const slug = page.url.searchParams.get('category') || 'all';
        if (slug === 'all') return 'all';
        return collectionSlugMap[currentLocale]?.[slug] || slug;
    });
    
    let productsContainer = $state();
    let loaderElement = $state(); 
    let activeSort = $derived(page.url.searchParams.get('sort') || 'new-asc');
    let activeView = $derived(page.url.searchParams.get('view') || 'grid');
    let initialCols = $derived(innerWidth.current <= 1080 ? 2 : innerWidth.current <= 1440 ? 3 : innerWidth.current <= 1700 ? 4 : 5);
    let activeCols = $derived(initialCols);
    let hoveredProduct = $state(products[0]);
    
    let processedProducts = $derived.by(() => {
        let result = products;
        if (activeView === 'grid') result = result.filter(p => p.availableForSale);
        if (activeCategory !== 'all') result = result.filter(p => p.collections?.nodes?.some(c => c.handle === activeCategory));
        
        return [...result].sort((a, b) => {
            switch (activeSort) {
                case 'price-asc': return a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount;
                case 'price-desc': return b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount;
                case 'number-asc': return (parseInt(a.title.replace(/\D/g, '')) || 0) - (parseInt(b.title.replace(/\D/g, '')) || 0);
                case 'number-desc': return (parseInt(b.title.replace(/\D/g, '')) || 0) - (parseInt(a.title.replace(/\D/g, '')) || 0);
                case 'new-asc': return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                case 'new-desc': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                default: return 0;
            }
        });
        return result;
    });

    $effect(() => {
        if (activeView === 'list') menuer.setDifference(true);
        else if (activeView === 'grid') menuer.setDifference(false);
        loaded = true;
    });

    async function loadMore() {
        if (isLoading || !pageInfo.hasNextPage) return;
        isLoading = true;
        try {
            const response = await fetch('/shop/api/load-more', { method: 'POST', body: JSON.stringify({ after: pageInfo.endCursor }), headers: { 'Content-Type': 'application/json' } });
            const result = await response.json();
            if (result.products) { products = [...products, ...result.products]; pageInfo = result.pageInfo; }
        } catch (error) { console.error('Error:', error); }
        finally { isLoading = false; }
    }
    
    onMount(() => {
        const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) loadMore(); }, { rootMargin: '200px' });
        if (loaderElement) observer.observe(loaderElement);
        return () => observer.disconnect();
    });

    import { cartStore } from '$lib/stores/cart.svelte.js';

    function updateParams(newParams) {
        const params = new URLSearchParams(page.url.searchParams);
        for (const [key, value] of Object.entries(newParams)) {
            if (value === 'all' || !value) params.delete(key);
            else params.set(key, value);
        }
        goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
    }
</script>

<svelte:window bind:scrollY></svelte:window>

<nav aria-label="Breadcrumb" class="breadcrumb-mobile in-14 {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}">
	<ol>
		<li><a href="/shop">{m.shop()}</a></li> • <li><a href="/shop?view={activeView}">{activeView === 'list' ? m.list() : m.grid()}</a></li>
	</ol>
</nav>
<main>
	{#if data.shop.heroMedia && activeView === "grid"}
		<section id="hero" transition:slide={{ duration: DURATION, axis: 'y' }}>
			<Media media={data.shop.heroMedia} cover={true}/>
		</section>
	{/if}

	{#if activeView === 'list'}
		<div id="list-img" class:loaded={loaded}>
			{#key hoveredProduct}
				<div class="img-wrapper" in:fade|global={{ duration: DURATION, delay: DURATION }} out:fade|global={{ duration: DURATION }}>
					{#if hoveredProduct.listImage?.reference?.image}
						<ImageShopify image={hoveredProduct.listImage.reference.image}/>
					{/if}
				</div>
			{/key}
		</div>
	{/if}

	<section id="filters" bind:clientHeight={filtersHeight} class="in-14" class:loaded={loaded} data-view={activeView}>
		<div class="categories-and-sorting">
			<div class="categories">
				<label class="in-13 uppercase">{m.show()}</label>
				<button class="category btn-shop btn-s" 
					class:active={activeCategory === 'all'} 
					aria-pressed={activeCategory === 'all'}
					onclick={() => updateParams({ category: 'all' })}
				>
					{m.all()}
				</button>
				{#each data.categories as category}
					{@const slug = collectionSlugMap[currentLocale] ? Object.keys(collectionSlugMap[currentLocale]).find(key => collectionSlugMap[currentLocale][key] === category.slug) || category.slug : category.slug}
					<button class="category btn-shop btn-s" 
						class:active={page.url.searchParams.get('category') === slug} 
						aria-pressed={page.url.searchParams.get('category') === slug}
						onclick={() => updateParams({ category: slug })}
					>
						{category.label}
					</button>
				{/each}
				<select
					id="category-select"
					value={page.url.searchParams.get('category') || 'all'}
					onchange={(e) => updateParams({ category: e.currentTarget.value })}
				>
					<option value='all'>{m.all()}</option>
					{#each data.categories as category}
						{@const slug = collectionSlugMap[currentLocale] ? Object.keys(collectionSlugMap[currentLocale]).find(key => collectionSlugMap[currentLocale][key] === category.slug) || category.slug : category.slug}
						<option value={slug}>{category.label}</option>
					{/each}
				</select>
			</div>
			<div class="sorting">
				<label class="in-13 uppercase" for="sort-select">{m.sort()}</label>
				<select
					id="sort-select"
					value={activeSort} 
					onchange={(e) => updateParams({ sort: e.currentTarget.value })}
				>
					<option value="new-asc">{m.new_asc()}</option>
					<option value="new-desc">{m.new_desc()}</option>
					<option value="price-asc">{m.price_asc()}</option>
					<option value="price-desc">{m.price_desc()}</option>
					<option value="number-asc">{m.number_asc()}</option>
					<option value="number-desc">{m.number_desc()}</option>
				</select>
			</div>
		</div>
		<div class="views">
			<button class="grid btn-shop in-13 uppercase" class:active={activeView === 'grid'} aria-pressed={activeView === 'grid'} onclick={() => updateParams(innerWidth.current > 1080 ? { view: 'grid', cols: activeCols } : { view: 'grid' })}>
				<span>{m.grid()}</span>
				<svg width="19" height="13" viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="8.78613" height="5.94336" fill="currentColor"/>
					<rect y="6.94336" width="8.78613" height="5.94336" fill="currentColor"/>
					<rect x="9.78613" width="8.78613" height="5.94336" fill="currentColor"/>
					<rect x="9.78613" y="6.94336" width="8.78613" height="5.94336" fill="currentColor"/>
				</svg>
			</button>
			<button class="grid-value btn-shop in-13 uppercase" class:active={activeCols === initialCols-1 && activeView === 'grid'} aria-pressed={activeCols === initialCols-1 && activeView === 'grid'} onclick={() => {updateParams({ view: 'grid', cols: initialCols-1}); activeCols=initialCols-1}}>{initialCols-1}</button>
			<button class="grid-value btn-shop in-13 uppercase" class:active={activeCols === initialCols-0 && activeView === 'grid'} aria-pressed={activeCols === initialCols-0 && activeView === 'grid'} onclick={() => {updateParams({ view: 'grid', cols: initialCols-0}); activeCols=initialCols-0}}>{initialCols-0}</button>
			<button class="grid-value btn-shop in-13 uppercase" class:active={activeCols === initialCols+1 && activeView === 'grid'} aria-pressed={activeCols === initialCols+1 && activeView === 'grid'} onclick={() => {updateParams({ view: 'grid', cols: initialCols+1}); activeCols=initialCols+1}}>{initialCols+1}</button>
			<button class="list btn-shop in-13 uppercase" class:active={activeView === 'list'} aria-pressed={activeView === 'list'} onclick={() => {updateParams({ view: 'list' }); scrollY=0 }}>
				<span>{m.list()}</span>
				<svg width="19" height="8" viewBox="0 0 19 8" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect width="18.5723" height="2" fill="currentColor"/>
					<rect y="2.90674" width="18.5723" height="2" fill="currentColor"/>
					<rect y="5.81348" width="18.5723" height="2" fill="currentColor"/>
				</svg>
			</button>
		</div>
	</section>

	<section id="products" class:loaded={loaded}>
		{#key activeView}
			<div bind:this={productsContainer} class="products-container"
				data-view={activeView}
				style="--activeCols: {activeCols};"
				in:blur={{ duration: DURATION, axis: 'y', delay: DURATION }}
				out:blur={{ duration: DURATION, axis: 'y' }}
			>
				{#if activeView === 'grid'}
					{#each processedProducts as product (product.id)}
						<ProductCard product={product} />
					{/each}
					{#if pageInfo.hasNextPage}
						<div bind:this={loaderElement} class="loader-trigger">
							{#if isLoading}
								<p class="in-13 uppercase">{m.loading()}...</p>
							{/if}
						</div>
					{/if}
				{:else}
					<div class="list-desktop">
						{#each processedProducts as product (product.id)}
							<a 
								class="product" 
								class:active={hoveredProduct?.id === product.id}
								href="/shop/{product.handle}" 
								onmouseenter={(e) => {if (e.type == "click") hoveredProduct = product}}
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
						{/each}
					</div>
					{#if innerWidth.current <= parseInt(bp.lg)}
						<ShopListMobile {processedProducts} bind:hoveredProduct />
					{/if}
				{/if}
			</div>
		{/key}
	</section>
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

main {
	margin-bottom: var(--sp-120);

	@media (width <= #{$lg}) {
		overflow: hidden;
	}
}
#hero {
	height: 70vh;
	min-height: 500px;
	max-height: 650px;
	position: relative;
	
	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 50%;
		z-index: 1;
		pointer-events: none;
		background: linear-gradient(
			to bottom, 
			rgba(0, 0, 0, .5) 50%, 
			rgba(0, 0, 0, 0) 100%
		);
	}
	@media (width <= #{$lg}) {
		height: 60vh;
		min-height: 350px;
		max-height: 500px;
	}
	@media (width <= #{$sm}) {
		max-height: 400px;
	}
}

#list-img {
	background-color: var(--lightGray);
	position: sticky;
	margin-left: auto;
	top: 0;
	right: 0;
	width: 50%;
	height: 100vh;
	z-index: -1;
	pointer-events: none;
	opacity: 1;
	&.loaded { opacity: 1; }

	.img-wrapper {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100vh;
	}

	@media (width <= #{$lg}) {
		height: auto;
		width: 100%;
		height: 60vh;
		min-height: 350px;
		max-height: 500px;
		z-index: 6;
		
		.img-wrapper {
			position: relative;
			height: 60vh;
			min-height: 350px;
			max-height: 500px;
		}
	}
	@media (width <= #{$sm}) {
		max-height: 400px;
		.img-wrapper {
			max-height: 400px;
		}
	}
}

#filters {
	display: flex;
	justify-content: space-between;
	padding: var(--sp-48) var(--sp-24);
	column-gap: var(--sp-24);
	align-items: center;
	opacity: 1;
	&.loaded { opacity: 1; }

	&[data-view="list"] {
		margin-top: calc(-100vh + var(--sp-200));
	}

	.categories-and-sorting {
		display: flex;
		column-gap: var(--sp-48);
	
		.categories {
			display: flex;
			align-items: baseline;
			flex-wrap: wrap;
			gap: var(--sp-24);
			justify-content: center;

			select {
				display: none;
			}
		}

		.sorting {
			display: flex;
			align-items: baseline;
			align-items: center;
			gap: var(--sp-12);

			select {
				background: transparent;
				border: none;
				color: inherit;
				font-family: inherit;
				font-size: inherit;
				cursor: pointer;
				outline: none;
			}
		}
	}

	.views {
		display: flex;
		align-items: baseline;
		column-gap: var(--sp-6);

		button svg {
			display: none;
		}

		.grid {
			margin-right: var(--sp-4);
		}
		.list {
			margin-left: var(--sp-18);
		}
	}

	@media (width <= #{$lg}) {
		row-gap: var(--sp-12);
		padding: var(--sp-24) 0;
		margin: 0 var(--sp-12);
		align-items: flex-start;

		.categories-and-sorting {
			row-gap: var(--sp-6);
			column-gap: var(--sp-36);
			width: 100%;
		
			.categories {
				justify-content: flex-start;
				row-gap: var(--sp-12);
				column-gap: var(--sp-12);

				.category {
					display: none;
				}

				select {
					display: block;
					background: transparent;
					border: none;
					color: inherit;
					font-family: inherit;
					font-size: inherit;
					cursor: pointer;
					outline: none;
				}
			}

			.sorting {

				select {

				}
			}
		}
	}

	@media (width <= #{$lg}) {
		&[data-view="list"] {
			margin-top: unset;
			justify-content: flex-end;
			top: clamp(350px, 60vh, 500px);
			position: sticky;
			background-color: var(--white);
			z-index: 5;

			.categories-and-sorting {
				display: none;
			}
		}
		
		.views {
			align-items: center;
			justify-content: flex-end;
			
			button {
				span { display: none; }
				svg { display: block; }
			}

			.grid {
				margin: 0;
				width: max-content;
			}
			.grid-value {
				display: none;
			}
			.list {
				margin: 0;
				width: max-content;
			}
		}
	}

	@media (width <= #{$sm}) {
		&[data-view="list"] {
			top: clamp(350px, 60vh, 400px);
		}
	}

	@media (width <= #{$xs}) {
		.categories-and-sorting {
			flex-direction: column;
		
			.categories {

				label {
					min-width: 70px;
				}
			}

			.sorting {

				label {
					min-width: 70px;
				}
			}
		}
	}

	@media (width <= #{$xxs}) {
		flex-direction: column-reverse;
		row-gap: var(--sp-24);
	}
}

#products {
    padding: 0 var(--sp-24);
	opacity: 0;

	&.loaded { opacity: 1; }

    .products-container {
        &[data-view="grid"] {
            display: grid;
            grid-template-columns: repeat(var(--activeCols), 1fr);
            column-gap: var(--sp-6);
            row-gap: var(--sp-80);
			align-items: start;

			 @media (width <= #{$lg}) {
				padding: 0 var(--sp-12);
			}
        }

        &[data-view="list"] {
            display: flex;
            flex-direction: column;

            .list-desktop {
                display: flex;
                flex-direction: column;
				
                @media (width <= #{$lg}) {
                    display: none;
                }

                .product {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 var(--sp-24) 0 0;
                    width: 50%;

                    .title {
                        opacity: .2;

                        &.soldOut {
                            text-decoration: line-through;
                        }
                    }

                    .info {
                        display: flex;
                        flex-direction: column;
                        text-align: right;
                        opacity: 0;
                    }

                    &.active {
                        .title {
                            opacity: 1;
                        }
                        .info {
                            opacity: 1;
                        }
                    }
                }
            }
        }
    }

    .loader-trigger {
		aspect-ratio: 3/4;
		background-color: var(--lightGray);
        display: flex;
        align-items: center;
        justify-content: center;
    }

	@media (width <= #{$lg}) {
		padding: 0;

		.products-container {
			&[data-view="grid"] {
				row-gap: var(--sp-40);
			}
		}
	}

	@media (width <= #{$xxs}) {
		.products-container {
			&[data-view="grid"] {
				grid-template-columns: repeat(1, 1fr);
			}
		}
	}
}
</style>