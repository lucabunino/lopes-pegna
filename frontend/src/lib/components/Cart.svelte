<script>
    // imports
    import { fade, fly } from 'svelte/transition';
    import { m } from '$lib/paraglide/messages.js';
    import { useScrollLock } from '$lib/utils/scrollLock.svelte.js';
    import CartContent from './CartContent.svelte';

    // stores
    import { cartStore } from '$lib/stores/cart.svelte.js';

    // functions
    let { cartInfo } = $props();
    useScrollLock(() => cartStore.isOpen);
</script>

{#if cartStore.isOpen}
    <div class="cart-overlay" transition:fade={{ duration: 200 }} onclick={() => cartStore.isOpen = false}></div>
    
    <aside class="cart-sidebar" transition:fly={{ x: '100%', duration: 200 }}>
        <div class="cart-header in-13 uppercase">
            <h2>{m.cart()}</h2>
            <button class="btn-shop in-13 uppercase" onclick={() => cartStore.isOpen = false}>
                {m.close()}
            </button>
        </div>
        <CartContent/>
    </aside>
{/if}

<style lang="scss">
    .cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.2);
        z-index: 11;
        backdrop-filter: blur(3px);
    }

    .cart-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 450px;
        background: var(--white);
        z-index: 12;
        display: flex;
        flex-direction: column;
        padding: var(--sp-32) var(--sp-24) var(--sp-24);
		backdrop-filter: blur(3px);

        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--sp-40);
        }
    }
</style>