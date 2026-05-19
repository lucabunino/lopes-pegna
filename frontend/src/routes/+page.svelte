<script>
    // imports
    import { onMount } from 'svelte';
    import { page } from '$app/state';
    import { goto } from '$app/navigation';
    import { innerWidth } from 'svelte/reactivity/window';
    import Media from '$lib/components/Media.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';
    import SliderHalf from '$lib/components/SliderHalf.svelte';
    import SliderMarquee from '$lib/components/SliderMarquee.svelte';
    import SliderProductsMobile from '$lib/components/SliderProductsMobile.svelte';
    import SliderSets from '$lib/components/SliderSets.svelte';
    import { m } from '$lib/paraglide/messages';
    import { getLocale } from '$lib/paraglide/runtime';
    import { collectionSlugMap } from '$lib/collectionSlugs';
    import bp from '$lib/scss/breakpoints.module.scss';
    
	// stores
    import { getMenu } from '$lib/stores/menu.svelte.js';

    // functions
    let { data } = $props();
	let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(false); menuer.setSmall(false);
    const currentLocale = getLocale();
    let scrollY = $state(0);
    let products = $state(undefined);
    let DURATION = $derived(innerWidth.current > 768 ? 200 : 0)
    let activeCategory = $derived.by(() => {
        const slug = page.url.searchParams.get('category') || 'all';
        if (slug === 'all') return 'all';
        return collectionSlugMap[currentLocale]?.[slug] || slug;
    });
    let activeSort = $derived(page.url.searchParams.get('sort') || 'new-asc');
    let activeView = $derived(page.url.searchParams.get('view') || 'grid');
    let initialCols = $derived(innerWidth.current <= 1080 ? 2 : innerWidth.current <= 1440 ? 3 : innerWidth.current <= 1700 ? 4 : 5);
    let activeCols = $derived(initialCols);
    let processedProducts = $derived.by(() => {
        let result = data.homepage.products || [];
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
                    return 0;
            }
        });
        
        return result;
    });
	$effect(() => {
	    if (activeView === 'list') {
            menuer.setDifference(true);
        } else if (activeView === 'grid') {
			menuer.setDifference(false);
		}
	});
</script>

