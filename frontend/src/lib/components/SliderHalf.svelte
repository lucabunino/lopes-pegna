
<script>
    import { urlFor } from '$lib/utils/image.js';
    import { onMount } from 'svelte';
	import { register } from 'swiper/element/bundle'; register()
    import Media from './Media.svelte';
    import { dev } from '$app/environment';
    import { innerWidth } from 'svelte/reactivity/window';
	let swiperEl = $state()

    let {
		slides,
		className = undefined,
	} = $props();
	let offset = $derived(className == 'contacts' ? (innerWidth.current - 48) / 12 * 6 + 24 + 3 : (innerWidth.current - 48) / 12 * 5 + 24 + 3);

	const stepsTarget = 4;
    const slidesPerGroup = Math.ceil(slides.length / stepsTarget);

	onMount(() => {
        const swiperParams = {
			rewind: true,
			
			slidesPerView: 'auto',
			slidesPerGroup: 1,
            spaceBetween: 3,
			direction: "horizontal",

			slideToClickedSlide: true,
        	grabCursor: true,
			initialSlide: 0,
        	resistanceRatio: 0,

			centeredSlides: false,
			normalizeSlideIndex: true,
        	centerInsufficientSlides: false,

            mousewheel: {
				forceToAxis: true,
				sensitivity: 1,
				thresholdDelta: 10, 
			},

			speed: 600,
			
			pagination: {
				el: ".swiper-pagination",
				type: "fraction",

				formatFractionCurrent: (n) => n,
				formatFractionTotal: () => slides.length
			},

			on: {
				init(s) {
					s.update();
					if (dev) {
						console.log('SwiperHalf initialized');
					}
				},
				slideChange(s) {
					const current = s.activeIndex + 1;
					const total = slides.length;
					const el = document.querySelector('.swiper-pagination');
					if (el) el.innerHTML = `${current} / ${total}`;
				},
				reachEnd(s) {
					if (s.isEnd && !s.animating) {
						setTimeout(() => {
							s.slideTo(0);
						}, 0);
					}
				}
			},
        };

        Object.assign(swiperEl, swiperParams);
        swiperEl.initialize();
    });

	$effect(() => {
		if (swiperEl?.swiper) {
			swiperEl.swiper.params.slidesOffsetBefore = offset;
			swiperEl.swiper.params.slidesOffsetAfter = innerWidth.current;
			swiperEl.swiper.update();
			swiperEl.swiper.slideTo(swiperEl.swiper.activeIndex, 300);
		}
	});
</script>

<swiper-container class="{className}" bind:this={swiperEl} init="false">
	{#each slides as slide, i}
		<swiper-slide>
			<Media media={slide} cover={false} className={'sliderHalf'}/>
		</swiper-slide>
	{/each}
</swiper-container>
<div class="swiper-pagination in-14 uppercase" style:margin-left="{offset}px"></div>



<style lang="scss">
	swiper-container {
		width: 100vw;
		display: flex;

		&.contacts {
			
		}
		
		swiper-slide {
			width: auto;
			height: auto;
			cursor: pointer;
		}
	}
	.swiper-pagination {
        color: currentColor;
        pointer-events: none;
		margin-top: var(--sp-12);
    }
</style>