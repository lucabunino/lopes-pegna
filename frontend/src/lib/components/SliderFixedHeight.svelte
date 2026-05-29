
<script>
    // imports
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { register } from 'swiper/element/bundle';
    import Media from './Media.svelte';
    import { urlFor } from '$lib/utils/image.js';

    // stores

    // functions
    register();
    let swiperEl = $state();
    let { slides } = $props();
    onMount(() => {
        const swiperParams = {
            slidesPerView: "auto",
            spaceBetween: 3,
            slidesPerGroupSkip: 1,
			direction: "horizontal",
            slidesOffsetBefore: 24,
            slidesOffsetAfter: 24,
            mousewheel: {
				forceToAxis: true,
				sensitivity: 1,
				thresholdDelta: 20, 
			},
            on: {
                init() {
					if (dev) console.log('SwiperFixedHeight initialized');
                },
            },
        };

        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    });
</script>

<swiper-container bind:this={swiperEl} init="false">
	{#each slides as slide, i}
		<swiper-slide>
			<Media media={slide} cover={false} className={'swiperFixedHeight'}/>
		</swiper-slide>
	{/each}
</swiper-container>



<style lang="scss">
	swiper-container {
		width: 100%;
		
		swiper-slide {
			width: auto;
			height: auto;
		}
	}
</style>