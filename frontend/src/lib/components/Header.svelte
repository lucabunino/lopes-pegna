<script>
    // imports
    import { page } from "$app/state";
    import { fly } from "svelte/transition";
    import { innerHeight, innerWidth } from "svelte/reactivity/window";
    import LogoSvg from "$lib/components/LogoSvg.svelte";
    import { m } from "$lib/paraglide/messages";
    import { getLocale, locales, localizeHref, setLocale } from '$lib/paraglide/runtime';
    import { useScrollLock } from '$lib/utils/scrollLock.svelte.js';
	import bp from '$lib/scss/breakpoints.module.scss';

    // stores
    import { getMenu } from '$lib/stores/menu.svelte.js';
    import { cartStore } from '$lib/stores/cart.svelte.js';

    // functions
    let menuer = getMenu(); menuer.setDark(false); menuer.setSmall(false);
    let scrollY = $state(0);
    let hoverLogo = $state(false);
    useScrollLock(() => menuer.open);

    $effect(() => {
        if (page.route.id !== '/shop/[handle]') {
            if (scrollY > 100) menuer.setSmall(true);
            else menuer.setSmall(false);
        }
		
        if (page.route.id === '/') {
			console.log("homepage");
            if (scrollY >= innerHeight.current - 32 - 13*1.2) menuer.setDifference(true)
            else menuer.setDifference(false)
        }
		
        if ((page.route.id === '/shop' && page.url.searchParams.get('view') !== 'list') || page.route.id === '/beads' || page.route.id === '/contacts') {			
			if (innerWidth.current > parseInt(bp.lg)) {
				console.log("lar");
				if (scrollY >= Math.min(Math.max(innerHeight.current/100*70, 500), 650) - 32 - 13*1.2) {
					menuer.setDifference(true)
					return
				} else {
					menuer.setDifference(false)
				}
			}
			if (innerWidth.current > parseInt(bp.sm) && innerWidth.current <= parseInt(bp.lg)) {
				console.log("mid");
				if (scrollY >= Math.min(Math.max(innerHeight.current/100*60, 350), 500) - 32 - 13*1.2) {
					menuer.setDifference(true)
					return
				} else {
					menuer.setDifference(false)
				}
			}
            if (innerWidth.current <= parseInt(bp.sm)) {
				console.log("sm");
				if (scrollY >= Math.min(Math.max(innerHeight.current/100*60, 350), 400) - 40 - 13*1.2) {
					menuer.setDifference(true)
					return
				} else {
					menuer.setDifference(false)
				}
			}
        }
        if (page.route.id === '/about') {
			if (innerWidth.current > parseInt(bp.sm) && innerWidth.current <= parseInt(bp.lg)) {
				if (scrollY >= Math.min(Math.max(innerHeight.current/100*60, 350), 500) - 32 - 13*1.2) {
					menuer.setDifference(true)
					return
				} else {
					menuer.setDifference(false)
				}
			}
			if (innerWidth.current <= parseInt(bp.sm)) {
				if (scrollY >= Math.min(Math.max(innerHeight.current/100*60, 350), 400) - 40 - 13*1.2) {
					menuer.setDifference(true)
					return
				} else {
					menuer.setDifference(false)
				}
			}
			if (innerWidth.current > parseInt(bp.md)) {
				menuer.setDifference(true)
			}
        }
    })
</script>

