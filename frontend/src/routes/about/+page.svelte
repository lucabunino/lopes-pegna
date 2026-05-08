<script>
	import Media from '$lib/components/Media.svelte';
	import { PortableText } from '@portabletext/svelte';
	import PortableTextStyleContent from '$lib/components/portableTextStyles/PortableTextStyleContent.svelte';

	let { data } = $props()

	// Header setup
	import { getMenu } from '$lib/stores/menu.svelte.js';
    let menuer = getMenu(); 
    menuer.setDark(false); 
    menuer.setDifference(true); 
    menuer.setSmall(false);
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
		<section id="content" class="portableText content wo-18">
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
	#hero {
		height: 70vh;
		min-height: 500px;
		max-height: 650px;
		position: relative;
        display: flex;
		padding-top: 200px;
		column-gap: var(--sp-6);
	}
	#content {
		padding: var(--sp-80) var(--sp-24);
		display: grid;
    	grid-template-columns: repeat(2, 1fr);
		column-gap: var(--sp-6);
	}
</style>
