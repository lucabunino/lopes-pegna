<script>
    // imports
    import { page } from "$app/state";
    import { PortableText } from "@portabletext/svelte";
    import PortableTextStylePlain from "./portableTextStyles/PortableTextStylePlain.svelte";
    import { m } from "$lib/paraglide/messages";
    import { getLocale, locales, localizeHref } from '$lib/paraglide/runtime';
    import { cartStore } from '$lib/stores/cart.svelte.js';
    import { getCountry } from '$lib/stores/country.svelte.js';

    // functions
    let { policies, contacts, info, country, countries = [] } = $props();
    const countryStore = getCountry()
    const currentCountry = $derived(countries.find(c => c.isoCode === countryStore.current))
    const currentCountryLabel = $derived(currentCountry ? `${currentCountry.name} (${currentCountry.currency.isoCode})` : (country ?? ''))

    async function handleCountryChange(e) {
        const selected = e.target.value
        countryStore.set(selected)
        await fetch('/api/country', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ country: selected })
        })
        cartStore.clear()
        window.location.reload()
    }
</script>

<footer>
	<div class="footer in-14">
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.shop()}</h4>
			<nav>
				<ul>
					<li><a class="footer-item btn-s" aria-current={page.route.id === '/shop' && page.url.searchParams.get('category') === 'set' ? 'page' : undefined} href={localizeHref("/shop?category=set")}>{m.sets()}</a></li>
					<li><a class="footer-item btn-s" aria-current={page.route.id === '/shop' && !page.url.searchParams.get('category') ? 'page' : undefined} href={localizeHref("/shop")}>{m.all_products()}</a></li>
				</ul>
			</nav>
		</div>
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.get_in_touch()}</h4>
			<nav>
				<ul>
					<li><a class="footer-item btn-s" aria-current={page.route.id === '/contacts' ? 'page' : undefined} href={localizeHref("/contacts")}>{m.contacts()}</a></li>
					{#if contacts.instagram}
						<li><a class="footer-item btn-s" href={contacts.instagram.instagramHref} target="_blank" rel="noopener noreferrer">Instagram</a></li>
					{/if}
				</ul>
			</nav>
		</div>
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.informations()}</h4>
			<nav>
				<ul>
					{#each policies as policy (policy.slug.current)}
						<li><a class="footer-item btn-s" aria-current={page.route.id === '/policy/[slug]' && page.params?.slug === policy.slug.current ? 'page' : undefined} href={localizeHref(`/policy/${policy.slug.current}`)}>{policy.title}</a></li>
					{/each}
				</ul>
			</nav>
		</div>
		<div class="footer-col">
			<h4 class="in-12 uppercase">{m.about()}</h4>
			<nav>
				<ul>
					<li><a class="footer-item btn-s" aria-current={page.route.id === '/about' ? 'page' : undefined} href={localizeHref("/about")}>{m.about_lopes_pegna()}</a></li>
					<li><a class="footer-item btn-s" aria-current={page.route.id === '/beads' ? 'page' : undefined} href={localizeHref("/beads")}>{m.beads()}</a></li>
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
			{#if countries.length > 0}
				<div class="select-wrapper btn-s in-12 uppercase">
					<span class="select-display" aria-hidden="true"><span class="normalcase">{m.country()}: </span>{currentCountryLabel} <span class="select-arrow"></span></span>
					<select
						value={countryStore.current ?? country}
						onchange={handleCountryChange}
						aria-label="Select country"
					>
						{#each countries as c (c.isoCode)}
							<option value={c.isoCode}>{c.name} ({c.currency.isoCode})</option>
						{/each}
					</select>
				</div>
			{/if}
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
					block: { normal: PortableTextStylePlain },
					listItem: PortableTextStylePlain,
					marks: { link: PortableTextStylePlain },
				}}/>
			</div>
		{/if}
	</div>
</footer>

<style lang="scss">
@use '$lib/scss/breakpoints.module.scss' as *;

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
				display: flex;
				flex-direction: column;
				align-items: flex-end;
				row-gap: var(--sp-6);

				ul {
					display: flex;
					column-gap: var(--sp-6);
				}

				.select-wrapper {
					position: relative;
					display: inline-block;
					cursor: pointer;

					.select-display {
						display: inline-flex;
						align-items: center;
						gap: .4em;
						white-space: nowrap;
						pointer-events: none;

						.select-arrow {
							display: inline-block;
							width: .5em;
							height: .5em;
							border-right: 1.5px solid currentColor;
							border-bottom: 1.5px solid currentColor;
							transform: rotate(45deg) translateY(-30%);
							flex-shrink: 0;
						}
					}

					select {
						position: absolute;
						inset: 0;
						width: 100%;
						height: 100%;
						opacity: 0;
						cursor: pointer;
					}
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

		@media (width <= #{$lg}) {
			padding: var(--sp-24) var(--sp-12) var(--sp-154);
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
					align-items: flex-start;
					// row-gap: unset;
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
