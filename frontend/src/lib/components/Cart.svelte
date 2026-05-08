<script>
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { m } from '$lib/paraglide/messages.js';
    import { fade, fly } from 'svelte/transition';
    import { getLocale } from '$lib/paraglide/runtime';

    const formatPrice = (amount, currencyCode) => {
        return new Intl.NumberFormat(getLocale(), {
            style: 'currency',
            currency: currencyCode
        }).format(amount);
    };
</script>

{#if cartStore.isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="cart-overlay" transition:fade onclick={() => cartStore.isOpen = false}></div>
    
    <aside class="cart-sidebar" transition:fly={{ x: '100%', duration: 300 }}>
        <div class="cart-header">
            <h2 class="wo-24 uppercase">{m.cart()}</h2>
            <button class="close-btn in-14 uppercase" onclick={() => cartStore.isOpen = false}>
                {m.close()}
            </button>
        </div>

        <div class="cart-content">
            {#if cartStore.current && cartStore.current.lines.nodes.length > 0}
                <ul class="cart-items">
                    {#each cartStore.current.lines.nodes as line (line.id)}
                        <li class="cart-item">
                            {#if line.merchandise.image}
                                <img src={line.merchandise.image.url} alt={line.merchandise.image.altText} class="item-img" />
                            {/if}
                            <div class="item-info">
                                <h4 class="wo-18">{line.merchandise.product.title}</h4>
                                <p class="in-14 variant">{line.merchandise.title !== 'Default Title' ? line.merchandise.title : ''}</p>
                                <div class="item-actions">
                                    <button class="remove-btn in-12 uppercase" onclick={() => cartStore.removeItem(line.id)}>Remove</button>
                                </div>
                            </div>
                            <p class="in-14 price">
                                {formatPrice(line.merchandise.price.amount, line.merchandise.price.currencyCode)}
                            </p>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p class="empty-msg in-14 uppercase">Your cart is empty</p>
            {/if}
        </div>

        {#if cartStore.current && cartStore.current.lines.nodes.length > 0}
            <div class="cart-footer">
                <div class="subtotal">
                    <span class="in-14 uppercase">Subtotal</span>
                    <span class="wo-18">
                        {formatPrice(cartStore.current.cost.subtotalAmount.amount, cartStore.current.cost.subtotalAmount.currencyCode)}
                    </span>
                </div>
                <a href={cartStore.current.checkoutUrl} class="checkout-btn btn-m in-14 uppercase">
                    Checkout
                </a>
            </div>
        {/if}
    </aside>
{/if}

<style lang="scss">
    .cart-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .cart-sidebar {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 450px;
        background: var(--white);
        z-index: 1001;
        display: flex;
        flex-direction: column;
        padding: var(--sp-24);
        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.05);

        .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--sp-40);
            
            .close-btn {
                opacity: 0.6;
                &:hover { opacity: 1; }
            }
        }

        .cart-content {
            flex: 1;
            overflow-y: auto;
            
            .empty-msg {
                text-align: center;
                margin-top: var(--sp-60);
                opacity: 0.5;
            }

            .cart-items {
                list-style: none;
                padding: 0;
                
                .cart-item {
                    display: grid;
                    grid-template-columns: 80px 1fr auto;
                    gap: var(--sp-16);
                    margin-bottom: var(--sp-24);
                    align-items: start;

                    .item-img {
                        width: 80px;
                        aspect-ratio: 3/4;
                        object-fit: cover;
                    }

                    .item-info {
                        display: flex;
                        flex-direction: column;
                        gap: var(--sp-4);

                        .variant { opacity: 0.6; }

                        .item-actions {
                            display: flex;
                            align-items: center;
                            gap: var(--sp-16);
                            margin-top: var(--sp-8);

                            .remove-btn { opacity: 0.4; &:hover { opacity: 1; } }
                        }
                    }

                    .price {
                        white-space: nowrap;
                    }
                }
            }
        }

        .cart-footer {
            margin-top: auto;
            padding-top: var(--sp-24);
            border-top: 1px solid rgba(0,0,0,0.05);

            .subtotal {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--sp-24);
            }

            .checkout-btn {
                display: block;
                width: 100%;
                text-align: center;
                background: var(--black);
                color: var(--white);
                padding: var(--sp-16);
                transition: var(--transition);

                &:hover {
                    opacity: 0.9;
                }
            }
        }
    }
</style>
