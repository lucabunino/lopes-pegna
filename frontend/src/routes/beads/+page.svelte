<script>
	// imports
	import Media from '$lib/components/Media.svelte'
	import Book from '$lib/components/Book.svelte'
	import { PortableText } from '@portabletext/svelte'
	import PortableTextStyleContent from '$lib/components/portableTextStyles/PortableTextStyleContent.svelte'
	import { m } from '$lib/paraglide/messages.js'

	// stores
	import { getMenu } from '$lib/stores/menu.svelte.js'
	import { localizeHref } from '$lib/paraglide/runtime.js'

	// functions
	let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(false); menuer.setSmall(false)
	let { data } = $props()
</script>

<nav aria-label="Breadcrumb" class="breadcrumb-mobile in-14 {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}">
	<ol>
		<li><a href={localizeHref(`/beads`)}>{m.beads()}</a></li>
	</ol>
</nav>

<main>
	<h1 class="sr-only">{m.beads()}</h1>
	<section id="hero">
		{#if data.beads.heroMedia}
			<Media media={data.beads.heroMedia} cover={true} />
		{/if}
	</section>

	{#if data.beads.content}
		<section id="content" class="portableText content wo-18 wo-15-mb">
			<PortableText
				value={data.beads.content}
				components={{
					block: { normal: PortableTextStyleContent, h2: PortableTextStyleContent },
					listItem: PortableTextStyleContent,
					marks: { link: PortableTextStyleContent },
					types: { image: PortableTextStyleContent }
				}}
			/>
		</section>
	{/if}

	{#if data.books}
		<section id="books">
			<h2 class="wo-36 section-title">{m.sarah_s_favourites()}</h2>
			{#if data.booksIntro}
				<p class="intro in-15">{data.booksIntro.introText}</p>
			{/if}
			<div class="books">
				{#each data.books as book (book._id)}
					<Book {book} />
				{/each}
			</div>
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

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 50%;
			z-index: 1;
			pointer-events: none;
			background: linear-gradient(to bottom, rgba(0, 0, 0, .5) 50%, rgba(0, 0, 0, 0) 100%);
		}
	}

	#content {
		padding: var(--sp-80) var(--sp-24);
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: var(--sp-6);
	}

	#books {
		padding: var(--sp-152) var(--sp-24) var(--sp-200);

		.intro {
			max-width: 600px;
			margin: var(--sp-24) 0 var(--sp-36);
		}

		.books {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			column-gap: var(--sp-6);
			row-gap: var(--sp-60);
		}
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
		#books {
			padding: var(--sp-160) var(--sp-12) var(--sp-200);
			.books { grid-template-columns: repeat(3, 1fr); }
		}
	}

	@media (width <= #{$md}) {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto auto;

		#content { padding: var(--sp-24) var(--sp-12) var(--sp-48); }
		#books {
			.books { grid-template-columns: repeat(2, 1fr); }
		}
	}

	@media (width <= #{$sm}) {
		#hero { max-height: 400px; }
	}

	@media (width <= #{$xxs}) {
		#books {
			.books { grid-template-columns: repeat(1, 1fr); }
		}
	}
}
</style>
