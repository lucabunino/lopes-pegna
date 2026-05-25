<script>
    // imports
    import ImageShopify from '$lib/components/ImageShopify.svelte';
    import ProductCard from '$lib/components/ProductCard.svelte';
	import SliderHalf from '$lib/components/SliderHalf.svelte';
    import SliderMarqueeShopify from '$lib/components/SliderMarqueeShopify.svelte';
    import SliderProductsMobile from '$lib/components/SliderProductsMobile.svelte';
    import BundleItem from '$lib/components/BundleItem.svelte';
    import Head from '$lib/components/Head.svelte';
    import PortableTextStylePolicy from '$lib/components/portableTextStyles/PortableTextStylePolicy.svelte';
    import { m } from '$lib/paraglide/messages.js';
    import { formatPrice } from '$lib/utils/price.js';
    import { renderRichText } from '$lib/utils/shopify.js';
    import bp from '$lib/scss/breakpoints.module.scss';
    import { innerWidth } from 'svelte/reactivity/window';
	import { PortableText } from '@portabletext/svelte';

    // stores
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { getMenu } from '$lib/stores/menu.svelte.js';
    import { localizeHref } from '$lib/paraglide/runtime.js';

    // functions
    let menuer = getMenu(); menuer.setDark(true); menuer.setDifference(true); menuer.setSmall(true);
    let { data } = $props();
	$inspect(data)
    let { product } = $derived(data);
	$inspect(product)
    const keysObj = $derived(product.custom_keys_values?.find(item => item?.key === "custom_keys"));
    const valuesObj = $derived(product.custom_keys_values?.find(item => item?.key === "custom_values"));
    const keysList = $derived(keysObj ? JSON.parse(keysObj.value) : []);
    const valuesList = $derived(valuesObj ? JSON.parse(valuesObj.value) : []);
</script>

