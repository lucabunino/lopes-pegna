<script>
	// imports
	import { PortableText } from '@portabletext/svelte'
	import PortableTextStylePolicy from '$lib/components/portableTextStyles/PortableTextStylePolicy.svelte'
	import { m } from '$lib/paraglide/messages.js'

	// stores
	import { getMenu } from '$lib/stores/menu.svelte.js'
	import { localizeHref } from '$lib/paraglide/runtime.js'

	// functions
	let menuer = getMenu(); menuer.setDark(false); menuer.setDifference(true); menuer.setSmall(true)
	let { data } = $props()
</script>

<nav aria-label="Breadcrumb" class="breadcrumb-mobile in-14 {menuer.open ? 'open' : 'closed'} {menuer.small ? 'small' : 'big'} {menuer.dark ? 'dark' : 'light'} {menuer.difference ? 'difference' : 'normal'}">
	<ol>
		<li><a href={localizeHref('/')}>{m.about_lopes_pegna()}</a></li>
	</ol>
</nav>

<main>
	<section id="policy">
		{#if data.policy.title}
			<h1 class="wo-36">{data.policy.title}</h1>
		{/if}
		{#if data.policy.content}
			<div class="portableText policy wo-16 wo-15-mb">
				<PortableText
					value={data.policy.content}
					components={{
						block: {
							normal: PortableTextStylePolicy,
							h2: PortableTextStylePolicy,
							h3: PortableTextStylePolicy,
							h4: PortableTextStylePolicy,
						},
						listItem: PortableTextStylePolicy,
						marks: { link: PortableTextStylePolicy }
					}}
				/>
			</div>
		{/if}
	</section>
</main>

<style lang="scss">
@use '$lib/scss/breakpoints.module' as *;

main {
	padding-top: var(--sp-200);

	#policy {
		max-width: 800px;
		margin: 0 auto;
		padding: var(--sp-60) var(--sp-24) var(--sp-200);

		h1 {
			padding-bottom: var(--sp-64);
			text-align: center;
		}
	}

	@media (width <= #{$lg}) {
		#policy {
			padding: var(--sp-36) var(--sp-12) var(--sp-160);
		}
	}
}
</style>
