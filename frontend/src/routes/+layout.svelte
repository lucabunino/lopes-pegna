<script>
    // imports
    import { onMount } from 'svelte';
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

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
	<link rel="shortcut icon" href="/favicon/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Lopes Pegna" />
	<link rel="manifest" href="/favicon/site.webmanifest" />
</svelte:head>


<Head />

{#if loaded}
	<div class="site-wrapper">
		<Header />
		<Cart cartInfo={data.cartInfo}/>
		{#key page.route.id}
			<div class="page-wrapper">
				{@render children()}
			</div>
		{/key}
		<Footer policies={data.policies} contacts={data.contacts} info={data.info}/>
	</div>
{/if}