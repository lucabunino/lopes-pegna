
<script>
    // imports
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { register } from 'swiper/element/bundle';
    import Media from './Media.svelte';
    import ProductCard from './ProductCard.svelte';
    import { urlFor } from '$lib/utils/image.js';

    // stores

    // functions
    register();
    let swiperEl = $state();
    let { products } = $props();

    onMount(() => {
        const swiperParams = {
			loop: true,
			slidesPerView: 2.5,
            spaceBetween: 6,
			direction: "horizontal",
            mousewheel: {
				forceToAxis: true,
				sensitivity: 1,
				thresholdDelta: 10, 
			},
			on: {
				init(s) {
					if (dev) console.log('SwiperFixedHeight initialized');
				},
			},
        };
        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    });
</script>

<swiper-container bind:this={swiperEl} init="false">
	{#each products as product, i}
		<swiper-slide>
			<ProductCard {product} />
		</swiper-slide>
	{/each}
</swiper-container>

<style lang="scss">
	swiper-container {
		width: auto;
		display: flex;
		
		swiper-slide {
			width: auto;
			height: auto;
		}
	}
</style>