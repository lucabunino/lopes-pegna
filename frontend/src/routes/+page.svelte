<script>
	import { m } from '$lib/paraglide/messages';

    import Image from '$lib/components/Image.svelte';
	import Media from '$lib/components/Media.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';
	import SliderMarquee from '$lib/components/SliderMarquee.svelte';
    import SliderHalf from '$lib/components/SliderHalf.svelte';
    import SliderSets from '$lib/components/SliderSets.svelte'; 

	import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(false); menuer.setSmall(false);
	
	let { data } = $props()
	
	let scrollY = $state(0)
	let products = $state(undefined)
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
		<pre>Shopping from: {data.localization.country.name}</pre>
		<section id="products" bind:this={products}>
			{#if data.homepage.productsText}
				<h3 class="wo-24 section-title">{data.homepage.productsText}</h3>
				<a class="cta btn-s in-13 uppercase" href="/shop">{m.wear_me()} →</a>
			{/if}
			<div class="products">
				{#each data.homepage.products as product, i}
					<ProductCard {product}/>
				{/each}
			</div>
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
			{#if data.homepage.aboutText2}<h4 class="wo-24">{data.homepage.aboutText2}</h4>{/if}
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
						<SliderSets products={data.homepage.setsProducts} cover={true}/> 
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
		}
	}
	#products {
		padding: var(--sp-80) var(--sp-24);
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
		
		.products {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			column-gap: var(--sp-6);
		}
	}
	#about {
		padding: var(--sp-80) 0;
		display: flex;
		align-items: baseline;
		flex-wrap: wrap;
		column-gap: var(--sp-24);

		.section-title {
			padding-left: var(--sp-24);
			flex-basis: 50%;
			margin-top: var(--sp-80);
		}
		.cta {
			padding-right: var(--sp-24);
			flex-basis: auto;
			margin-left: auto;
			text-align: right;
		}
		h4 {
			padding-left: var(--sp-24);
			margin-top: var(--sp-30);
			flex-basis: 100%;
		}
		.slider-wrapper {
			margin-top: var(--sp-38);
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
	}
	#beads {
		padding: var(--sp-200) var(--sp-24) var(--sp-80);
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
	}
</style>