<script>
    // imports
    import { page } from "$app/state";
    import { PortableText } from "@portabletext/svelte";
    import PortableTextStylePlain from "./portableTextStyles/PortableTextStylePlain.svelte";
    import { m } from "$lib/paraglide/messages";
    import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';

    // stores

    // functions
    let { policies, contacts, info } = $props();
</script>

<footer>
	<div class="footer in-14">
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.shop()}</h4>
			<nav>
				<ul>
					<li><a class="footer-item" aria-current={page.url.pathname.startsWith('/shop?category=set') ? 'page' : undefined} href="/shop?category=set">{m.sets()}</a></li>
					<li><a class="footer-item" aria-current={page.url.pathname.startsWith('/shop') ? 'page' : undefined} href="/shop">{m.all_products()}</a></li>
				</ul>
			</nav>
		</div>
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.get_in_touch()}</h4>
			<nav>
				<ul>
					<li><a class="footer-item" aria-current={page.url.pathname.startsWith('/contacts') ? 'page' : undefined} href="/contacts">{m.contacts()}</a></li>
					{#if contacts.instagram}
						<li><a href={contacts.instagram.instagramHref} target="_blank" rel="noopener noreferrer">Instagram</a></li>
					{/if}
				</ul>
			</nav>
		</div>
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.informations()}</h4>
			<nav>
				<ul>
					{#each policies as policy, i}
						<li><a class="footer-item" aria-current={page.url.pathname.startsWith(`/policy/${policy.slug.current}`) ? 'page' : undefined} href="/policy/{policy.slug.current}">{policy.title}</a></li>
					{/each}
				</ul>
			</nav>
		</div>
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.about()}</h4>
			<nav>
				<ul>
					<li><a class="footer-item" aria-current={page.url.pathname.startsWith('/about') ? 'page' : undefined} href="/about">{m.about_lopes_pegna()}</a></li>
					<li><a class="footer-item" aria-current={page.url.pathname.startsWith('/beads') ? 'page' : undefined} href="/beads">{m.beads()}</a></li>
				</ul>
			</nav>
		</div>
		<div class="footer-col lang-switch in-12 uppercase">
			<nav>
				<ul>
					{#each locales as locale (locale)}
						<button class="btn-s" aria-current={getLocale() == locale} onclick={() => {
                            const newPath = localizeHref(page.url.pathname, { locale });
                            window.location.href = newPath;
                        }}>{locale}</button>
					{/each}
				</ul>
			</nav>
		</div>
	</div>
	<div class="credits in-12">
		<div class="credits-col">
			{#if info.vat}
				<p class="uppercase">{m.vat()} {info.vat}</p>
			{/if}
			<p>© {new Date().getFullYear()} Lopes Pegna. {m.all_rights_reserved()}.</p>
		</div>
		{#if info.credits}
			<div class="credits-col portableText">
				<PortableText
				value={info.credits}
				components={{
					block: {
						normal: PortableTextStylePlain,
					},
					listItem: PortableTextStylePlain,
					marks: {
						link: PortableTextStylePlain,
					},
				}}/>
			</div>
		{/if}
	</div>
</footer>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

	footer {
		padding: var(--sp-24);
		display: flex;
		flex-direction: column;
		row-gap: var(--sp-60);
		
		.footer {
			display: flex;
			justify-content: flex-start;
			gap: var(--sp-60);

			h4 {
				margin-bottom: var(--sp-22);
			}

			.lang-switch {
				margin-left: auto;

				ul {
					display: flex;
					gap: var(--sp-6);
				}
			}
		}

		.credits {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;

			.portableText {
				text-align: right;
			}
		}

		:global(a):hover {
			opacity: .5;
		}

		@media (width <= #{$lg}) {
			padding: var(--sp-24) var(--sp-12) var(--sp-120);
			gap: var(--sp-24);

			.footer {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				column-gap: var(--sp-12);
				row-gap: var(--sp-60);

				h4 {
					padding-bottom: var(--sp-6);
					border-bottom: solid 1px var(--black);
					margin-bottom: var(--sp-16);
				}

				.lang-switch {
					margin-left: unset;
				}
			}

			.credits {
				flex-direction: column;
				align-items: flex-start;
				row-gap: var(--sp-12);

				.portableText {
					text-align: left;
				}
			}
		}
	}
</style>