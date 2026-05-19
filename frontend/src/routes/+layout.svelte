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

    // functions
    let { data, children } = $props();
    onMount(() => {
        cartStore.init();
    });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>


<Head />
<Header />
<Cart cartInfo={data.cartInfo}/>
{@render children()}
<Footer policies={data.policies} contacts={data.contacts} info={data.info}/>