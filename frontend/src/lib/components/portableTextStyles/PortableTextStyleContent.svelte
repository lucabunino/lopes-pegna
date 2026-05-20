<script>
    // imports
    import { fade } from 'svelte/transition';
    import Media from '../Media.svelte';
    import Image from '../Image.svelte';

    // stores

    // functions
    let { 
        portableText,
        children 
    } = $props();

    const value = $derived(portableText.value);
    const style = $derived(value?.style);
    const listItem = $derived(value?.listItem);
</script>

{#if value._type === 'image'}
    <figure class="portable-image">
        {#if value.asset}
            <Image image={value} cover={true}/>
        {/if}
        {#if value.caption}
            <figcaption class="in-14">{value.caption}</figcaption>
        {/if}
    </figure>
{:else if listItem === 'bullet'}
    <li>{@render children()}</li>
{:else if value._type === 'link'}
    <a href={value?.href} target={value?.blank ? '_blank' : undefined}>
        {@render children()}
    </a>
{:else if style === 'h2'}
    <h2>
        <span class="wo-24 index"></span>
        <span class="wo-36 content">{@render children()}</span>
    </h2>
{:else if style === 'normal'}
    <p>{@render children()}</p>
{:else}
    {@render children()}
{/if}

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

    :global(.portableText.content) {
        counter-reset: h2-index;
    }

    :global(.portableText.content p + p) {
        margin-top: 1.2em;
    }

    :global(.portableText.content ul) {
        margin: 1.1em 0 1.1em 2em;
        list-style: disc;
    }
	p {
		grid-column: 2 / span 1;
		max-width: 650px;
	}
	figure {
		grid-column: 2 / span 1;
		margin: var(--sp-60) 0;
		max-width: 650px;

		figcaption {
			margin-top: var(--sp-12);
		}
	}
    :global(.portableText.content > h2:first-child) {
		margin-top: 0;
    }
    a, a:any-link {
		text-decoration: underline;
    }
	h2 {
		display: grid;
		column-gap: var(--sp-6);
		align-items: baseline;
		grid-template-columns: repeat(2, 1fr);
		grid-column: 1 / span 2;
		counter-increment: h2-index;
		margin-top: var(--sp-140);
		margin-bottom: var(--sp-40);

		.index {
			display: inline-block;
			flex-shrink: 0;
			grid-column: 1 / span 1;

			&::before {
				content: counter(h2-index);
			}
		}

		.content {
			display: inline-block;
		}
	}

	@media (width <= #{$lg}) {
		p {
			grid-column: 1 / span 1;
			margin: 0 auto;
		}
		figure {
			grid-column: 1 / span 1;
			margin: var(--sp-36) auto;
		}
		h2 {
			grid-column: 1 / span 1;
			display: block;
			text-align: center;
			margin-bottom: var(--sp-36);

			.index {
				display: none;
			}
		}
	}
	@media (width <= #{$md}) {
		p {
			max-width: unset;
		}
		figure {
			margin: var(--sp-36) calc(var(--sp-12)*-1);
			max-width: unset;
			height: fit-content;

			:global(.image-wrapper) {
				:global(img) {
					height: calc(60vh - var(--sp-150));
					min-height: calc(350px - var(--sp-150));
					max-height: calc(500px - var(--sp-150));
				}
			}

			figcaption {
				padding: 0 var(--sp-12);
			}
		}
		h2 {
			margin-top: var(--sp-96);
		}
	}
	@media (width <= #{$sm}) {
		figure {
			:global(.image-wrapper) {
				:global(img) {
					max-height: calc(400px - var(--sp-150));
				}
			}
		}
	}
</style>