<main>
	{#if data.homepage.heroMedia && data.homepage.heroText}
		<section id="hero">
			{#if data.homepage.heroMedia}
				<Media media={data.homepage.heroMedia} cover={true} className={'heroMedia'}/>
			{/if}
			{#if data.homepage.heroText}
				<div class="heroText">
					<h2 class="wo-36">{data.homepage.heroText}</h2>
					<button class="btn-s in-13 uppercase" onclick={() => {products.scrollIntoView({ behavior: "smooth" })}}>{m.discover_more()}</button>
				</div>
			{/if}
		</section>
	{/if}
	{#if data.homepage.products}
		<!-- <pre>Shopping from: {data.localization.country.name}</pre> -->
		<section id="products" bind:this={products}>
			{#if data.homepage.productsText}
				<h3 class="wo-24 section-title">{data.homepage.productsText}</h3>
				<a class="cta btn-s in-13 uppercase" href="/shop">{m.wear_me()} →</a>
			{/if}
			<div class="products desktop">
				{#each data.homepage.products as product, i}
					<ProductCard {product}/>
				{/each}
			</div>
			{#if innerWidth.current <= parseInt(bp.lg)}
				<SliderProductsMobile products={data.homepage.products} cover={true}/>
			{/if}
		</section>
	{/if}
	{#if data.homepage.aboutSlider1 && data.homepage.aboutText1 && data.homepage.aboutText2 && data.homepage.aboutSlider2}
		<section id="about">
			{#if data.homepage.aboutSlider1}
				<SliderMarquee slides={data.homepage.aboutSlider1} />
			{/if}
			{#if data.homepage.aboutText1}
				<h3 class="wo-36 section-title">{data.homepage.aboutText1}</h3>
				<a class="cta btn-s in-13 uppercase" href="/about">{m.about_lopes_pegna()} →</a>
			{/if}
			{#if data.homepage.aboutText2}<h4 class="wo-24 wo-18-mb">{data.homepage.aboutText2}</h4>{/if}
			{#if data.homepage.aboutSlider2}
				<div class="slider-wrapper">
					<SliderHalf slides={data.homepage.aboutSlider2} />
				</div>
			{/if}
		</section>
	{/if}
	{#if data.homepage.setsMedia && data.homepage.setsText && data.homepage.setsProducts}
		<section id="sets">
			{#if data.homepage.setsMedia}
				<Media media={data.homepage.setsMedia} cover={true} className={'setsMedia'} />
			{/if}
			<div class="right">
				{#if data.homepage.setsText}
					<h3 class="wo-36 section-title">{data.homepage.setsText}</h3>
				{/if}
				{#if data.homepage.setsProducts}
					<div class="sets">
						<a class="cta btn-s in-13 uppercase" href="/shop?category=set">{m.see_all()} →</a>
						{#if innerWidth.current > parseInt(bp.lg)}
							<SliderSets products={data.homepage.setsProducts} cover={true}/>
						{/if}
						{#if innerWidth.current <= parseInt(bp.lg)}
							<SliderProductsMobile products={data.homepage.setsProducts} cover={true}/>
						{/if}
					</div>
				{/if}
			</div>
		</section>
	{/if}
	{#if data.homepage.beadsText && data.homepage.beadsImages}
		<section id="beads">
			{#if data.homepage.beadsText}
				<h3 class="wo-36 section-title">{data.homepage.beadsText}</h3>
				<a class="cta btn-s in-13 uppercase" href="/beads">{m.discover_more()} →</a>
			{/if}
			{#if data.homepage.beadsImages}
				<div class="images">
					{#each data.homepage.beadsImages as beadsImage, i}
						<Media media={beadsImage} className={'beadsImages'} cover={true}/>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

	#hero {
		height: 100vh;
		position: relative;

		.heroText {
			position: absolute;
			z-index: 0;
			bottom: var(--sp-56);
			row-gap: var(--sp-35);
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
			color: var(--white);
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			padding: 0 var(--sp-24);
		}

		@media (width <= #{$lg}) {
			.heroText {
				bottom: var(--sp-148);
				row-gap: var(--sp-24);
			}
		}
	}
	#products {
		padding: var(--sp-80) var(--sp-24);
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		align-items: baseline;
		column-gap: var(--sp-24);
		row-gap: var(--sp-36);
		width: 100%;

		.section-title {
			grid-column: span 8;
		}
		.cta {
			flex-basis: auto;
			margin-left: auto;
			text-align: right;
			grid-column: span 4;
		}
		
		.products {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			column-gap: var(--sp-6);
			grid-column: span 12;
		}

		@media (width <= #{$lg}) {
			padding: var(--sp-80) 0 0;
			display: grid;
			grid-template-columns: repeat(1, 1fr);
			row-gap: var(--sp-15);

			.section-title {
				grid-row: 1;
				grid-column: span 1;
				padding: 0 var(--sp-12);
			}
			.cta {
				grid-row: 3;
				grid-column: span 1;
				text-align: left;
				margin-left: unset;
				padding: 0 var(--sp-12);
				margin-top: var(--sp-36);
			}
			
			.products {
				grid-row: 2;
				grid-column: span 1;

				&.desktop { display: none;}
			}
		}
	}
	#about {
		padding: var(--sp-80) 0;
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		align-items: baseline;
		column-gap: var(--sp-24);

		.section-title {
			padding-left: var(--sp-24);
			flex-basis: 50%;
			margin-top: var(--sp-80);
			grid-column: span 8;
		}
		.cta {
			padding-right: var(--sp-24);
			flex-basis: auto;
			margin-left: auto;
			text-align: right;
			grid-column: span 4;
		}
		h4 {
			padding: 0 var(--sp-24);
			margin-top: var(--sp-30);
			grid-column: span 12;
		}
		.slider-wrapper {
			margin-top: var(--sp-38);
			grid-column: span 12;
		}

		@media (width <= #{$lg}) {
			row-gap: var(--sp-15);

			.section-title {
				padding-left: var(--sp-12);
				margin-top: var(--sp-65);
				grid-column: span 12;
			}
			.cta {
				padding-right: var(--sp-12);
				grid-column: span 12;
				grid-row: 5;
				text-align: left;
				margin-left: var(--sp-12);
				margin-top: var(--sp-36);
			}
			h4 {
				padding: 0 var(--sp-12);
				white-space: normal;
				margin-top: var(--sp-6);
			}
			.slider-wrapper {
				margin-top: var(--sp-24);
			}
		}
	}
	#sets {
		padding: var(--sp-80) 0;
		display: flex;
		
		.right {
			padding: var(--sp-40) 0 var(--sp-60) var(--sp-24);
			width: 50%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.section-title {
				padding-right: var(--sp-24);
			}

			.sets {
				display: flex;
				flex-direction: column;
				row-gap: var(--sp-20);
				
				.cta {
					padding-right: var(--sp-24);
				}
			}
		}

		@media (width <= #{$lg}) {
			flex-direction: column;
			padding: 0;

			.right {
				width: 100%;
				padding: var(--sp-80) 0;
				row-gap: var(--sp-15);

				.section-title {
					padding: 0 var(--sp-12);
				}

				.sets {
					flex-direction: column-reverse;
					
					.cta {
						padding: 0 var(--sp-12);
						margin-top: var(--sp-36);
					}
				}
			}
		}
	}
	#beads {
		padding: var(--sp-200) var(--sp-24) var(--sp-56);
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		column-gap: var(--sp-24);
		row-gap: var(--sp-36);

		.section-title {
			flex-basis: 50%;
		}
		.cta {
			flex-basis: auto;
			margin-left: auto;
			text-align: right;
		}

		.images {
			width: stretch;
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			column-gap: var(--sp-6);
			margin: 0 calc(var(--sp-24)*-1);
		}

		@media (width <= #{$lg}) {
			display: grid;
			grid-template-columns: repeat(1, 1fr);
			row-gap: var(--sp-15);
			padding: 0 0 var(--sp-80);

			.section-title {
				grid-row: 2;
				text-align: center;
				margin-top: var(--sp-24);
				padding: 0 var(--sp-12);
			}
			.cta {
				grid-row: 3;
				text-align: center;
				margin: auto auto var(--sp-24);
			}

			.images {
				display: contents;
			}
		}
	}
</style>