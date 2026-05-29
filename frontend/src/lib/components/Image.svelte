<script>
    // imports
    import { urlFor } from '$lib/utils/image.js';

    // stores

    // functions
    let { 
        image,
        aspectRatio = undefined, 
        className = undefined,
        loading = "lazy",
		cover = false,
		width = undefined,
		height = undefined
    } = $props();

    const asset = $derived(image?.asset);
    const metadata = $derived(asset?.metadata || {});
    const lqip = $derived(metadata.lqip);
    
    const dims = $derived(metadata.dimensions);
    const finalRatio = $derived(aspectRatio || dims.width / dims.height);

    const widths = [400, 800, 1200, 1600, 2000];
    const srcset = $derived(
        widths.map(w => {
            const h = Math.round(w / finalRatio);
            return `${urlFor(image).width(w).height(h).auto('format').url()} ${w}w`;
        }).join(', ')
    );

    const src = $derived(urlFor(image).width(1200).url());
    let isLoaded = $state(false);
</script>

<div 
    class="image-wrapper {className} {cover ? 'cover' : undefined}" 
    style:background-image="url({lqip})"
>
    <img
        {src}
        {srcset}
        {loading}
        alt={asset?.altText || ""}

		width={dims.width}
        height={dims.height}

        class:loaded={isLoaded}
        sizes="(max-width: 768px) 100vw, 80vw"
        onload={() => isLoaded = true}
    />
</div>

<style lang="scss">
@use '$lib/scss/breakpoints.module.scss' as *;

    .image-wrapper {
        position: relative;
        width: fit-content;
        height: auto;
		background-position: center;
		background-size: cover;
		display: block;

		&.cover {
			width: 100%;
			height: 100%;
			object-fit: cover;
			overflow: hidden;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
		}

		&.bookCover::after {
			content: '';
			background-image: url('$lib/img/shadow.webp');
			background-size: contain;
			background-repeat: no-repeat;
			background-position: right;
			mix-blend-mode: multiply;
			pointer-events: none;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100px;
			transform: translateX(-100%);
		}

		img {
			width: auto;
        	height: auto;
			display: block;
			opacity: 0;

			&.loaded {
				opacity: 1;
			}
		}
    }
</style>