
<script>
    // imports
    import { onMount } from 'svelte';
    import { dev } from '$app/environment';
    import { register } from 'swiper/element/bundle';
    import { innerWidth } from 'svelte/reactivity/window';
    import { urlFor } from '$lib/utils/image.js';
    import ImageShopify from './ImageShopify.svelte';

    // stores

    // functions
    register();
    let swiperEl = $state();
    let { slides, className = undefined } = $props();

    onMount(() => {
        const swiperParams = {
            loop: (slides.length > 3),
            slidesPerView: 1.5,
            slidesPerGroup: 1,
            spaceBetween: 3,
            direction: "horizontal",
            slideToClickedSlide: true,
            grabCursor: true,
            centeredSlides: true,
            mousewheel: {
                forceToAxis: true,
                sensitivity: 1,
                thresholdDelta: 10, 
            },
            speed: 600,
            on: {
                init(s) {
                    if (dev) console.log('SwiperHalf initialized');
                },
            },
        };
        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    });
</script>

<swiper-container class="{className}" bind:this={swiperEl} init="false">
	{#each slides as slide, i}
		<swiper-slide>
			<ImageShopify image={slide}/>
		</swiper-slide>
	{/each}
</swiper-container>



<style lang="scss">
	swiper-container {
		width: 100%;
		display: flex;
		&.contacts {
			
		}
		swiper-slide {
			width: 100%;
			height: auto;
		}
	}
	.swiper-pagination {
        color: currentColor;
        pointer-events: none;
		margin-top: var(--sp-12);
    }
</style>