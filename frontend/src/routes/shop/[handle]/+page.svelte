<script>
    // imports
    import ImageShopify from '$lib/components/ImageShopify.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';
    import SliderProductsMobile from '$lib/components/SliderProductsMobile.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import { formatPrice } from '$lib/utils/price.js';
    import { renderRichText } from '$lib/utils/shopify.js';
    import bp from '$lib/scss/breakpoints.module.scss';
    import { innerWidth } from 'svelte/reactivity/window';

    // stores
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { getMenu } from '$lib/stores/menu.svelte.js';
    import SliderHalf from '$lib/components/SliderHalf.svelte';
    import SliderMarqueeShopify from '$lib/components/SliderMarqueeShopify.svelte';

    // functions
    let menuer = getMenu(); menuer.setDark(true); menuer.setDifference(true); menuer.setSmall(true);
    let { data } = $props();
    const { product } = data;
    const keysObj = $derived(product.custom_keys_values?.find(item => item?.key === "custom_keys"));
    const valuesObj = $derived(product.custom_keys_values?.find(item => item?.key === "custom_values"));
    const keysList = $derived(keysObj ? JSON.parse(keysObj.value) : []);
    const valuesList = $derived(valuesObj ? JSON.parse(valuesObj.value) : []);
</script>


<nav aria-label="Breadcrumb" class="breadcrumb-mobile in-14 {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}">
	<ol>
		<li><a href="/shop">{m.shop()}</a></li> • <li><a href="/shop/{product.handle}">{product.title}</a></li>
	</ol>
</nav>
<main id="product-page">
	<section id="product">
		{#if product.images.nodes.length > 0}
			<div class="left">
				{#each product.images.nodes as image}
					<ImageShopify {image} />
				{/each}
			</div>
			{#if innerWidth.current <= parseInt(bp.lg)}
				<div class="slider-wrapper">
					<SliderMarqueeShopify slides={product.images.nodes} />
				</div>
			{/if}
		{/if}
		<div class="right">
			<p class="breadcrumb in-14"><a href="/shop">{m.shop()}</a> • <a class="uppercase" href="/shop/{product.handle}">{product.title}</a></p>
			<h1 class="title wo-36">
				{#if product.collections?.nodes?.length > 0}
					<span class="collection">{product.collections.nodes[0].singular?.value || product.collections.nodes[0].title}</span>
				{/if}
				{product.title}
			</h1>
			<p class="price in-18">
				{#if product.availableForSale}
					{formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
				{:else}
					{m.sold_out()}
				{/if}
			</p>

			{#if product.descriptionHtml}
				<div class="description wo-16">
					{@html product.descriptionHtml}
				</div>
			{/if}

			{#if product.length || product.total_length || keysList.length > 0}
				<div class="measurements metafields in-14">
					<h3 class="metafields-title in-13 uppercase">{m.measurements()}</h3>
					{#if product.length}
						<p class="metafield">
							<span class="key">{m.length()}</span>
							<span class="value">{product.length.value} cm</span>
						</p>
					{/if}
					{#if product.total_length}
						<p class="metafield">
							<span class="key">{m.total_length()}</span>
							<span class="value">{product.total_length.value} cm</span>
						</p>
					{/if}
					{#if keysList.length > 0}
						{#each keysList as label, i}
							<p class="metafield">
								<span class="key">{label}</span>
								<span class="value">{valuesList[i] || ''}</span>
							</p>
						{/each}
					{/if}
				</div>
			{/if}

			{#if product.details}
				<div class="details metafields in-14">
					<h3 class="metafields-title in-13 uppercase">{m.details()}</h3>
					<div class="details">
						{@html renderRichText(product.details)}
					</div>
				</div>
			{/if}

			{#if product.variants.nodes.length > 0 && product.availableForSale}
			<div class="btns">
				<button 
					class="btn-m in-15 uppercase" 
					onclick={() => cartStore.addItem(product.variants.nodes[0].id)}
				>
					{m.add_to_cart()}
				</button>
				{#if data.infoEmail}
					<a class="btn-s in-15 uppercase" href="mailto:{data.infoEmail}?subject={product.title} – {m.info_request()}">{m.ask_informations()}</a>
				{/if}
			</div>
			{/if}
		</div>
	</section>
	<section id="related">
		<h4 class="section-title wo-24">{m.you_may_like()}</h4>
		<a class="cta btn-s in-13 uppercase" href="/shop">{m.see_all()} →</a>
		{#if data.related}
			<div class="related">
				{#each data.related as relatedProduct}
					<ProductCard product={relatedProduct} />
				{/each}
			</div>
			{#if innerWidth.current <= parseInt(bp.lg)}
				<SliderProductsMobile products={data.related} cover={true}/>
			{/if}
		{/if}
	</section>
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

	#product-page {
		#product {
			display: flex;
			height: fit-content;

			.left  {
				display: flex;
				flex-direction: column;
				// width: calc(100vh / 4*3);
				// max-width: 50vw;
				width: 50%;
			};

			.right {
				// width: calc(100vw - (100vh / 4*3));
				// min-width: 50vw;
				width: 50%;
				padding: var(--sp-150) var(--sp-24);
				position: sticky;
				top: 0;
				height: fit-content;

				* {
					max-width: 600px;
				}

				.title {
					margin-top: var(--sp-15);
				}

				.price {
					margin-top: var(--sp-10);
				}

				.description {
					margin-top: var(--sp-24);
				}

				.metafields {
					margin-top: var(--sp-40);

					&+.metafields {
						margin-top: var(--sp-30);
					}

					.metafields-title {
						margin-bottom: var(--sp-14);
					}
					.metafield {
						display: flex;
						column-gap: var(--sp-24);

						.key {
							min-width: 150px;
						}
					}
				}

				.btns {
					display: flex;
					flex-wrap: wrap;
					align-items: baseline;
					column-gap: var(--sp-24);
					row-gap: var(--sp-12);
					margin-top: var(--sp-40);
				}
			}

			@media (width <= #{$lg}) {
				flex-direction: column;

				.left {
					display: none;
				}

				.slider-wrapper {
					margin-top: var(--sp-100);
				}

				.right {
					width: 100%;
					padding: var(--sp-24) var(--sp-12);
					position: relative;
					top: unset;

					.breadcrumb {
						display: none;
					}

					.title {
						text-align: center;
					}
					.price {
						text-align: center;
					}
					.description {
						margin-top: var(--sp-39);
					}
				}
			}
		}

		#related {
			padding: var(--sp-100) var(--sp-24) var(--sp-200);
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: baseline;
			column-gap: var(--sp-24);

			.section-title {
				flex-basis: auto;
			}
			.cta {
				flex-basis: auto;
			}
			.related {
				flex-basis: 100%;
				margin-top: var(--sp-40);
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				column-gap: var(--sp-6);
			}

			@media (width <= #{$lg}) {
				padding: var(--sp-100) 0 var(--sp-200);
				display: grid;
				grid-template-columns: repeat(1, 1fr);

				.section-title {
					padding: 0 var(--sp-12) var(--sp-20);
					grid-row: 1;
				}
				.cta {
					grid-row: 3;
					padding: var(--sp-60) var(--sp-12) 0;
				}
				.related {
					display: none;
				}
			}
		}
	}
</style>