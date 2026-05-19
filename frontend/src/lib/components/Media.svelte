<script>
    // imports
    import Image from "./Image.svelte";
    import Video from "./Video.svelte";

    // stores

    // functions
	let {
		media = undefined,
		cover = false,
		className = undefined,
		loading = "lazy",
	} = $props();
</script>

<figure class="media {cover ? 'cover' : ''} {className}">
	{#if media.video}
		<Video video={media.video} videoMobile={media.videoMobile} poster={media.poster} posterMobile={media.posterMobile} cover={cover} className={className} loading={loading}/>
	{:else if media.image}
		<Image image={media.image} imageMobile={media.imageMobile} cover={cover} className={className} loading={loading}/>
	{/if}
</figure>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

.media {
	width: fit-content;
	height: fit-content;

	&.cover {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	&.heroMedia {
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -1;
		background-color: var(--black);
	}
	:global(.sliderMarquee) {
		:global(img),
		:global(video) {
			height: 75vh;

			@media (width <= #{$lg}) {
				height: 60vh;
				min-height: 350px;
				max-height: 450px;
			}
		}
	}
	:global(.sliderHalf) {
		:global(img),
		:global(video) {
			height: 30vh;
		}
	}
	&.setsMedia {
		width: 50%;
		:global(.setsMedia) {		
			:global(img),
			:global(video) {
				width: 100%;
				height: 100vh;
				min-height: 600px;
				max-height: 900px;
			}
		}

		@media (width <= #{$lg}) {
			width: 100%;

			:global(.setsMedia) {		
				:global(img),
				:global(video) {
					width: 100%;
					height: 60vh;
					min-height: 350px;
					max-height: 450px;
				}
			}
		}
	}
	&.beadsImages {
		:global(.beadsImages) {		
			:global(img),
			:global(video) {
				width: 100%;
				height: 100vh;
				min-height: 600px;
				max-height: 900px;
			}
		}

		@media (width <= #{$lg}) {
			&:nth-child(1) {
				grid-row: 1;
			}
			&:nth-child(2) {
				grid-row: 4;
			}
			:global(.beadsImages) {		
				:global(img),
				:global(video) {
					height: auto;
					min-height: 350px;
					max-height: 450px;
				}
			}
		}
	}
}
</style>