<script>
    // imports
    import Media from '$lib/components/Media.svelte';
    import Image from '$lib/components/Image.svelte';
    import { PortableText } from '@portabletext/svelte';
    import PortableTextStyleContent from '$lib/components/portableTextStyles/PortableTextStyleContent.svelte';
    import { m } from '$lib/paraglide/messages.js';

    // stores
    import { getMenu } from '$lib/stores/menu.svelte.js';

    // functions
    let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(false); menuer.setSmall(false);
    let { data } = $props();
</script>

<main>
	<section id="hero">
		{#if data.beads.heroMedia}
			<Media media={data.beads.heroMedia} cover={true}/>
		{/if}
	</section>
	{#if data.beads.content}
		<section id="content" class="portableText content wo-18">
			<PortableText
			value={data.beads.content}
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

	{#if data.books}
		<section id="books">
			<h3 class="wo-36 section-title">{m.sarah_s_favourites()}</h3>
			{#if data.booksIntro}
				<p class="intro in-15">{data.booksIntro.introText}</p>
			{/if}
			<div class="books">
				{#each data.books as book, i}
					{#if book.href}
						<a class="book" href={book.href} target="_blank" rel="noopener noreferrer">
							{@render bookContent(book)}
						</a>
					{:else}
						<div class="book">
							{@render bookContent(book)}
						</div>
					{/if}
					{#snippet bookContent(book)}
						{#if book.cover}
							<div class="cover-wrapper" style="--bgColor: {book.coverBackground ? book.coverBackground.hex : undefined}">
								<Image image={book.cover} className={'bookCover'}/>
							</div>
						{/if}
						{#if book.title}
							<h4 class="wo-24 title">{book.title}</h4>
						{/if}
						{#if book.info}
							<p class="info in-15">{book.info}</p>
						{/if}
						{#if book.href}
							<button class="cta btn-m in-12 uppercase" href={book.href} target="_blank" rel="noopener noreferrer">Scopri di più</button>
						{/if}
					{/snippet}
				{/each}
			</div>
		</section>	
	{/if}
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;
	#hero {
		height: 70vh;
		min-height: 500px;
		max-height: 650px;
		position: relative;
		
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 50%;
			z-index: 1;
			pointer-events: none;
			background: linear-gradient(
				to bottom, 
				rgba(0, 0, 0, .5) 50%, 
				rgba(0, 0, 0, 0) 100%
			);
		}
	}
	#content {
		padding: var(--sp-80) var(--sp-24);
		display: grid;
    	grid-template-columns: repeat(2, 1fr);
		column-gap: var(--sp-6);
	}
	#books {
		padding: var(--sp-160) var(--sp-24) var(--sp-200);

		.intro {
			max-width: 600px;
			margin: var(--sp-24) 0 var(--sp-36);
		}

		.books {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			column-gap: var(--sp-6);

			.book {
				display: flex;
				flex-direction: column;

				.cover-wrapper {
					aspect-ratio: 3/4;
					background-color: var(--black);
					background-color: var(--bgColor);
					display: flex;
					justify-content: center;
					align-items: center;
					border: solid 3vw transparent;
					transition: var(--transition);
				}

				.title {
					margin-top: var(--sp-21);
					padding-right: var(--sp-12);
				}
				.info {
					margin-top: var(--sp-10);
					padding-right: var(--sp-12);
				}
				.cta {
					margin-top: var(--sp-25);
				}
			}

			a.book:hover {
				.cover-wrapper {
					border-radius: var(--sp-24);
				}
				.cta {
					background-color: var(--black);
					color: var(--white);
				}
			}
		}
	}
</style>