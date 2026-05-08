<script>
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
{:else if style === 'h3'}
    <h3>{@render children()}</h3>
{:else if style === 'h4'}
    <h4>{@render children()}</h4>
{:else if style === 'normal'}
    <p>{@render children()}</p>
{:else}
    {@render children()}
{/if}

<style>
	:global(.portableText.policy p + p) {
        margin-top: 1.1em;
    }
	:global(.portableText.policy ul) {
        margin: 1.1em 0 1.1em 2em;
		list-style: disc;
    }
	a {
		display: inline;
		text-decoration: underline;
	}
	
	h3 {
		margin-top: 3em;
		margin-bottom: .5em;
		text-transform: uppercase;
	}
	h4 {
		margin-top: 1.2em;
		margin-bottom: .5em;
		font-style: italic;
	}
</style>