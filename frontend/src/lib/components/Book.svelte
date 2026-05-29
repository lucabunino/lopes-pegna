<script>
	import Image from '$lib/components/Image.svelte'
    import { m } from '$lib/paraglide/messages';

	let { book } = $props()
</script>

{#if book.href}
	<a class="book" href={book.href} target="_blank" rel="noopener noreferrer">
		{@render content()}
	</a>
{:else}
	<div class="book">
		{@render content()}
	</div>
{/if}

{#snippet content()}
	{#if book.cover}
		<div class="cover-wrapper" style="--bgColor: {book.coverBackground ? book.coverBackground.hex : undefined}">
			<Image image={book.cover} className={'bookCover'} />
		</div>
	{/if}
	{#if book.title}
		<h4 class="wo-24 wo-15-mb title">{book.title}</h4>
	{/if}
	{#if book.info}
		<p class="info in-15 in-13-mb">{book.info}</p>
	{/if}
	{#if book.href}
		<span class="cta btn-m in-12 uppercase">{m.discover_more()}</span>
	{/if}
{/snippet}

<style lang="scss">
@use '$lib/scss/breakpoints.module.scss' as *;

	.book {
		display: flex;
		flex-direction: column;

		.cover-wrapper {
			aspect-ratio: 3/4;
			background-color: var(--bgColor, var(--black));
			display: flex;
			justify-content: center;
			align-items: center;
			border: solid clamp(30px, 3vw, 3vw) transparent;
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

		@media (width <= #{$xs}) {
			.cover-wrapper {
				border: solid 5vw transparent;
			}
		}

		@media (pointer: fine) {
			&:hover {
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
