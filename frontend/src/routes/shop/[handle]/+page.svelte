<script>
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { m } from '$lib/paraglide/messages.js';
    
    let { data } = $props();
    const { product } = data;

	// Header setup
	import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu(); 
    menuer.setDark(true); 
    menuer.setDifference(false); 
    menuer.setSmall(true);
</script>

<main id="product">
	{#if product.images.nodes.length > 0}
        <div class="left">
            {#each product.images.nodes as image}
                <img src={image.url} alt={image.altText} style="width: 200px; height: auto;" />
            {/each}
        </div>
    {/if}
	<div class="right">
		<h1>{product.title}</h1>
		<p>Handle: {product.handle}</p>
		<p>Type: {product.productType}</p>
		<p>Vendor: {product.vendor}</p>
		<p>Available: {product.availableForSale ? 'Yes' : 'No'}</p>
		
		<div>
			<h3>Description</h3>
			{@html product.descriptionHtml}
		</div>

		<div>
			<h3>Price</h3>
			<p>
				{product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
				{#if product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount}
					- {product.priceRange.maxVariantPrice.amount} {product.priceRange.maxVariantPrice.currencyCode}
				{/if}
			</p>
		</div>

		{#if product.options.length > 0}
			<div>
				<h3>Options</h3>
				{#each product.options as option}
					<p><strong>{option.name}:</strong> {option.values.join(', ')}</p>
				{/each}
			</div>
		{/if}

		{#if product.variants.nodes.length > 0}
			<div>
				<h3>Variants</h3>
				<ul>
					{#each product.variants.nodes as variant}
						<li>
							{variant.title} - {variant.price.amount} {variant.price.currencyCode} 
							({variant.availableForSale ? 'In Stock' : 'Out of Stock'})
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		{#if product.metafields && product.metafields.length > 0}
			<div>
				<h3>Metafields</h3>
				{#each product.metafields as field}
					{#if field}
						<p><strong>{field.key}:</strong> {field.value}</p>
					{/if}
				{/each}
			</div>
		{/if}

		{#if product.variants.nodes.length > 0}
			<button 
				class="btn-m in-14 uppercase" 
				onclick={() => cartStore.addItem(product.variants.nodes[0].id)}
			>
				{m.add_to_cart()}
			</button>
		{/if}
	</div>
</main>

<style lang="scss">
	#product {
		display: grid;
		grid-template-columns: repeat(2, 1fr);

		.left:  {
			display: flex;
			flex-direction: column;
		};

		.right {
			padding: var(--sp-200) var(--sp-24);
		}
	}
</style>