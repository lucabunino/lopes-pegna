<script>
    // imports
    import { onMount } from 'svelte';
    import favicon from '$lib/assets/favicon.svg';
    import Cart from '$lib/components/Cart.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import Head from '$lib/components/Head.svelte';
    import Header from '$lib/components/Header.svelte';
    import "$lib/scss/main.scss";
    import "$lib/scss/reset.scss";
    import "$lib/scss/typography.scss";

    // stores
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { blur, fade } from 'svelte/transition';
    import { page } from '$app/state';
    import { innerWidth } from 'svelte/reactivity/window';
	import bp from '$lib/scss/breakpoints.module.scss';

    // functions
    let { data, children } = $props();
	let loaded = $state(false)
    onMount(() => {
        cartStore.init();
		loaded = true;
    });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>


<Head />

{#if loaded}
	<div class="site-wrapper">
		<Header />
		<Cart cartInfo={data.cartInfo}/>
		{#key page.url}
			<div class="page-wrapper">
				{@render children()}
			</div>
		{/key}
		<Footer policies={data.policies} contacts={data.contacts} info={data.info}/>
	</div>
{/if}