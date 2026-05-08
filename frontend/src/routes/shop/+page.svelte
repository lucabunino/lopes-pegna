<script>
    import Media from '$lib/components/Media.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { getLocale } from '$lib/paraglide/runtime';
    import { collectionSlugMap } from '$lib/collectionSlugs';

    let { data } = $props();
    const currentLocale = getLocale();

    // State for products and pagination
    let products = $state(data.products || []);
    let pageInfo = $state(data.pageInfo || { hasNextPage: false, endCursor: null });
    let loaded = $state(false);
    let isLoading = $state(false);
    
    // Derived state for filtering and sorting from URL
    // Convert localized slug back to canonical (English) handle for filtering
    let activeCategory = $derived.by(() => {
        const slug = page.url.searchParams.get('category') || 'all';
        if (slug === 'all') return 'all';
        return collectionSlugMap[currentLocale]?.[slug] || slug;
    });
    
    let activeSort = $derived(page.url.searchParams.get('sort') || 'new-asc');
    let activeView = $derived(page.url.searchParams.get('view') || 'grid');
    let initialCols = $derived( innerWidth.current <= 1080 ? 2 : innerWidth.current <= 1440 ? 3 : innerWidth.current <= 1700 ? 4 : 5);
    let activeCols = $derived(initialCols);
    
    // Preview state for list view
    let hoveredProduct = $state(products[0]);

    let processedProducts = $derived.by(() => {
        let result = products;

        // Grid only displays available products
        if (activeView === 'grid') {
            result = result.filter(p => p.availableForSale);
        }

        // Category filter using canonical handle
        if (activeCategory !== 'all') {
            result = result.filter(p => p.collections?.nodes?.some(c => c.handle === activeCategory));
        }

        // Sorting logic
        result = [...result].sort((a, b) => {
            switch (activeSort) {
                case 'price-asc':
                    return a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount;
                case 'price-desc':
                    return b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount;
                case 'number-asc':
                    const numA = parseInt(a.title.replace(/\D/g, '')) || 0;
                    const numB = parseInt(b.title.replace(/\D/g, '')) || 0;
                    return numA - numB;
                case 'number-desc':
                    const numADesc = parseInt(a.title.replace(/\D/g, '')) || 0;
                    const numBDesc = parseInt(b.title.replace(/\D/g, '')) || 0;
                    return numBDesc - numADesc;
                case 'new-asc':
                    return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                case 'new-desc':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                default:
                    return 0; // Default Shopify order
            }
        });
        
        return result;
    });

	// Header setup
	import { getMenu } from '$lib/stores/menu.svelte.js';
    import { blur, fade, fly, slide } from 'svelte/transition';
    import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	let menuer = getMenu(); 
	menuer.setDark(false);
	menuer.setSmall(false);

	$effect(() => {
	    if (activeView === 'list') {
            menuer.setDifference(true);
        } else if (activeView === 'grid') {
			menuer.setDifference(false);
		}
		loaded = true
	});

	async function loadMore() {
		if (isLoading || !pageInfo.hasNextPage) return;
        isLoading = true;
        try {
            const response = await fetch('/shop/api/load-more', {
                method: 'POST',
                body: JSON.stringify({ after: pageInfo.endCursor }),
                headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();
            
            if (result.products) {
                products = [...products, ...result.products];
                pageInfo = result.pageInfo;
            }
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            isLoading = false;
        }
    }

    // Intersection Observer for Infinite Scroll
    let loaderElement = $state();
    onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, { rootMargin: '200px' });

        if (loaderElement) observer.observe(loaderElement);
        return () => observer.disconnect();
    });

    function updateParams(newParams) {
        const params = new URLSearchParams(page.url.searchParams);
        for (const [key, value] of Object.entries(newParams)) {
            if (value === 'all' || !value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        }
        goto(`?${params.toString()}`, { replaceState: true, keepFocus: true, noScroll: true });
    }
</script>

	<main>
		{#if data.shop.heroMedia && activeView === "grid"}
			<section id="hero" transition:slide={{ duration: 200, axis: 'y' }}>
				<Media media={data.shop.heroMedia} cover={true}/>
			</section>
		{/if}

		{#if activeView === 'list'}
			<div id="list-img" class:loaded={loaded}>
				{#key hoveredProduct}
					<div class="img-wrapper" in:fade|global={{ duration: 200 }} out:fade|global={{ duration: 200 }}>
						{#if hoveredProduct.listImage?.reference?.image}
							<img class="img" loading="eager" src={hoveredProduct.listImage.reference.image.url} alt={hoveredProduct.listImage.reference.image.altText}>
						{/if}
					</div>
				{/key}
			</div>
		{/if}

		<section id="filters" class="in-14" class:loaded={loaded} data-view={activeView}>
			<div class="categories-and-sorting">
				<div class="categories">
					<label class="uppercase">{m.show()}</label>
					<button class="btn-shop btn-s" 
						class:active={activeCategory === 'all'} 
						aria-pressed={activeCategory === 'all'}
						onclick={() => updateParams({ category: 'all' })}
					>
						{m.all()}
					</button>
					{#each data.categories as category}
						{@const slug = collectionSlugMap[currentLocale] ? Object.keys(collectionSlugMap[currentLocale]).find(key => collectionSlugMap[currentLocale][key] === category.slug) || category.slug : category.slug}
						<button class="btn-shop btn-s" 
							class:active={page.url.searchParams.get('category') === slug} 
							aria-pressed={page.url.searchParams.get('category') === slug}
							onclick={() => updateParams({ category: slug })}
						>
							{category.label}
						</button>
					{/each}
				</div>
				<div class="sorting">
					<label class="uppercase" for="sort-select">{m.sort()}</label>
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
			<div class="views uppercase">
				<button class="grid btn-shop" class:active={activeView === 'grid'} aria-pressed={activeView === 'grid'} onclick={() => updateParams({ view: 'grid', cols: 5 })}>{m.grid()}</button>
				<!-- <button class="grid-value btn-shop" class:active={activeCols === initialCols-1 && activeView === 'grid'} aria-pressed={activeCols === initialCols-1 && activeView === 'grid'} onclick={() => updateParams({ view: 'grid', cols: initialCols-1 })}>{initialCols-1}</button>
				<button class="grid-value btn-shop" class:active={activeCols === initialCols-0 && activeView === 'grid'} aria-pressed={activeCols === initialCols-0 && activeView === 'grid'} onclick={() => updateParams({ view: 'grid', cols: initialCols-0 })}>{initialCols-0}</button>
				<button class="grid-value btn-shop" class:active={activeCols === initialCols+1 && activeView === 'grid'} aria-pressed={activeCols === initialCols+1 && activeView === 'grid'} onclick={() => updateParams({ view: 'grid', cols: initialCols+1 })}>{initialCols+1}</button> -->
				<button class="grid-value btn-shop" class:active={activeCols === initialCols-1 && activeView === 'grid'} aria-pressed={activeCols === initialCols-1 && activeView === 'grid'} onclick={() => activeCols=initialCols-1}>{initialCols-1}</button>
				<button class="grid-value btn-shop" class:active={activeCols === initialCols-0 && activeView === 'grid'} aria-pressed={activeCols === initialCols-0 && activeView === 'grid'} onclick={() => activeCols=initialCols-0}>{initialCols-0}</button>
				<button class="grid-value btn-shop" class:active={activeCols === initialCols+1 && activeView === 'grid'} aria-pressed={activeCols === initialCols+1 && activeView === 'grid'} onclick={() => activeCols=initialCols+1}>{initialCols+1}</button>
				<button class="list btn-shop" class:active={activeView === 'list'} aria-pressed={activeView === 'list'} onclick={() => updateParams({ view: 'list' })}>{m.list()}</button>
			</div>
		</section>

		<section id="products" class:loaded={loaded}>
			{#key activeView}
				<div class="products-container"
					data-view={activeView}
					style="--activeCols: {activeCols};"
					in:blur={{ duration: 200, axis: 'y', delay: 200 }}
					out:blur={{ duration: 200, axis: 'y' }}
				>
					{#if activeView === 'grid'}
						{#each processedProducts as product (product.id)}
							<ProductCard product={product} />
						{/each}
						{#if pageInfo.hasNextPage}
							<div bind:this={loaderElement} class="loader-trigger">
								{#if isLoading}
									<p class="in-14 uppercase">{m.loading()}...</p>
								{/if}
							</div>
						{/if}
					{:else}
						{#each processedProducts as product (product.id)}
							<a 
								class="product" 
								class:active={hoveredProduct?.id === product.id}
								href="/shop/{product.handle}" 
								onmouseenter={() => hoveredProduct = product}
							>
								<span class="title wo-36 uppercase {product.availableForSale ? 'availableForSale' : 'soldOut'}">{product.title}</span>
								<span class="info in-14 uppercase">
									{#if product.collections?.nodes?.length > 0}
										<span class="collection">{product.collections.nodes[0].singular.value}</span>
									{/if}
									{#if product.availableForSale}
										{new Intl.NumberFormat(getLocale(), {
											style: 'currency',
											currency: product.priceRange.minVariantPrice.currencyCode
										}).format(product.priceRange.minVariantPrice.amount)}
									{:else}
										{m.sold_out()}
									{/if}
								</span>
							</a>
						{/each}
					{/if}
				</div>
			{/key}
		</section>
	</main>

<style lang="scss">
main {
	padding-bottom: var(--sp-120);
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
	opacity: 0;
	&.loaded { opacity: 1; }

	.img-wrapper {
		position: absolute;
		top: 0;
		right: 0;
		width: 100%;
		height: 100vh;

		.img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
}

#filters {
	display: flex;
	justify-content: space-between;
	padding: var(--sp-48) var(--sp-24);
	column-gap: var(--sp-24);
	align-items: center;
	opacity: 0;
	&.loaded { opacity: 1; }

	&[data-view="list"] {
		margin-top: calc(-100vh + var(--sp-200));
	}

	.categories-and-sorting {
		display: flex;
		column-gap: var(--sp-48);
	
		.categories {
			display: flex;
			flex-wrap: wrap;
			gap: var(--sp-24);
			justify-content: center;
		}

		.sorting {
			display: flex;
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
		column-gap: var(--sp-6);

		.grid {
			margin-right: var(--sp-4);
		}
		.list {
			margin-left: var(--sp-18);
		}
	}
}

#products {
    padding: var(--sp-60) var(--sp-24) 0;
	opacity: 0;
	&.loaded { opacity: 1; }

    .products-container {
        &[data-view="grid"] {
            display: grid;
            grid-template-columns: repeat(var(--activeCols), 1fr);
            column-gap: var(--sp-6);
            row-gap: var(--sp-80);
			align-items: start;
        }

        &[data-view="list"] {
            display: flex;
            flex-direction: column;

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

    .loader-trigger {
		aspect-ratio: 3/4;
		background-color: var(--lightGray);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>