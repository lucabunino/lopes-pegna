
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
			loop: false,
			slidesPerView: 1.4,
            spaceBetween: 3,
			direction: "horizontal",
			slidesOffsetBefore: 12,
			slidesOffsetAfter: 12,
            mousewheel: {
				forceToAxis: true,
				sensitivity: 1,
				thresholdDelta: 10, 
			},
			breakpoints: {
				500: { slidesPerView: 1.7 },
				768: { slidesPerView: 2.7 },
			},
			on: {
				init(s) {
					if (dev) console.log('SwiperProductsMobile initialized');
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
		width: 100vw;
		display: flex;
		
		swiper-slide {
			width: auto;
			height: auto;
		}
	}
</style>