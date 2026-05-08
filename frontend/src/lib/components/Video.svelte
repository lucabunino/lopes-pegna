<script>
    import { urlFor } from "$lib/utils/image";
    import { innerWidth } from "svelte/reactivity/window";
	let {
		video = undefined,
		videoMobile = undefined,
		poster = undefined,
		posterMobile = undefined,
		cover = false,
		className = undefined,
	} = $props()
</script>

<div class="video-wrapper {className} {cover ? 'cover' : undefined}">
    {#if videoMobile?.asset?.url}
        <video class="mobile" autoplay loop playsinline muted poster={urlFor(posterMobile)} width={posterMobile?.asset.metadata.dimensions.width} height={posterMobile?.asset.metadata.dimensions.height}>
            <source src={videoMobile.asset.url} type="video/mp4" />
        </video>
    {/if}
    {#if video?.asset?.url}
        <video class="{videoMobile ? 'desktop' : 'single'}" autoplay loop playsinline muted poster={urlFor(poster)} width={poster?.asset.metadata.dimensions.width} height={poster?.asset.metadata.dimensions.height}>
            <source src={video.asset.url} type="video/mp4" />
        </video>
    {/if}
</div>


<style lang="scss">
.video-wrapper {
	width: auto;
	height: auto;

	video {
		width: auto;
		height: auto;
	}

	&.cover {
		width: 100%;
		height: 100%;
		object-fit: cover;

		video {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.mobile { display: none; }
    .desktop { display: block; }
	
    @media (max-width: 1080px) {
		.mobile { display: block; }
        .desktop { display: none; }
    }
}
</style>