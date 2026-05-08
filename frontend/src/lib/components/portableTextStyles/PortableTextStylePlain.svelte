<script>
	import { fade } from 'svelte/transition';
	
    let { 
        portableText,
        children 
    } = $props();

    const value = $derived(portableText.value);
    const style = $derived(value?.style);
    const listItem = $derived(value?.listItem);
</script>

{#if listItem === 'bullet'}
    <li>{@render children()}</li>
{:else if value._type === 'link'}
    <a href={value?.href} target={value?.blank ? '_blank' : undefined}>
        {@render children()}
    </a>
{:else if style === 'normal'}
    <p>{@render children()}</p>
{:else}
    {@render children()}
{/if}

<style lang="scss">
    :global(.portableText p + p) {
        margin-top: .428em;
    }
	:global(.portableText ul) {
        margin: 1.1em 0 1.1em 2em;
		list-style: disc;
    }
	a, a:any-link {
		text-decoration: underline;
	}
</style>