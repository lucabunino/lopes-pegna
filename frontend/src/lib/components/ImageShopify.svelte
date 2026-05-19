<script>
    // imports

    // stores

    // functions
    let { 
        image,
        className = "",
        loading = "lazy",
        alt = "",
    } = $props();

    let isLoaded = $state(false);
</script>

{#if image}
	<div 
		class="image-wrapper {className}" 
		style:background-image="url({image.lqip ? image.lqip : undefined})"
	>
		<img
		src={image.url}
		{loading}
		alt={alt || image.altText}
		width={image.width}
		height={image.height}
		class:loaded={isLoaded}
		onload={() => isLoaded = true}
		/>
	</div>
{/if}

<style lang="scss">
    .image-wrapper {
        position: relative;
        display: block;
        overflow: hidden;
		background-color: var(--lightGray);
		aspect-ratio: 3/4;
        background-size: cover;
        background-position: center;
		width: 100%;
		height: 100%;
		object-fit: cover;

        img {
            width: 100%;
            height: auto;
            display: block;
            opacity: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;

            &.loaded {
                opacity: 1;
            }
        }

		&.sliderMarqueeShopify {
			img {
				width: 60vw;
			}
		}
    }
</style>
