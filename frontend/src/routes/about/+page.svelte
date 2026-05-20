<script>
    // imports
    import Media from '$lib/components/Media.svelte';
    import { PortableText } from '@portabletext/svelte';
    import PortableTextStyleContent from '$lib/components/portableTextStyles/PortableTextStyleContent.svelte';

    // stores
    import { getMenu } from '$lib/stores/menu.svelte.js';

    // functions
    let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(true); menuer.setSmall(false);
    let { data } = $props();
</script>

<main>
	<section id="hero">
		{#if data.about.heroMedia}
            {#each data.about.heroMedia as media}
			    <Media media={media} cover={true}/>
            {/each}
		{/if}
	</section>
	{#if data.about.content}
		<section id="content" class="portableText content wo-18 wo-15-mb">
			<PortableText
			value={data.about.content}
			components={{
				block: {
					normal: PortableTextStyleContent,
					h2: PortableTextStyleContent,
				},
				listItem: PortableTextStyleContent,
				marks: {
					link: PortableTextStyleContent,
				},
				types: {
					image: PortableTextStyleContent,
				}
			}}/>
		</section>
	{/if}
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

main {
	#hero {
		height: 70vh;
		min-height: 500px;
		max-height: 650px;
		position: relative;
        display: flex;
		padding-top: var(--sp-200);
		column-gap: var(--sp-6);
	}
	#content {
		padding: var(--sp-80) var(--sp-24) var(--sp-200);
		display: grid;
    	grid-template-columns: repeat(2, 1fr);
		column-gap: var(--sp-6);
	}

	@media (width <= #{$lg}) {
		#hero {
			height: 60vh;
			min-height: 350px;
			max-height: 500px;
		}
		#content {
			padding: var(--sp-24) var(--sp-12) var(--sp-200);
			grid-template-columns: 1fr;
		}
	}
	@media (width <= #{$md}) {
		display: grid;
		grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
		padding-bottom: var(--sp-200);

		#hero {
			display: contents;
			:global(figure:nth-child(1)) {
				grid-row: 1;
				padding-top: var(--sp-150);
				height: 60vh;
				min-height: 350px;
				max-height: 500px;
			}
			:global(figure:nth-child(2)) {
				grid-row: -2 / -1;
				height: calc(60vh - var(--sp-150));
				min-height: calc(350px - var(--sp-150));
				max-height: calc(500px - var(--sp-150));
			}
		}

		#content {
			padding: var(--sp-24) var(--sp-12) var(--sp-48);
		}
	}
	@media (width <= #{$sm}) {
		#hero {
			:global(figure:nth-child(1)) {
				max-height: 400px;
			}
			:global(figure:nth-child(2)) {
				max-height: calc(400px - var(--sp-150));
			}
		}
	}
}
</style>