<Head />
<nav aria-label="Breadcrumb" class="breadcrumb-mobile in-14 {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}">
	<ol>
		<li><a href={localizeHref(`/shop`)}>{m.shop()}</a></li> • <li><a href={localizeHref(`/shop/${product.handle}`)}>{product.title}</a></li>
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
			<div class="left-mobile">
				{#if innerWidth.current <= parseInt(bp.lg)}
					<SliderMarqueeShopify slides={product.images.nodes} />
				{/if}
			</div>
		{/if}
		<div class="right">
			<p class="breadcrumb in-14"><a href="/shop">{m.shop()}</a> • <a class="uppercase" href="/shop/{product.handle}">{product.title}</a></p>
			<h1 class="title wo-36 uppercase">
				{#if product.collections?.nodes?.length > 0}
					<span class="collection normalcase">{product.collections.nodes[0].singular?.value || product.collections.nodes[0].title}</span>
				{/if}
				{product.title}
			</h1>
			<p class="price in-18">
				{#if product.availableForSale}
                    {#if product.variants?.nodes[0]?.compareAtPrice}
                        <span class="compare-at-price">{formatPrice(product.variants.nodes[0].compareAtPrice.amount, product.variants.nodes[0].compareAtPrice.currencyCode)}</span>
                    {/if}
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
			{#if data.partOfSets?.length > 0}
				<h3 class="bundle sets metafields metafields-title in-13 uppercase">{m.part_of_set()} {#each data.partOfSets as parentSet}<a class="tag" href={localizeHref(`/shop/${parentSet.handle}`)}>{parentSet.title}</a>{/each}</h3>
			{/if}
			{#if product.variants.nodes.length > 0 && product.availableForSale}
				<div class="btns">
					<button 
						class="cart btn-m in-15 uppercase" 
						onclick={() => cartStore.addItem(product.variants.nodes[0].id, product.variants.nodes[0]?.components?.nodes)}
					>
						{m.add_to_cart()}
					</button>
					{#if data.infoEmail}
						<a class="info btn-s in-15 uppercase" href="mailto:{data.infoEmail}?subject={product.title} – {m.info_request()}">{m.ask_informations()}</a>
					{/if}
				</div>
			{/if}
			{#if product.variants.nodes[0]?.components?.nodes?.length > 0}
				<div class="bundle metafields in-14">
					<h3 class="metafields-title in-13 uppercase">{m.set_contains()}</h3>
					<div class="products">
						{#each product.variants.nodes[0].components.nodes as component}
							<BundleItem product={component.productVariant} />
						{/each}
					</div>
				</div>
			{/if}
			{#if data.shopPolicies?.length > 0}
				<div class="policies in-14">
					{#each data.shopPolicies as policy}
						<details class="accordion">
							<summary class="summary">{policy.title} <span class="icon">↓</span></summary>
							{#if policy.content}
								<div class="content portableText policy in-14">
									<PortableText 
										value={policy.content} 
										components={{
											block: {
												h2: PortableTextStylePolicy,
												h3: PortableTextStylePolicy,
												h4: PortableTextStylePolicy,
												h5: PortableTextStylePolicy,
												h6: PortableTextStylePolicy,
												normal: PortableTextStylePolicy,
											},
											listItem: PortableTextStylePolicy,
											marks: {
												link: PortableTextStylePolicy,
											},
										}}
									/>
								</div>
							{/if}
						</details>
					{/each}
				</div>
			{/if}
		</div>
	</section>
	<section id="related">
		<h4 class="section-title wo-24">{m.you_may_like()}</h4>
		<a class="cta btn-s in-13 uppercase" href={localizeHref(`/shop`)}>{m.see_all()} →</a>
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
				height: fit-content;
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
                    display: flex;
                    column-gap: var(--sp-10);

                    .compare-at-price {
                        text-decoration: line-through;
                        color: var(--darkGray);
                    }
				}

				.description {
					margin-top: var(--sp-24);
				}

				.metafields {
					margin-top: var(--sp-40);

					&+.metafields {
						margin-top: var(--sp-24);
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

				.bundle {
					width: 100%;
					
					&.sets {
						display: inline-flex;
						column-gap: .3em;
						
						.tag {
							margin-top: -0.3em;
							&:hover {
								background-color: var(--black);
							}
						}
					}

					.products {
						margin-top: var(--sp-14);
						width: 100%;
						display: flex;
						flex-wrap: wrap;
						column-gap: var(--sp-24);
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

				.policies {
					margin-top: var(--sp-60);

					.accordion {
						border-top: 1px solid var(--black);
						
						&:last-child {
							border-bottom: 1px solid var(--black);
						}

						summary {
							padding: var(--sp-12) 0;
							list-style: none;
							cursor: pointer;
							display: flex;
							justify-content: space-between;
							align-items: center;

							&::-webkit-details-marker {
								display: none;
							}

							.icon {
								transition: transform 0.3s ease;
							}
						}

						&[open] summary .icon {
							transform: rotate(180deg);
						}

						.content {
							padding: var(--sp-12) 0 var(--sp-24);
						}
					}
				}
			}

			@media (width <= #{$lg}) {
				flex-direction: column;

				.left {
					display: none;
				}

				.left-mobile {
					display: block;
					margin-top: var(--sp-100);
					height: 50vh;
				}

				.right {
					width: 100%;
					padding: var(--sp-24) var(--sp-12);
					position: relative;
					top: unset;
					display: flex;
					flex-direction: column;
					align-items: center;

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
					.measurements {
						width: stretch;
					}
					.policies {
						width: stretch;
						margin-top: var(--sp-40);
					}
					.btns {
						display: contents;

						.cart {
							position: fixed;
							bottom: calc(var(--sp-30) + 1.083rem*3.2 + 2px + var(--sp-3));
							left: 0;
							z-index: 8;
							background: var(--black);
							color: var(--white);
							width: stretch;
							max-width: unset;
							margin: 0 var(--sp-12);
							text-align: center;

							&:hover {
								background: var(--lightGray);
								border-color: var(--lightGray);
								color: var(--black);
							}
						}

						.info {
							margin-top: var(--sp-40);
							width: stretch;
							text-align: center;
							border: solid 1px var(--black);
							padding: 1em 2em;

							&:hover {
								background-color: var(--black);
								color: var(--white);

								&::before {
									width: 0;
								}
							}
						}
					}
				}
			}

			@media (width <= #{$xs}) {
				.metafields {
					.metafields-title {
						margin-bottom: var(--sp-14);
					}
					.metafield {
						flex-direction: column;

						&+.metafield {
							margin-top: var(--sp-6);
						}
						
						.key {
							min-width: unset;
						}
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