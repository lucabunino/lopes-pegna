<script>
	import "../scss/reset.scss";
	import "../scss/typography.scss";
	import "../scss/main.scss";

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
    import Head from '$lib/components/Head.svelte';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
	import Cart from '$lib/components/Cart.svelte';
	import { cartStore } from '$lib/stores/cart.svelte.js';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	$inspect(data)

	onMount(() => {
		cartStore.init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>


<Head />
<Header />
<Cart />
{@render children()}
<Footer policies={data.policies} contacts={data.contacts} info={data.info}/>