<svelte:window bind:scrollY></svelte:window>
<header>
    <nav class="in-13 uppercase in-24-mb normalcase-mb {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}" aria-label="Main navigation">
        <button class="menu-switch btn-m in-13 uppercase" onclick={() => menuer.setOpen(!menuer.open)}>Menu
			<div class="hamburger {menuer.open ? 'open' : ''}">
				<div class="line"></div>
				<div class="line"></div>
				<div class="line"></div>
			</div>
		</button>
		<a href={localizeHref("/")} class="logo-mobile menu-item" aria-label="Logo"
		onclick={() => {menuer.setOpen(false);}}
		onpointerenter={(e) => {if (e.pointerType === "mouse") hoverLogo = true}}
		onpointerleave={(e) => {if (e.pointerType === "mouse") hoverLogo = false}}
		>
			<LogoSvg {hoverLogo}/>
		</a>
		<ul id="main-menu" class="menu {menuer.open ? 'open' : 'closed'}">
			<div class="menu-left">
				<li class="shop"><a class="menu-item btn-s" aria-current={page.route.id === '/shop' ? 'page' : undefined} href={localizeHref("/shop")} onclick={() => {menuer.setOpen(false)}}>{m.shop()}</a></li>
				<li class="about"><a class="menu-item btn-s" aria-current={page.route.id === '/about' ? 'page' : undefined} href={localizeHref("/about")} onclick={() => {menuer.setOpen(false)}}>{m.about()}</a></li>
				<li class="beads"><a class="menu-item btn-s" aria-current={page.route.id === '/beads' ? 'page' : undefined} href={localizeHref("/beads")} onclick={() => {menuer.setOpen(false)}}>{m.beads()}</a></li>
			</div>
        	<a href={localizeHref("/")} class="logo menu-item" aria-label="Logo"
			onclick={() => {menuer.setOpen(false);}}
			onpointerenter={(e) => {if (e.pointerType === "mouse") hoverLogo = true}}
			onpointerleave={(e) => {if (e.pointerType === "mouse") hoverLogo = false}}
			>
				<LogoSvg {hoverLogo}/>
			</a>
			<div class="menu-right">
				<li class="contacts"><a class="menu-item btn-s" aria-current={page.url.pathname.startsWith('/contacts') ? 'page' : undefined} href={localizeHref("/contacts")} onclick={() => {menuer.setOpen(false)}}>{m.contacts()}</a></li>
				<li class="cart">
					<button 
						class="menu-item btn-s in-13 uppercase in-24-mb normalcase-mb" 
						onclick={(e) => {
							e.preventDefault();
							cartStore.isOpen = true;
						}}
					>
						{m.cart()} {cartStore.current?.totalQuantity ? `[ ${cartStore.current.totalQuantity} ]` : ''}
					</button>
				</li>
			</div>
			<li class="lang-switch in-13 uppercase">
				{#each locales as locale (locale)}
						<button class="menu-item btn-s" aria-current={getLocale() == locale} onclick={() => {
							const newPath = localizeHref(page.url.pathname, { locale });
							window.location.href = newPath;
						}}>{locale}</button>
				{/each}
			</li>
		</ul>
    </nav>
	{#if cartStore.current?.totalQuantity > 0}
		<button 
			class="cart-mobile in-14 {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}"
			onclick={() => cartStore.toggle()}
		>
			{m.cart()} {cartStore.current?.totalQuantity ? `[ ${cartStore.current.totalQuantity} ]` : ''}
		</button>
	{/if}
</header>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

header nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
    padding: var(--sp-32) var(--sp-24);
	transition: var(--transition);
	transition-property: padding;
	pointer-events: none;

	@media (width <= #{$lg}) {
		display: contents;
	}
	
	&.dark {
		color: var(--black);
		.logo-mobile {
			color: var(--black);
		}
	}
	&.light {
		color: var(--white);
		.logo-mobile {
			color: var(--white);
		}
	}
	&.difference:not(.open) {
		color: var(--difference);
		mix-blend-mode: difference;
		.logo-mobile {
			color: var(--difference);
			mix-blend-mode: difference;
		}
	}

    .menu-switch {
        display: none;
        position: fixed;
        bottom: var(--sp-30);
        left: 0;
        width: stretch;
		margin: 0 var(--sp-12);
        pointer-events: all;
        z-index: 12;
		color: var(--black);
		background-color: var(--white);
		column-gap: var(--sp-8);
		justify-content: center;
		align-items: center;
		border-color: var(--white);
		box-shadow: 0px 5px 10px 1px rgba($color: #000000, $alpha: .1);
		
		&:hover {
			background: var(--lightGray);
			border-color: var(--lightGray);
		}

		.hamburger {
			display: block;
			position: relative;
			width: .8em;
			height: 1em;
			cursor: pointer;

			.line {
				position: absolute;
				width: 100%;
				height: 2px;
				background-color: currentColor;
				transition: var(--transition);
				top: 50%;
				left: 50%;
				transform-origin: center center;
				transform: translate(-50%, -50%);
			}
			.line:nth-child(1) {
				transform: translate(-50%, calc(-50% - .3em));
			}
			.line:nth-child(2) {
				transform: translate(-50%, -50%) scaleX(1);
			}
			.line:nth-child(3) {
				transform: translate(-50%, calc(-50% + .3em));
			}

			&.open {
				.line:nth-child(1) {
					transform: translate(-50%, -50%) rotate(45deg);
				}
				.line:nth-child(2) {
					transform: translate(-50%, -50%) scaleX(0);
				}
				.line:nth-child(3) {
					transform: translate(-50%, -50%) rotate(-45deg);
				}
			}
		}
        @media (width <= #{$lg}) {
            display: flex;
        }
    }

	&.small {
		@media (width <= #{$lg}) {
			padding: var(--sp-16) var(--sp-24);
		}
		
		.menu {
			.menu-left,
			.menu-right {
				@media (width <= #{$lg}) {
					padding: var(--sp-16) 0;
				}
			}
		}
	}

	.logo-mobile {
		display: none;
		@media (width <= #{$lg}) {
			display: block;
			pointer-events: all;
			color: var(--white);
			position: fixed;
			left: 50%;
			top: var(--sp-24);
			transform: translateX(-50%);
			z-index: 10;

			&.difference { 
				color: var(--difference);
				mix-blend-mode: difference;
			}
		}
	}
    
    .menu {
        display: grid;
        grid-template-columns: 1fr auto 1fr; 
        align-items: flex-start;
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;

		@media (width <= #{$lg}) {
			display: flex;
			row-gap: var(--sp-3);
			flex-direction: column;
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: stretch;
			justify-content: center;
			align-items: center;
			background-color: transparent;
			opacity: 0;
			z-index: 9;
		}

		.menu-item {
			pointer-events: all;

			@media (width <= #{$lg}) {
				color: transparent;
				pointer-events: none;
			}
		}

		.menu-left,
		.menu-right {
			display: flex;
			column-gap: var(--sp-20);
			transition: var(--transition);
			transition-property: margin-top, padding;

			@media (width <= #{$lg}) {
				display: contents;
				opacity: 0;
			}
		}
        
        .menu-left {
            grid-column: 1;
			justify-content: flex-start;
        }

		 .menu-right {
            grid-column: 3;
            justify-content: flex-end;
        }

        .logo {
            grid-column: 2;
            display: flex;
            justify-content: center;

			@media (width <= #{$lg}) {
				display: none;
			}
        }
    }

	.lang-switch {
		display: none;

		@media (width <= #{$lg}) {
			display: flex;
			gap: var(--sp-6);
			margin-top: var(--sp-36);
		}
	}

	&.open {
		color: var(--white);
		.logo-mobile {
			color: var(--white);
		}
		.menu {
			opacity: 1;
			transition-delay: 0ms;
			pointer-events: all;

			.menu-item {
				opacity: 1;
				color: var(--white);
				pointer-events: all;
				transition-delay: 0ms;
			}

			@media (width <= #{$lg}) {
				background-color: var(--black);
			}
		}
	}
}
</style>